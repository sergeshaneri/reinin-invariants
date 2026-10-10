import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { selectPartitionExplorerView } from '../data/selectors';
import { getTetrachotomyFormulaById } from '../data/tetrachotomies';
import { ORDER_DEPENDENT_TETRACHOTOMIES } from '../data/orderDependentTetrachotomies';
import { TetrachotomyAspectFunctionPanel } from './TetrachotomyAspectFunctionPanel';

describe('selected order-dependent tetrachotomy heading', () => {
  it.each(ORDER_DEPENDENT_TETRACHOTOMIES)('uses $notation as the main heading for $formulaId', family => {
    const formula = getTetrachotomyFormulaById(family.formulaId)!;
    const initial = selectPartitionExplorerView(formula.basisTraitIds);
    if (!initial.partition.ok) throw new Error('Expected valid tetrachotomy');
    for (const partitionClass of initial.partition.classes) {
      const view = selectPartitionExplorerView(formula.basisTraitIds, partitionClass.key);
      const html = renderToStaticMarkup(<TetrachotomyAspectFunctionPanel view={view} aspectDisplayMode="icon" baseView={null} />);
      const heading = html.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1];
      expect(heading).toBe(`${family.notation}${family.name ? ` — ${family.name}` : ''}`);
      const description = html.match(/<div[^>]*data-order-dependent-class[^>]*>(.*?)<\/div>/)?.[1];
      expect(description).toMatch(/^<p>Порядкозависимые \(2×4\)×4<\/p>/);
      expect(description).toContain(`Признаки функций: ${family.featureProducts.join('; ')}.`);
    }
  });

  it('preserves the existing heading of non-order-dependent tetrachotomies', () => {
    const view = selectPartitionExplorerView(['carefree', 'intuition']);
    const html = renderToStaticMarkup(<TetrachotomyAspectFunctionPanel view={view} aspectDisplayMode="icon" baseView={null} />);
    expect(html.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1]).toBe('Общий инвариант выбранной тетрады в модели А');
  });
});
