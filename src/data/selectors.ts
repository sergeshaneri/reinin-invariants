import {
  ASPECTS,
  FUNCTIONS,
  MODEL_A_LAYOUT,
  REININ_TRAITS,
  type AspectId,
  type ReininTrait,
  type ReininTraitId,
} from './socionics';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID, type PoleIndex } from './memberships';
import {
  buildPartition,
  type PartitionBuildResult,
  type PartitionDiagnostic,
  type PartitionResult,
} from './partitions';
import {
  SOCIONIC_TYPES_BY_ID,
  type LocalizedText,
  type SocionicTypeId,
} from './types';

export type Locale = 'ru' | 'en';

export interface TypeSummaryViewModel {
  id: SocionicTypeId;
  name: string;
  quadraId: string;
  aliases: readonly string[];
}

export interface TraitSummaryViewModel {
  id: ReininTraitId;
  name: string;
}

export interface TypeModelAssignmentViewModel {
  functionId: number;
  functionName: string;
  aspectId: AspectId;
  aspectName: string;
  aspectFullName: string;
}

export interface TypeModelViewModel {
  type: TypeSummaryViewModel;
  assignments: readonly TypeModelAssignmentViewModel[];
}

export interface TypeTraitExampleViewModel {
  type: TypeSummaryViewModel;
  trait: TraitSummaryViewModel;
  pole: {
    poleIndex: PoleIndex;
    name: string;
    description: string;
  };
}

export interface PartitionClassViewModel {
  key: string;
  poles: readonly {
    trait: TraitSummaryViewModel;
    poleIndex: PoleIndex;
    poleName: string;
  }[];
  types: readonly TypeSummaryViewModel[];
}

export interface PartitionViewModel {
  ok: true;
  traitIds: readonly ReininTraitId[];
  rank: number;
  kind: PartitionResult['kind'];
  traits: readonly TraitSummaryViewModel[];
  classes: readonly PartitionClassViewModel[];
}

export interface PartitionDiagnosticViewModel {
  ok: false;
  traitIds: readonly ReininTraitId[];
  rank: number;
  reason: PartitionDiagnostic['reason'];
  message: string;
  traits: readonly TraitSummaryViewModel[];
}

const getLocalizedText = (text: LocalizedText, locale: Locale): string => (
  text[locale] ?? text.ru
);

const getTraitById = (traitId: ReininTraitId): ReininTrait => {
  const trait = REININ_TRAITS.find(candidate => candidate.id === traitId);
  if (!trait) {
    throw new Error(`Unknown Reinin trait ${traitId}`);
  }

  return trait;
};

const selectTypeSummary = (
  typeId: SocionicTypeId,
  locale: Locale,
): TypeSummaryViewModel => {
  const type = SOCIONIC_TYPES_BY_ID[typeId];

  return {
    id: type.id,
    name: getLocalizedText(type.names, locale),
    quadraId: type.quadraId,
    aliases: [
      ...(type.aliases.socionics ?? []),
      ...(type.aliases.mbtiLike ?? []),
    ],
  };
};

const selectTraitSummary = (traitId: ReininTraitId): TraitSummaryViewModel => {
  const trait = getTraitById(traitId);

  return {
    id: trait.id,
    name: trait.name,
  };
};

const findMembershipPoleIndex = (
  traitId: ReininTraitId,
  typeId: SocionicTypeId,
): PoleIndex => {
  const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[traitId];
  const pole = membership.poles.find(candidate => candidate.typeIds.includes(typeId));

  if (!pole) {
    throw new Error(`Missing type ${typeId} in ${traitId} membership`);
  }

  return pole.poleIndex;
};

const selectPartition = (
  partition: PartitionBuildResult,
  locale: Locale,
): PartitionViewModel | PartitionDiagnosticViewModel => {
  const traits = partition.traitIds.map(selectTraitSummary);

  if (!partition.ok) {
    return {
      ok: false,
      traitIds: partition.traitIds,
      rank: partition.rank,
      reason: partition.reason,
      message: partition.message,
      traits,
    };
  }

  return {
    ok: true,
    traitIds: partition.traitIds,
    rank: partition.rank,
    kind: partition.kind,
    traits,
    classes: partition.classes.map(partitionClass => ({
      key: partitionClass.key,
      poles: partitionClass.poles.map(pole => {
        const trait = getTraitById(pole.traitId);

        return {
          trait: selectTraitSummary(pole.traitId),
          poleIndex: pole.poleIndex,
          poleName: trait.poles[pole.poleIndex].name,
        };
      }),
      types: partitionClass.typeIds.map(typeId => selectTypeSummary(typeId, locale)),
    })),
  };
};

export function selectTypeModelView(
  typeId: SocionicTypeId,
  locale: Locale = 'ru',
): TypeModelViewModel {
  const type = SOCIONIC_TYPES_BY_ID[typeId];

  return {
    type: selectTypeSummary(typeId, locale),
    assignments: MODEL_A_LAYOUT.map(functionId => {
      const assignment = type.modelA.find(candidate => candidate.functionId === functionId);
      const socionicFunction = FUNCTIONS.find(candidate => candidate.id === functionId);

      if (!assignment || !socionicFunction) {
        throw new Error(`Missing Model A assignment for ${typeId} function ${functionId}`);
      }

      const aspect = ASPECTS.find(candidate => candidate.id === assignment.aspectId);
      if (!aspect) {
        throw new Error(`Unknown aspect ${assignment.aspectId}`);
      }

      return {
        functionId,
        functionName: socionicFunction.name,
        aspectId: aspect.id,
        aspectName: aspect.name,
        aspectFullName: aspect.fullName,
      };
    }),
  };
}

export function selectTypeTraitExample(
  typeId: SocionicTypeId,
  traitId: ReininTraitId,
  locale: Locale = 'ru',
): TypeTraitExampleViewModel {
  const trait = getTraitById(traitId);
  const poleIndex = findMembershipPoleIndex(traitId, typeId);

  return {
    type: selectTypeSummary(typeId, locale),
    trait: selectTraitSummary(traitId),
    pole: {
      poleIndex,
      name: trait.poles[poleIndex].name,
      description: trait.poles[poleIndex].description,
    },
  };
}

export function selectTetrachotomyView(
  traitIds: readonly [ReininTraitId, ReininTraitId],
  locale: Locale = 'ru',
): PartitionViewModel | PartitionDiagnosticViewModel {
  return selectPartition(buildPartition(traitIds), locale);
}

export function selectOctochotomyView(
  traitIds: readonly [ReininTraitId, ReininTraitId, ReininTraitId],
  locale: Locale = 'ru',
): PartitionViewModel | PartitionDiagnosticViewModel {
  return selectPartition(buildPartition(traitIds), locale);
}
