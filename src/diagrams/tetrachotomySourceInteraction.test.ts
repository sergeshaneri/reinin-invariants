import { describe, expect, it } from 'vitest';
import { getSourceCellRows, getSourceCellHighlight } from './tetrachotomySourceInteraction';

const rows = [
  { aspectIds: ['Ne', 'Ni'] as const, functionIds: [1, 2, 7, 8] },
  { aspectIds: ['Si', 'Se'] as const, functionIds: [3, 4, 5, 6] },
  { aspectIds: ['Ti', 'Fe'] as const, functionIds: [1, 4, 5, 8] },
  { aspectIds: ['Te', 'Fi'] as const, functionIds: [2, 3, 6, 7] },
];

describe('overlapping source-row interaction', () => {
  it('retains both row memberships of each function', () => {
    const cells = getSourceCellRows(rows);
    expect(cells.aspects.get('Ne')).toEqual([0]);
    expect(cells.functions.get(1)).toEqual([0, 2]);
    expect(cells.functions.get(2)).toEqual([0, 3]);
    expect(cells.functions.get(3)).toEqual([1, 3]);
    expect(cells.functions.get(4)).toEqual([1, 2]);
    expect([...cells.functions.values()].every(indices => indices.length === 2)).toBe(true);
  });
  it('highlights functions from the first row even when also in a later row', () => {
    expect(getSourceCellHighlight([0, 2], [0])).toBe('active');
    expect(getSourceCellHighlight([0, 3], [0])).toBe('active');
    expect(getSourceCellHighlight([1, 2], [0])).toBe('dim');
  });
  it('highlights both dyads when a shared function is selected', () => {
    expect(getSourceCellHighlight([0], [0, 2])).toBe('active');
    expect(getSourceCellHighlight([2], [0, 2])).toBe('active');
    expect(getSourceCellHighlight([1], [0, 2])).toBe('dim');
    expect(getSourceCellHighlight([3], [0, 2])).toBe('dim');
  });
  it('preserves single-row mappings and inactive/unmapped cells', () => {
    expect(getSourceCellHighlight([1], [1])).toBe('active');
    expect(getSourceCellHighlight([1], [0])).toBe('dim');
    expect(getSourceCellHighlight([1], null)).toBe('none');
    expect(getSourceCellHighlight([], [0])).toBe('none');
  });
});
