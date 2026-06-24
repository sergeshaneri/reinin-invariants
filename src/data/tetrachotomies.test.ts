import { describe, expect, it } from 'vitest';
import { rankTraitVectors } from './partitions';
import { REININ_TRAITS } from './socionics';
import {
  TETRACHOTOMY_FORMULAS,
  TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL,
  getComputedTetrachotomyClassTypeSets,
  getTetrachotomyFormulaById,
} from './tetrachotomies';
import { SOCIONIC_TYPE_ORDER } from './types';

const sortedSetKey = (typeIds: readonly string[]): string => (
  [...typeIds].sort().join('|')
);

const groupSetKeys = (groups: readonly (readonly string[])[]): readonly string[] => (
  groups.map(sortedSetKey).sort()
);

describe('tetrachotomy source formulas', () => {
  it('maps every source label to a registered Reinin trait', () => {
    const traitIds = new Set(REININ_TRAITS.map(trait => trait.id));

    Object.values(TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL).forEach(traitId => {
      expect(traitIds.has(traitId)).toBe(true);
    });
  });

  it('loads the 35 extracted tetrachotomy source formulas with stable IDs', () => {
    expect(TETRACHOTOMY_FORMULAS).toHaveLength(35);
    expect(TETRACHOTOMY_FORMULAS.map(formula => formula.id)).toEqual(
      Array.from({ length: 35 }, (_unused, index) => (
        `tetra-${String(index + 1).padStart(2, '0')}`
      )),
    );
    expect(new Set(TETRACHOTOMY_FORMULAS.map(formula => formula.source.formulaText)).size).toBe(35);
  });

  it('preserves source metadata and 4x4 type groups for every formula', () => {
    const typeIds = new Set(SOCIONIC_TYPE_ORDER);

    TETRACHOTOMY_FORMULAS.forEach((formula, index) => {
      expect(formula.source.tetraNumber).toBe(index + 1);
      expect(formula.source.tableNumber).toBeGreaterThan(0);
      expect(formula.source.document).toContain('docs.google.com');
      expect(formula.source.formulaText).toContain('=');
      expect(formula.status).toBe('extracted');
      expect(formula.groups).toHaveLength(4);

      const flattenedTypes = formula.groups.flatMap(group => group.typeIds);
      expect(flattenedTypes).toHaveLength(16);
      expect(new Set(flattenedTypes).size).toBe(16);
      flattenedTypes.forEach(typeId => {
        expect(typeIds.has(typeId)).toBe(true);
      });
      formula.groups.forEach(group => {
        expect(group.typeIds).toHaveLength(4);
      });
    });
  });

  it('parses formula target and basis traits from source text', () => {
    expect(getTetrachotomyFormulaById('tetra-01')).toMatchObject({
      source: { formulaText: 'Верт = Бс/Пр Х Ит/Сн (1,а)' },
      targetTraitId: 'vertness',
      basisTraitIds: ['carefree', 'intuition'],
    });
    expect(getTetrachotomyFormulaById('tetra-35')).toMatchObject({
      source: { formulaText: 'Лг/Эт = ?/! Х Рс/Рш (35,a)' },
      targetTraitId: 'logic',
      basisTraitIds: ['asking', 'judicious'],
    });
  });

  it('treats every source formula as a rank-2 tetrachotomy basis', () => {
    TETRACHOTOMY_FORMULAS.forEach(formula => {
      expect(formula.basisTraitIds).not.toContain(formula.targetTraitId);
      expect(new Set([formula.targetTraitId, ...formula.basisTraitIds]).size).toBe(3);
      expect(rankTraitVectors(formula.basisTraitIds)).toBe(2);
    });
  });

  it('matches source groups to computed partition classes regardless of class order', () => {
    TETRACHOTOMY_FORMULAS.forEach(formula => {
      const sourceGroups = formula.groups.map(group => group.typeIds);
      const computedGroups = getComputedTetrachotomyClassTypeSets(formula);

      expect(groupSetKeys(sourceGroups)).toEqual(groupSetKeys(computedGroups));
    });
  });
});
