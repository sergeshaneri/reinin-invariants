import { describe, expect, it } from 'vitest';
import {
  clearActiveCell,
  resolveActiveCell,
  togglePinnedCell,
  type ActiveCell,
} from './interaction';

describe('diagram interaction state', () => {
  it('pins a clicked aspect', () => {
    expect(togglePinnedCell(null, { kind: 'aspect', id: 'Ne' })).toEqual({
      kind: 'aspect',
      id: 'Ne',
    });
  });

  it('keeps a pinned aspect active after hover leaves', () => {
    const pinnedCell: ActiveCell = { kind: 'aspect', id: 'Ne' };

    expect(resolveActiveCell(null, pinnedCell)).toEqual(pinnedCell);
  });

  it('clears the pin when clicking the same aspect again', () => {
    const pinnedCell: ActiveCell = { kind: 'aspect', id: 'Ne' };

    expect(togglePinnedCell(pinnedCell, { kind: 'aspect', id: 'Ne' })).toBeNull();
  });

  it('replaces a pinned aspect when clicking a function', () => {
    const pinnedCell: ActiveCell = { kind: 'aspect', id: 'Ne' };

    expect(togglePinnedCell(pinnedCell, { kind: 'function', id: 1 })).toEqual({
      kind: 'function',
      id: 1,
    });
  });

  it('uses hover only when there is no pinned cell', () => {
    const hoveredCell: ActiveCell = { kind: 'function', id: 1 };
    const pinnedCell: ActiveCell = { kind: 'aspect', id: 'Ne' };

    expect(resolveActiveCell(hoveredCell, pinnedCell)).toEqual(pinnedCell);
    expect(resolveActiveCell(hoveredCell, null)).toEqual(hoveredCell);
  });

  it('clears the active cell on trait, pole, or view reset', () => {
    expect(clearActiveCell()).toBeNull();
  });
});
