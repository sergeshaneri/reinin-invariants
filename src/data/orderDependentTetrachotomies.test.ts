import { describe, expect, it } from 'vitest';
import { getTetrachotomyFormulaById, TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL } from './tetrachotomies';
import { ORDER_DEPENDENT_TETRACHOTOMIES, getOrderDependentTetrachotomy } from './orderDependentTetrachotomies';

const expected = {
  process: ['tetra-10', 'tetra-17', 'tetra-30', 'tetra-34'],
  positivism: ['tetra-09', 'tetra-15', 'tetra-24', 'tetra-25'],
  asking: ['tetra-11', 'tetra-16', 'tetra-31', 'tetra-35'],
} as const;

describe('author-defined order-dependent (2×4)×4 family', () => {
  it('registers the twelve formulas independently of the written equation target', () => {
    expect(ORDER_DEPENDENT_TETRACHOTOMIES).toHaveLength(12);
    expect(new Set(ORDER_DEPENDENT_TETRACHOTOMIES.map(entry => entry.formulaId)).size).toBe(12);
    for (const [orderTraitId, ids] of Object.entries(expected)) {
      expect(ORDER_DEPENDENT_TETRACHOTOMIES.filter(entry => entry.orderTraitId === orderTraitId).map(entry => entry.formulaId)).toEqual(ids);
      for (const id of ids) {
        const formula = getTetrachotomyFormulaById(id)!;
        expect([formula.targetTraitId, ...formula.basisTraitIds]).toContain(orderTraitId);
        expect([formula.targetTraitId, ...formula.basisTraitIds]).not.toContain('democracy');
        expect(getOrderDependentTetrachotomy(id)?.orderTraitId).toBe(orderTraitId);
      }
    }
  });
  it('preserves the four named families from the author description', () => {
    expect(getOrderDependentTetrachotomy('tetra-17')?.name).toBe('Стили принятия решений');
    expect(getOrderDependentTetrachotomy('tetra-30')?.name).toBe('Реализации');
    expect(getOrderDependentTetrachotomy('tetra-34')?.name).toBe('Группы внедрения');
    expect(getOrderDependentTetrachotomy('tetra-09')?.name).toBe('Социализации');
    expect(getOrderDependentTetrachotomy('tetra-35')?.name).toBe('Способы общения');
  });
  it('retains the specified functional-feature products for each order trait', () => {
    expect(getOrderDependentTetrachotomy('tetra-10')?.featureProducts).toEqual(['ин/кт × сл/сб', 'вб/лб × оц/ст']);
    expect(getOrderDependentTetrachotomy('tetra-09')?.featureProducts).toEqual(['оц/ст × сл/сб', 'вб/лб × ин/кт']);
    expect(getOrderDependentTetrachotomy('tetra-11')?.featureProducts).toEqual(['оц/ст × ин/кт', 'вб/лб × сл/сб']);
  });
  it('matches all three displayed traits to the exact source formula', () => {
    const traitByLabel = new Map(Object.entries(TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL));
    for (const entry of ORDER_DEPENDENT_TETRACHOTOMIES) {
      const formula = getTetrachotomyFormulaById(entry.formulaId)!;
      const displayed = entry.notation.split(' · ').map(label => traitByLabel.get(label.replace('−', '-')));
      expect(displayed).not.toContain(undefined);
      expect([...displayed].sort()).toEqual([formula.targetTraitId, ...formula.basisTraitIds].sort());
    }
  });
  it('excludes cracy and unrelated formulas', () => {
    for (const id of ['tetra-01', 'tetra-08', 'tetra-14', 'tetra-20', 'tetra-21', 'tetra-22', 'tetra-23']) {
      expect(getOrderDependentTetrachotomy(id)).toBeUndefined();
    }
    expect(getOrderDependentTetrachotomy(undefined)).toBeUndefined();
  });
});
