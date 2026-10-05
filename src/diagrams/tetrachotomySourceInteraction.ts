import type { AspectId } from '../data/socionics';

interface SourceRowCells {
  aspectIds: readonly AspectId[];
  functionIds: readonly number[];
}

export const getSourceCellRows = (rows: readonly SourceRowCells[]) => {
  const aspects = new Map<AspectId, number[]>();
  const functions = new Map<number, number[]>();
  rows.forEach((row, rowIndex) => {
    row.aspectIds.forEach(id => aspects.set(id, [...(aspects.get(id) ?? []), rowIndex]));
    row.functionIds.forEach(id => functions.set(id, [...(functions.get(id) ?? []), rowIndex]));
  });
  return { aspects, functions };
};

export const getSourceCellHighlight = (
  rowIndices: readonly number[],
  activeRowIndices: readonly number[] | null,
): 'none' | 'active' | 'dim' => {
  if (!activeRowIndices || rowIndices.length === 0) return 'none';
  return rowIndices.some(index => activeRowIndices.includes(index)) ? 'active' : 'dim';
};
