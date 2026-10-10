import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { selectPartitionExplorerView } from '../data/selectors';
import { getTetrachotomyFormulaById } from '../data/tetrachotomies';
import { ORDER_DEPENDENT_TETRACHOTOMIES } from '../data/orderDependentTetrachotomies';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from '../data/memberships';
import { TetrachotomyOrderPanel } from './TetrachotomyOrderPanel';

describe('order condition after the (2×4)×4 source diagram', () => {
  for (const mode of ['icon', 'symbol', 'icon-symbol'] as const) {
    it(`uses ${mode} for both the diagram and every order-condition aspect block`, () => {
      for (const entry of ORDER_DEPENDENT_TETRACHOTOMIES) {
        const formula = getTetrachotomyFormulaById(entry.formulaId)!;
        const initial = selectPartitionExplorerView(formula.basisTraitIds);
        if (!initial.partition.ok) throw new Error('Expected valid tetrachotomy');
        for (const partitionClass of initial.partition.classes) {
          const selected = selectPartitionExplorerView(formula.basisTraitIds, partitionClass.key);
          const html = renderToString(<TetrachotomyOrderPanel view={selected} aspectDisplayMode={mode} />);
          const aspectCount = entry.orderTraitId === 'process' ? 16 : 24;
          expect(html.match(new RegExp(`data-aspect-glyph-mode="${mode}"`, 'g')) ?? []).toHaveLength(aspectCount);
          expect(html.match(/data-aspect-icon-size=/g) ?? []).toHaveLength(mode === 'symbol' ? 0 : aspectCount);
        }
      }
    });
  }
  it.each(ORDER_DEPENDENT_TETRACHOTOMIES.map(entry => [entry.formulaId, entry.orderTraitId] as const))('preserves every condition and common pole for %s', (id, orderTraitId) => {
    const formula = getTetrachotomyFormulaById(id)!;
    const initial = selectPartitionExplorerView(formula.basisTraitIds);
    if (!initial.partition.ok) throw new Error('Expected valid tetrachotomy');
    const conditionCount = orderTraitId === 'process' ? 1 : 2;
    for (const partitionClass of initial.partition.classes) {
      const selected = selectPartitionExplorerView(formula.basisTraitIds, partitionClass.key);
      const pole = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[orderTraitId].poles.find(candidate => partitionClass.types.every(type => candidate.typeIds.includes(type.id)))!;
      const html = renderToString(<TetrachotomyOrderPanel view={selected} aspectDisplayMode="icon-symbol" />);
      expect(html).toContain(`data-tetrachotomy-order-panel="${id}"`);
      expect(html).toContain(`data-order-trait="${orderTraitId}"`);
      expect(html).toContain(`data-order-pole="${pole.poleIndex}"`);
      expect(html).toContain('data-order-ordinary-diagram="0"');
      expect(html.match(/data-order-condition=/g)).toHaveLength(conditionCount);
      expect(html.match(/data-order-view-select=/g)).toHaveLength(conditionCount);
      expect(html.match(/data-order-aspect-block=/g)).toHaveLength(conditionCount * 4);
      expect(html.match(/data-order-function-block=/g)).toHaveLength(conditionCount * 4);
      expect(html).toContain('data-aspect-glyph-mode="icon-symbol"');
      if (orderTraitId === 'process') {
        expect(html).toContain('Циклический порядок макроаспектов');
        expect(html.includes('Каждый макроаспект занимает один такт целиком. У разных типов макроаспекты находятся в разных тактах.')).toBe(true);
        expect(html.includes('Обход тактов в модели А происходит по пунктирной стрелке. Первый такт — функции 3 и 5.')).toBe(true);
        expect(html).not.toMatch(/полу(?:такт)/iu);
        expect(html).toContain('marching-ants-cw');
        expect(html).toContain('marching-ants-ccw');
      } else {
        expect(html).toContain('Эквивалентность 1');
        expect(html).toContain('Эквивалентность 2');
      }
    }
  });
  it('excludes cracy and unrelated formulas', () => {
    for (const basis of [['subjectivism', 'judicious'], ['carefree', 'intuition']] as const) {
      const html = renderToString(<TetrachotomyOrderPanel view={selectPartitionExplorerView(basis)} aspectDisplayMode="symbol" />);
      expect(html).toBe('');
    }
  });
});
