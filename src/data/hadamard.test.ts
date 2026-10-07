import { describe, expect, it } from 'vitest';
import { HADAMARD_MATRICES } from './hadamard';
import { ASPECTS, ASPECT_FEATURES, FUNCTIONS, FUNCTION_FEATURES } from './socionics';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from './memberships';

describe('source Hadamard matrices', () => {
  it('keeps row and column codes closed under XNOR and verifies the functional block example', () => {
    for (const matrix of HADAMARD_MATRICES) {
      const columns = matrix.columns.map((_, column) => matrix.values.map(row => row[column]));
      for (const codes of [matrix.values, columns]) {
        codes.forEach(a => codes.forEach(b => {
          const product = a.map((value, index) => value * b[index]);
          expect(codes.filter(candidate => candidate.every((value, index) => value === product[index]))).toHaveLength(1);
        }));
      }
    }
    const functions = HADAMARD_MATRICES[1];
    const strength = functions.columns.findIndex(column => column.short === 'Сл/слаб');
    const verbal = functions.columns.findIndex(column => column.short === 'Вб/Лб');
    const tal = functions.columns.findIndex(column => column.short === 'Таль');
    expect([strength, verbal, tal].every(index => index >= 0)).toBe(true);
    const groups = new Map<string, number[]>();
    functions.values.forEach((row, index) => {
      expect(row[strength] * row[verbal]).toBe(row[tal]);
      const key = `${row[strength]}:${row[verbal]}`;
      groups.set(key, [...(groups.get(key) ?? []), Number(functions.rows[index].id)]);
    });
    expect([...groups.values()].map(group => group.sort((a, b) => a - b)).sort((a, b) => a[0] - b[0])).toEqual([[1, 2], [3, 4], [5, 6], [7, 8]]);
  });
  it('agrees with the application registries without changing carrier poles', () => {
    const [aspects, functions, types] = HADAMARD_MATRICES;
    aspects.rows.forEach((row, index) => {
      const aspect = ASPECTS.find(candidate => candidate.id === row.id)!;
      expect(aspects.values[index]).toEqual([1, ...ASPECT_FEATURES.map(feature => aspect[feature.key] ? 1 : -1)]);
    });
    functions.rows.forEach((row, index) => {
      const fn = FUNCTIONS.find(candidate => String(candidate.id) === row.id)!;
      expect(functions.values[index]).toEqual([1, ...FUNCTION_FEATURES.map(feature => fn[feature.key] ? 1 : -1)]);
    });
    const traits = ['vertness', 'carefree', 'intuition', 'democracy', 'positivism', 'yielding', 'logic', 'subjectivism', 'constructivism', 'process', 'asking', 'judicious', 'tactical', 'nalness', 'talness'] as const;
    types.rows.forEach((row, index) => expect(types.values[index]).toEqual([1, ...traits.map(trait => TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[trait].poles[0].typeIds.includes(row.id as never) ? 1 : -1)]));
  });
  it('preserves the three carrier matrices, complete axes and orthogonality', () => {
    expect(HADAMARD_MATRICES.map(matrix => matrix.id)).toEqual(['aspecton', 'functionon', 'socion']);
    for (const matrix of HADAMARD_MATRICES) {
      const size = matrix.rows.length;
      expect(matrix.columns).toHaveLength(size);
      expect(matrix.values).toHaveLength(size);
      for (const row of matrix.values) {
        expect(row).toHaveLength(size);
        expect(row.every(value => value === 1 || value === -1)).toBe(true);
        expect(row[0]).toBe(1);
      }
      matrix.values.forEach((a, i) => matrix.values.forEach((b, j) => {
        expect(a.reduce((sum, value, index) => sum + value * b[index], 0)).toBe(i === j ? size : 0);
      }));
      expect(matrix.columns[0].short).toBe('Сущ');
      expect(matrix.values[0].every(value => value === 1)).toBe(true);
    }
    expect(HADAMARD_MATRICES[0].rows.map(row => row.label)).toEqual(['ЧИ', 'БС', 'ЧЭ', 'БЛ', 'ЧЛ', 'БЭ', 'ЧС', 'БИ']);
    expect(HADAMARD_MATRICES[1].rows.map(row => row.id)).toEqual(['1', '5', '6', '2', '8', '4', '3', '7']);
    expect(HADAMARD_MATRICES[2].rows.map(row => row.label)).toEqual(['ИЛЭ', 'СЭИ', 'ЭСЭ', 'ЛИИ', 'ЭИЭ', 'ЛСИ', 'СЛЭ', 'ИЭИ', 'ЛИЭ', 'ЭСИ', 'СЭЭ', 'ИЛИ', 'ИЭЭ', 'СЛИ', 'ЛСЭ', 'ЭИИ']);
  });
});
