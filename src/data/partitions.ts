import {
  TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID,
  type PoleIndex,
} from './memberships';
import type { ReininTraitId } from './socionics';
import { SOCIONIC_TYPE_ORDER, type SocionicTypeId } from './types';

export type TraitVectorValue = 0 | 1;
export type PartitionKind = 'dichotomy' | 'tetrachotomy' | 'octochotomy';
export type PartitionDiagnosticReason =
  | 'empty-traits'
  | 'unsupported-trait-count'
  | 'duplicate-traits'
  | 'dependent-traits';

export interface PartitionClassPole {
  traitId: ReininTraitId;
  poleIndex: PoleIndex;
}

export interface PartitionClass {
  key: string;
  poles: readonly PartitionClassPole[];
  typeIds: readonly SocionicTypeId[];
}

export interface PartitionResult {
  ok: true;
  traitIds: readonly ReininTraitId[];
  rank: number;
  kind: PartitionKind;
  classes: readonly PartitionClass[];
}

export interface PartitionDiagnostic {
  ok: false;
  traitIds: readonly ReininTraitId[];
  rank: number;
  reason: PartitionDiagnosticReason;
  message: string;
}

export type PartitionBuildResult = PartitionResult | PartitionDiagnostic;

const getMembershipPoleByType = (traitId: ReininTraitId): ReadonlyMap<SocionicTypeId, PoleIndex> => {
  const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[traitId];
  const poleByType = new Map<SocionicTypeId, PoleIndex>();

  membership.poles.forEach(pole => {
    pole.typeIds.forEach(typeId => {
      poleByType.set(typeId, pole.poleIndex);
    });
  });

  return poleByType;
};

export function getTraitVector(traitId: ReininTraitId): readonly TraitVectorValue[] {
  const poleByType = getMembershipPoleByType(traitId);

  return SOCIONIC_TYPE_ORDER.map(typeId => {
    const poleIndex = poleByType.get(typeId);
    if (poleIndex === undefined) {
      throw new Error(`Missing type ${typeId} in ${traitId} membership`);
    }

    // Ground-truth socion columns encode the first UI pole as 1 and the second as 0.
    return poleIndex === 0 ? 1 : 0;
  });
}

export function getTraitVectorValue(
  traitId: ReininTraitId,
  typeId: SocionicTypeId,
): TraitVectorValue {
  const typeIndex = SOCIONIC_TYPE_ORDER.indexOf(typeId);
  if (typeIndex === -1) {
    throw new Error(`Unknown socionic type ${typeId}`);
  }

  return getTraitVector(traitId)[typeIndex];
}

export function rankBinaryVectors(
  vectors: readonly (readonly TraitVectorValue[])[],
): number {
  if (vectors.length === 0) {
    return 0;
  }

  const width = vectors[0].length;
  if (vectors.some(vector => vector.length !== width)) {
    throw new Error('Cannot rank binary vectors with different lengths');
  }

  const matrix = vectors.map(vector => [...vector]);
  let rank = 0;

  for (let column = 0; column < width && rank < matrix.length; column += 1) {
    const pivotRow = matrix.findIndex((row, rowIndex) => (
      rowIndex >= rank && row[column] === 1
    ));

    if (pivotRow === -1) {
      continue;
    }

    [matrix[rank], matrix[pivotRow]] = [matrix[pivotRow], matrix[rank]];

    matrix.forEach((row, rowIndex) => {
      if (rowIndex !== rank && row[column] === 1) {
        for (let index = column; index < width; index += 1) {
          row[index] = (row[index] ^ matrix[rank][index]) as TraitVectorValue;
        }
      }
    });

    rank += 1;
  }

  return rank;
}

export function rankTraitVectors(traitIds: readonly ReininTraitId[]): number {
  return rankBinaryVectors(traitIds.map(traitId => getTraitVector(traitId)));
}

const getPartitionKind = (traitCount: number): PartitionKind | null => {
  if (traitCount === 1) return 'dichotomy';
  if (traitCount === 2) return 'tetrachotomy';
  if (traitCount === 3) return 'octochotomy';
  return null;
};

const buildPoleCombinations = (traitCount: number): readonly (readonly PoleIndex[])[] => {
  const combinationCount = 2 ** traitCount;

  return Array.from({ length: combinationCount }, (_, combinationIndex) => (
    Array.from({ length: traitCount }, (_unused, traitIndex) => (
      ((combinationIndex >> (traitCount - traitIndex - 1)) & 1) as PoleIndex
    ))
  ));
};

const getPoleIndexForVectorValue = (value: TraitVectorValue): PoleIndex => (
  value === 1 ? 0 : 1
);

const buildPartitionClassKey = (
  traitIds: readonly ReininTraitId[],
  poleIndexes: readonly PoleIndex[],
): string => (
  traitIds.map((traitId, index) => `${traitId}:${poleIndexes[index]}`).join('|')
);

export function buildPartition(traitIds: readonly ReininTraitId[]): PartitionBuildResult {
  const kind = getPartitionKind(traitIds.length);
  const rank = rankTraitVectors(traitIds);

  if (traitIds.length === 0) {
    return {
      ok: false,
      traitIds,
      rank,
      reason: 'empty-traits',
      message: 'Partition requires at least one trait.',
    };
  }

  if (kind === null) {
    return {
      ok: false,
      traitIds,
      rank,
      reason: 'unsupported-trait-count',
      message: 'Partition supports one, two, or three traits.',
    };
  }

  if (new Set(traitIds).size !== traitIds.length) {
    return {
      ok: false,
      traitIds,
      rank,
      reason: 'duplicate-traits',
      message: 'Partition traits must be unique.',
    };
  }

  if (rank !== traitIds.length) {
    return {
      ok: false,
      traitIds,
      rank,
      reason: 'dependent-traits',
      message: 'Selected traits are dependent and cannot form a full partition.',
    };
  }

  const vectors = traitIds.map(traitId => getTraitVector(traitId));
  const classes = buildPoleCombinations(traitIds.length).map(poleIndexes => ({
    key: buildPartitionClassKey(traitIds, poleIndexes),
    poles: traitIds.map((traitId, index) => ({
      traitId,
      poleIndex: poleIndexes[index],
    })),
    typeIds: SOCIONIC_TYPE_ORDER.filter((_typeId, typeIndex) => (
      vectors.every((vector, vectorIndex) => (
        getPoleIndexForVectorValue(vector[typeIndex]) === poleIndexes[vectorIndex]
      ))
    )),
  }));
  const expectedClassSize = SOCIONIC_TYPE_ORDER.length / classes.length;

  if (classes.some(partitionClass => partitionClass.typeIds.length !== expectedClassSize)) {
    return {
      ok: false,
      traitIds,
      rank,
      reason: 'dependent-traits',
      message: 'Selected traits do not form equally sized partition classes.',
    };
  }

  return {
    ok: true,
    traitIds,
    rank,
    kind,
    classes,
  };
}
