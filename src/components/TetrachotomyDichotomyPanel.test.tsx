import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { selectPartitionExplorerView } from '../data/selectors';
import { REININ_TRAITS } from '../data/socionics';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from '../data/memberships';
import { getTetrachotomyFormulaById } from '../data/tetrachotomies';
import { TetrachotomyView } from './TetrachotomyView';
import { TetrachotomyDichotomyPanel } from './TetrachotomyDichotomyPanel';

const ids = ['tetra-05', 'tetra-26', 'tetra-27'];

describe('remaining tetrachotomies as consecutive dichotomy formulas', () => {
  it.each(ids)('renders all three participating dichotomies and every view for %s', id => {
    const formula = getTetrachotomyFormulaById(id)!;
    const initial = selectPartitionExplorerView(formula.basisTraitIds);
    if (!initial.partition.ok) throw new Error('Expected valid tetrachotomy');
    const traits = [formula.targetTraitId, ...formula.basisTraitIds];
    for (const partitionClass of initial.partition.classes) {
      const selected = selectPartitionExplorerView(formula.basisTraitIds, partitionClass.key);
      const html = renderToString(<TetrachotomyDichotomyPanel view={selected} />);
      expect(html).toContain(`data-tetrachotomy-dichotomy-panel="${id}"`);
      expect([...html.matchAll(/data-tetrachotomy-dichotomy="([^"]+)"/g)].map(match => match[1])).toEqual(traits);
      let totalViews = 0;
      for (const traitId of traits) {
        const trait = REININ_TRAITS.find(candidate => candidate.id === traitId)!;
        const commonPole = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[traitId].poles.find(candidate => partitionClass.types.every(type => candidate.typeIds.includes(type.id)))!;
        const pole = trait.poles[commonPole.poleIndex];
        expect(html).toContain(`data-dichotomy-pole="${commonPole.poleIndex}"`);
        expect(html).toContain(pole.name);
        totalViews += pole.views.length;
        if (traitId === 'process') expect(html).toContain(pole.description);
      }
      expect(html.match(/data-dichotomy-view=/g)).toHaveLength(totalViews);
    }
  });
  it.each(ids)('replaces the missing-source placeholder without claiming source transfer for %s', id => {
    const formula = getTetrachotomyFormulaById(id)!;
    expect(formula.sourceBlocks).toBeUndefined();
    const html = renderToString(<TetrachotomyView view={selectPartitionExplorerView(formula.basisTraitIds)} aspectDisplayMode="icon-symbol" onSelectClass={() => {}} />);
    expect(html).toContain(`data-tetrachotomy-dichotomy-panel="${id}"`);
    expect(html).not.toContain('data-tetrachotomy-aspect-function-panel');
    expect(html).not.toContain('data-tetrachotomy-source-block-fallback');
    expect(html.indexOf('data-tetrachotomy-dichotomy-panel')).toBeLessThan(html.indexOf('data-tetrachotomy-extra-materials'));
  });
  it('keeps transferred formulas on their existing source-diagram path', () => {
    const view = selectPartitionExplorerView(['subjectivism', 'judicious']);
    expect(renderToString(<TetrachotomyDichotomyPanel view={view} />)).toBe('');
    const html = renderToString(<TetrachotomyView view={view} aspectDisplayMode="icon-symbol" onSelectClass={() => {}} />);
    expect(html).toContain('data-tetrachotomy-aspect-function-panel="tetra-20"');
    expect(html).not.toContain('data-tetrachotomy-dichotomy-panel');
  });
});
