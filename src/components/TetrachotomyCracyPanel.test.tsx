import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { selectPartitionExplorerView } from '../data/selectors';
import type { ReininTraitId } from '../data/socionics';
import { TetrachotomyCracyPanel } from './TetrachotomyCracyPanel';

const bases: ReininTraitId[][] = [
  ['subjectivism', 'judicious'],
  ['constructivism', 'tactical'],
  ['process', 'nalness'],
  ['asking', 'talness'],
];

describe('tetrachotomy cracy block formula', () => {
  it.each(bases.map(basis => [basis]))('preserves all four block conditions for %j', basis => {
    const view = selectPartitionExplorerView(basis);
    expect(view.partition.ok).toBe(true);
    if (!view.partition.ok) throw new Error('Expected a valid tetrachotomy');
    for (const partitionClass of view.partition.classes) {
      const selected = selectPartitionExplorerView(basis, partitionClass.key);
      const html = renderToString(<TetrachotomyCracyPanel view={selected} aspectDisplayMode="icon-symbol" />);
      expect(html).toContain('data-tetrachotomy-cracy-panel');
      expect(html).toContain('data-cracy-ordinary-diagram');
      expect(html.match(/data-cracy-view-select=/g)).toHaveLength(4);
      expect(html.match(/data-cracy-block-condition=/g)).toHaveLength(4);
      expect(html.match(/data-cracy-aspect-block=/g)).toHaveLength(16);
      expect(html.match(/data-cracy-function-block=/g)).toHaveLength(16);
      expect(html).toContain('Соответствие между блоками может различаться между типами; состав каждого блока сохраняется.');
      expect(html).toContain('data-aspect-glyph-mode="icon-symbol"');
    }
  });
  it('does not add cracy to an unrelated formula', () => {
    const html = renderToString(<TetrachotomyCracyPanel view={selectPartitionExplorerView(['carefree', 'intuition'])} aspectDisplayMode="symbol" />);
    expect(html).toBe('');
  });
});
