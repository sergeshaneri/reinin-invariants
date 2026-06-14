import { describe, expect, it } from 'vitest';
import {
  REININ_TRAITS,
  SOCIONIC_TYPE_ORDER,
  TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID,
} from './socionics';
import {
  buildPartition,
  getTraitVector,
  getTraitVectorValue,
  rankBinaryVectors,
  rankTraitVectors,
  type TraitVectorValue,
} from './partitions';

describe('trait vectors', () => {
  it('returns vectors in the canonical socion order', () => {
    expect(getTraitVector('vertness')).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
    expect(getTraitVector('carefree')).toEqual([1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0]);
    expect(getTraitVector('talness')).toEqual([1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1]);
  });

  it('returns one binary value for every socionic type', () => {
    REININ_TRAITS.forEach(trait => {
      const vector = getTraitVector(trait.id);

      expect(vector, `${trait.id} vector`).toHaveLength(SOCIONIC_TYPE_ORDER.length);
      vector.forEach(value => {
        expect([0, 1], `${trait.id} vector value`).toContain(value);
      });
    });
  });

  it('maps every vector value back to the matching pole membership', () => {
    REININ_TRAITS.forEach(trait => {
      const vector = getTraitVector(trait.id);
      const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[trait.id];

      SOCIONIC_TYPE_ORDER.forEach((typeId, typeIndex) => {
        const expectedPole = membership.poles.find(pole => pole.typeIds.includes(typeId));
        const expectedValue = expectedPole?.poleIndex === 0 ? 1 : 0;

        expect(expectedPole, `${trait.id} ${typeId} membership`).toBeDefined();
        expect(vector[typeIndex], `${trait.id} ${typeId} vector value`).toBe(
          expectedValue,
        );
        expect(getTraitVectorValue(trait.id, typeId), `${trait.id} ${typeId} lookup`).toBe(
          expectedValue,
        );
      });
    });
  });

  it('is deterministic across repeated calls', () => {
    REININ_TRAITS.forEach(trait => {
      expect(getTraitVector(trait.id), `${trait.id} repeated vector`).toEqual(
        getTraitVector(trait.id),
      );
    });
  });
});

describe('partitions', () => {
  it('builds one-trait dichotomies as two classes of eight types', () => {
    const partition = buildPartition(['vertness']);

    expect(partition.ok).toBe(true);
    if (!partition.ok) return;

    expect(partition.kind).toBe('dichotomy');
    expect(partition.rank).toBe(1);
    expect(partition.classes).toHaveLength(2);
    expect(partition.classes.map(partitionClass => partitionClass.typeIds)).toEqual([
      ['ILE', 'ESE', 'EIE', 'SLE', 'LIE', 'SEE', 'IEE', 'LSE'],
      ['SEI', 'LII', 'LSI', 'IEI', 'ESI', 'ILI', 'SLI', 'EII'],
    ]);
    partition.classes.forEach(partitionClass => {
      expect(partitionClass.typeIds).toHaveLength(8);
    });
  });

  it('builds two-trait tetrachotomies as four classes of four types', () => {
    const partition = buildPartition(['vertness', 'nalness']);

    expect(partition.ok).toBe(true);
    if (!partition.ok) return;

    expect(partition.kind).toBe('tetrachotomy');
    expect(partition.rank).toBe(2);
    expect(partition.classes).toHaveLength(4);
    expect(partition.classes.map(partitionClass => partitionClass.typeIds)).toEqual([
      ['ILE', 'SLE', 'SEE', 'IEE'],
      ['ESE', 'EIE', 'LIE', 'LSE'],
      ['SEI', 'IEI', 'ILI', 'SLI'],
      ['LII', 'LSI', 'ESI', 'EII'],
    ]);
    partition.classes.forEach(partitionClass => {
      expect(partitionClass.typeIds).toHaveLength(4);
    });
  });

  it('builds three independent traits as eight classes of two types', () => {
    const partition = buildPartition(['vertness', 'nalness', 'carefree']);

    expect(partition.ok).toBe(true);
    if (!partition.ok) return;

    expect(partition.kind).toBe('octochotomy');
    expect(partition.rank).toBe(3);
    expect(partition.classes).toHaveLength(8);
    expect(partition.classes.map(partitionClass => partitionClass.typeIds)).toEqual([
      ['ILE', 'IEE'],
      ['SLE', 'SEE'],
      ['EIE', 'LIE'],
      ['ESE', 'LSE'],
      ['SEI', 'SLI'],
      ['IEI', 'ILI'],
      ['LSI', 'ESI'],
      ['LII', 'EII'],
    ]);
    partition.classes.forEach(partitionClass => {
      expect(partitionClass.typeIds).toHaveLength(2);
    });
  });

  it('assigns every type exactly once in a valid partition', () => {
    const partition = buildPartition(['carefree', 'yielding', 'intuition']);

    expect(partition.ok).toBe(true);
    if (!partition.ok) return;

    const typeIds = partition.classes.flatMap(partitionClass => partitionClass.typeIds);

    expect(typeIds).toHaveLength(SOCIONIC_TYPE_ORDER.length);
    expect(new Set(typeIds)).toEqual(new Set(SOCIONIC_TYPE_ORDER));
  });

  it('preserves selected trait and pole ids in stable class keys', () => {
    const partition = buildPartition(['vertness', 'nalness']);

    expect(partition.ok).toBe(true);
    if (!partition.ok) return;

    expect(partition.classes.map(partitionClass => partitionClass.key)).toEqual([
      'vertness:0|nalness:0',
      'vertness:0|nalness:1',
      'vertness:1|nalness:0',
      'vertness:1|nalness:1',
    ]);
    expect(partition.classes[0].poles).toEqual([
      { traitId: 'vertness', poleIndex: 0 },
      { traitId: 'nalness', poleIndex: 0 },
    ]);
  });

  it('rejects duplicate trait selections with a diagnostic', () => {
    const partition = buildPartition(['vertness', 'vertness']);

    expect(partition).toMatchObject({
      ok: false,
      reason: 'duplicate-traits',
      rank: 1,
    });
  });

  it('rejects empty and unsupported partition requests with diagnostics', () => {
    expect(buildPartition([])).toMatchObject({
      ok: false,
      reason: 'empty-traits',
      rank: 0,
    });
    expect(buildPartition(['vertness', 'nalness', 'talness', 'carefree'])).toMatchObject({
      ok: false,
      reason: 'unsupported-trait-count',
      rank: 4,
    });
  });

  it('rejects dependent trait requests with a diagnostic', () => {
    const dependentTriple = REININ_TRAITS
      .flatMap((leftTrait, leftIndex) => (
        REININ_TRAITS.slice(leftIndex + 1).flatMap((rightTrait, rightOffset) => (
          REININ_TRAITS.slice(leftIndex + rightOffset + 2).map(thirdTrait => [
            leftTrait.id,
            rightTrait.id,
            thirdTrait.id,
          ] as const)
        ))
      ))
      .find(traitIds => !buildPartition(traitIds).ok);

    expect(dependentTriple).toBeDefined();
    if (!dependentTriple) return;

    expect(buildPartition(dependentTriple)).toMatchObject({
      ok: false,
      reason: 'dependent-traits',
      rank: 3,
    });
  });
});

describe('GF(2) rank', () => {
  it('returns rank 1 for one non-empty trait vector', () => {
    REININ_TRAITS.forEach(trait => {
      expect(rankTraitVectors([trait.id]), `${trait.id} rank`).toBe(1);
    });
  });

  it('returns rank 2 for every pair of different confirmed trait vectors', () => {
    REININ_TRAITS.forEach((leftTrait, leftIndex) => {
      REININ_TRAITS.slice(leftIndex + 1).forEach(rightTrait => {
        expect(
          rankTraitVectors([leftTrait.id, rightTrait.id]),
          `${leftTrait.id} + ${rightTrait.id} rank`,
        ).toBe(2);
      });
    });
  });

  it('returns rank below 3 for a generic dependent triple', () => {
    const left: readonly TraitVectorValue[] = [1, 0, 1, 0];
    const right: readonly TraitVectorValue[] = [0, 1, 1, 0];
    const xor: readonly TraitVectorValue[] = [1, 1, 0, 0];

    expect(rankBinaryVectors([left, right, xor])).toBe(2);
  });

  it('does not mutate input vectors', () => {
    const vectors: readonly (readonly TraitVectorValue[])[] = [
      [1, 0, 1, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
    ];
    const before = vectors.map(vector => [...vector]);

    rankBinaryVectors(vectors);

    expect(vectors).toEqual(before);
  });

  it('is deterministic for permuted input order', () => {
    const left: readonly TraitVectorValue[] = [1, 0, 1, 0];
    const right: readonly TraitVectorValue[] = [0, 1, 1, 0];
    const independent: readonly TraitVectorValue[] = [0, 0, 0, 1];

    expect(rankBinaryVectors([left, right, independent])).toBe(
      rankBinaryVectors([independent, left, right]),
    );
  });

  it('rejects vectors with different lengths', () => {
    expect(() => rankBinaryVectors([[1, 0], [1]])).toThrow(
      'Cannot rank binary vectors with different lengths',
    );
  });
});
