import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ORDER_DEPENDENT_TETRACHOTOMIES } from '../data/orderDependentTetrachotomies';
import { selectPartitionExplorerView } from '../data/selectors';
import { getTetrachotomyFormulaById } from '../data/tetrachotomies';
import { TetrachotomyView } from './TetrachotomyView';

const renderPreview = (view: ReturnType<typeof selectPartitionExplorerView>, mode: 'icon' | 'symbol' | 'icon-symbol') => {
  const html = renderToStaticMarkup(<TetrachotomyView view={view} aspectDisplayMode={mode} onSelectClass={() => {}} />);
  const start = html.indexOf('data-model-preview-grid');
  expect(start).toBeGreaterThanOrEqual(0);
  return html.slice(start, html.indexOf('data-tetrachotomy-extra-materials'));
};

describe('tetrachotomy Model A process previews', () => {
  for (const mode of ['icon', 'symbol', 'icon-symbol'] as const) {
    it(`retains process cycles independently of basis order in ${mode}`, () => {
      const configurations = ORDER_DEPENDENT_TETRACHOTOMIES.filter(item => item.orderTraitId === 'process');
      expect(configurations).toHaveLength(4);
      let checkedClasses = 0;
      for (const configuration of configurations) {
        const formula = getTetrachotomyFormulaById(configuration.formulaId)!;
        for (const basis of [formula.basisTraitIds, [...formula.basisTraitIds].reverse()]) {
          const initial = selectPartitionExplorerView(basis);
          if (!initial.partition.ok) throw new Error('Expected valid tetrachotomy');
          for (const partitionClass of initial.partition.classes) {
            checkedClasses += 1;
            const view = selectPartitionExplorerView(basis, partitionClass.key);
            const preview = renderPreview(view, mode);
            expect(preview.match(/marching-ants-cw/g) ?? [], configuration.formulaId).toHaveLength(4);
            expect(preview.match(/marching-ants-ccw/g) ?? [], configuration.formulaId).toHaveLength(4);
            expect(preview.match(/data-model-preview-highlight-intensity="primary"/g)).toHaveLength(32);
            expect(preview.match(new RegExp(`data-aspect-glyph-mode="${mode}"`, 'g'))).toHaveLength(32);
          }
        }
      }
      expect(checkedClasses).toBe(32);
    });
  }

  it('leaves non-process previews without cycle overlays', () => {
    for (const id of ['tetra-01', 'tetra-09']) {
      const formula = getTetrachotomyFormulaById(id)!;
      const preview = renderPreview(selectPartitionExplorerView(formula.basisTraitIds), 'icon');
      expect(preview).not.toContain('marching-ants-');
    }
  });
});
