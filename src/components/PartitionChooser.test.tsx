import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PartitionChooser } from './PartitionChooser';
import { selectTetrachotomyCatalog } from '../data/selectors';
import { TETRACHOTOMY_FORMULAS, TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL } from '../data/tetrachotomies';

const renderChooser = () => renderToStaticMarkup(
  <PartitionChooser
    kind="tetrachotomy"
    selectedTraitIds={['carefree', 'intuition']}
    onSelectTraitIds={() => undefined}
  />,
);

const catalogButton = (html: string, id: string): string => (
  html.match(new RegExp(`<button[^>]*data-partition-catalog-entry="${id}"[^>]*>[\\s\\S]*?</button>`))?.[0] ?? ''
);

describe('tetrachotomy chooser', () => {
  it('shows source indices and neutral XNOR products for every catalog formula', () => {
    const html = renderChooser();
    for (const formula of TETRACHOTOMY_FORMULAS) {
      const labels = [formula.targetTraitId, ...formula.basisTraitIds].map(traitId => (
        Object.entries(TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL).find(([, id]) => id === traitId)![0]
      ));
      const button = catalogButton(html, formula.id);
      expect(button).toContain(`${formula.source.tetraNumber}. ${labels.join(' ⊙ ')} = 1`);
      expect(button).not.toContain(formula.source.formulaText);
    }
  });

  it('marks only entries with transferred aspect/function diagram rows', () => {
    const html = renderChooser();
    const catalog = selectTetrachotomyCatalog();
    let marked = 0;
    let unmarked = 0;
    for (const entry of catalog.entries) {
      const button = catalogButton(html, entry.key);
      expect(button).not.toBe('');
      const hasRows = entry.sourceFormula?.sourceBlocks?.some(block => block.rows.length > 0) ?? false;
      if (hasRows) {
        expect(button).toContain('data-tetrachotomy-diagrams-ready');
        expect(button).toContain('Диаграммы перенесены');
        marked++;
      } else {
        expect(button).not.toContain('data-tetrachotomy-diagrams-ready');
        unmarked++;
      }
    }
    expect(marked).toBeGreaterThan(0);
    expect(unmarked).toBeGreaterThan(0);
  });
});
