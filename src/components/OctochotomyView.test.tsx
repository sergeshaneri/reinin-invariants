import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { selectPartitionExplorerView } from '../data/selectors';
import { getOctochotomyFormulaById } from '../data/octochotomies';
import { OctochotomyView } from './OctochotomyView';

const traits = ['positivism', 'yielding', 'logic'] as const;

describe('quasi-identity dimensionality invariant', () => {
  it('renders each source pair with four dyads before its two model previews', () => {
    const initial = selectPartitionExplorerView(traits);
    if (!initial.partition.ok) throw new Error('Expected an octochotomy');
    const formula = getOctochotomyFormulaById('octo-08-quasi-identity')!;
    for (const group of initial.partition.classes) {
      const view = selectPartitionExplorerView(traits, group.key);
      const source = formula.classes!.find(candidate => candidate.typeIds.every(id => group.types.some(type => type.id === id)))!;
      const html = renderToString(<OctochotomyView view={view} aspectDisplayMode="icon-symbol" onSelectClass={() => {}} />);
      expect(html).toContain('data-octochotomy-invariant');
      expect(html).toContain('Общий инвариант выбранной пары в модели А');
      expect(html.match(/data-tetrachotomy-aspect-function-row=/gu)).toHaveLength(4);
      for (const row of source.sourceBlock!.rows) {
        expect(html).toContain(`data-tetrachotomy-aspect-function-row="${row.aspectText}"`);
        expect(html).toContain(row.functionBlockLabel);
      }
      expect(html.indexOf('data-octochotomy-invariant')).toBeLessThan(html.indexOf('data-partition-types-panel'));
      expect(html.match(/data-model-preview-type-id=/gu)).toHaveLength(2);
    }
  });

  it('does not attach dimensionality rows to another octochotomy', () => {
    const view = selectPartitionExplorerView(['vertness', 'nalness', 'carefree']);
    const html = renderToString(<OctochotomyView view={view} aspectDisplayMode="symbol" onSelectClass={() => {}} />);
    expect(html).not.toContain('data-octochotomy-invariant');
  });
});
