import type { AspectId } from '../data/socionics';

export type ActiveCell =
  | { kind: 'aspect'; id: AspectId }
  | { kind: 'function'; id: number }
  | null;

export const sameActiveCell = (a: ActiveCell, b: ActiveCell): boolean =>
  a !== null && b !== null && a.kind === b.kind && a.id === b.id;

export const togglePinnedCell = (pinnedCell: ActiveCell, cell: Exclude<ActiveCell, null>): ActiveCell =>
  sameActiveCell(pinnedCell, cell) ? null : cell;

export const resolveActiveCell = (hoveredCell: ActiveCell, pinnedCell: ActiveCell): ActiveCell =>
  pinnedCell ?? hoveredCell;

export const clearActiveCell = (): ActiveCell => null;
