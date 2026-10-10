import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { selectPartitionExplorerView } from '../data/selectors';
import { TetrachotomyAspectFunctionPanel } from './TetrachotomyAspectFunctionPanel';
import { TetrachotomyCracyPanel } from './TetrachotomyCracyPanel';

const bases = [['subjectivism', 'process'], ['democracy', 'yielding']] as const;

describe('aspect display settings in related tetrachotomy panels', () => {
  for (const basis of bases) {
    const initial = selectPartitionExplorerView(basis);
    if (!initial.partition.ok) throw new Error('Expected valid tetrachotomy');
    const views = initial.partition.classes.map(group => selectPartitionExplorerView(basis, group.key));
    for (const mode of ['icon', 'symbol', 'icon-symbol'] as const) {
      it(`preserves ${mode} in every class of ${basis.join(',')}`, () => {
        for (const view of views) {
          const source = renderToString(<TetrachotomyAspectFunctionPanel view={view} aspectDisplayMode={mode} baseView={null} />);
          const cracy = renderToString(<TetrachotomyCracyPanel view={view} aspectDisplayMode={mode} />);
          for (const html of [source, ...(basis[0] === 'democracy' ? [cracy] : [])]) {
            const modes = [...html.matchAll(/data-aspect-glyph-mode="([^"]+)"/g)].map(match => match[1]);
            expect(modes.length).toBeGreaterThan(8);
            expect([...new Set(modes)]).toEqual([mode]);
            expect(html.match(/data-aspect-icon-size=/g) ?? []).toHaveLength(mode === 'symbol' ? 0 : modes.length);
          }
        }
      });
    }
  }
});
