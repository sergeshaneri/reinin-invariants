import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReferencePage } from './ReferencePage';
import { ASPECTS, ASPECT_FEATURES, FUNCTIONS, FUNCTION_FEATURES, SOCIONIC_TYPES } from '../data/socionics';
import { HADAMARD_MATRICES } from '../data/hadamard';

const count = (html: string, attribute: string) => (html.match(new RegExp(`${attribute}=`, 'g')) ?? []).length;

describe('reference page', () => {
  it('links the original pattern reference images', () => {
    const html = renderToString(<ReferencePage />);
    for (const name of ['function-dichotomies.png', 'socion-patterns.png', 'aspecton-functionon-patterns.png']) expect(html).toContain(name);
    expect(html).toContain('href="#patterns-aspecton"');
    expect(html).toContain('href="#patterns-functionon"');
    expect(html).toContain('href="#patterns-socion"');
  });
  it('preserves all seven function-position dichotomies from the supplied image', () => {
    const html = renderToString(<ReferencePage />);
    expect(count(html, 'data-function-dichotomy')).toBe(7);
    expect(count(html, 'data-function-position')).toBe(56);
    const expected = [[1, 2, 3, 4], [1, 3, 5, 7], [1, 2, 7, 8], [1, 2, 5, 6], [1, 4, 5, 8], [1, 4, 6, 7], [1, 3, 6, 8]];
    const figures = [...html.matchAll(/<figure[^>]*data-function-dichotomy="[^"]+"[^>]*>([\s\S]*?)<\/figure>/g)];
    expect(figures).toHaveLength(7);
    figures.forEach((figure, index) => {
      const cells = [...figure[1].matchAll(/data-function-position="(\d+)" data-function-positive="(true|false)"/g)];
      expect(cells.map(cell => Number(cell[1]))).toEqual([1, 2, 4, 3, 6, 5, 7, 8]);
      expect(cells.filter(cell => cell[2] === 'true').map(cell => Number(cell[1])).sort((a, b) => a - b)).toEqual(expected[index]);
    });
  });
  it('renders the complete source row patterns for all three carriers', () => {
    const html = renderToString(<ReferencePage />);
    expect(count(html, 'data-hadamard-pattern-atlas')).toBe(3);
    expect(count(html, 'data-pattern-card')).toBe(32);
    expect(count(html, 'data-pattern-cell')).toBe(384);
    const cards = new Map([...html.matchAll(/<figure[^>]*data-pattern-card="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/g)].map(match => [match[1], match[2]]));
    for (const matrix of HADAMARD_MATRICES) matrix.rows.forEach((row, index) => {
      const card = cards.get(`${matrix.id}:${row.id}`)!;
      const cells = [...card.matchAll(/data-pattern-cell="(\d+)" data-pattern-value="(-?\d+)"/g)];
      expect(cells.map(cell => Number(cell[1]))).toEqual(matrix.columns.map((_, column) => column + 1));
      expect(cells.map(cell => Number(cell[2]))).toEqual(matrix.values[index]);
    });
    expect(html).toContain('Паттерны Аспектона');
    expect(html).toContain('Паттерны Функциона');
    expect(html).toContain('Паттерны Социона');
  });
  it('provides three annotated Hadamard matrices with complete cells and source links', () => {
    const html = renderToString(<ReferencePage />);
    expect(html).toContain('href="#hadamard"');
    expect(html).toContain('Аспектон · H₃');
    expect(html).toContain('Функцион · H₃');
    expect(html).toContain('Социон · H₄');
    expect(count(html, 'data-hadamard-matrix')).toBe(3);
    expect(count(html, 'data-hadamard-cell')).toBe(384);
    expect(count(html, 'data-hadamard-annotation')).toBe(3);
    expect(html).toContain('HₙHₙᵀ = 2ⁿI');
    expect(html).toContain('1 ↦ +1, 0 ↦ −1');
    expect(html).toContain('1, 5, 6, 2, 8, 4, 3, 7');
    expect(html).toContain('Таблицы отношений');
    expect(html).toContain('1SM3S8J3uU4Uqd5t5WAqc3jKy54w2C98CyeKA_kg2Jwk');
    expect(html).toContain('1RotOTDvP-DR-OT9kK3X3MbO84092jWIZuFuxf1yNdPU');
    expect(html).toContain('18f_5bWegApKeBQexZacnCYfoDx_g3dqlgeCNxNlqbwc');
  });
  it('explains the two aspect dichotomies and provides complete base tables', () => {
    const html = renderToString(<ReferencePage />);
    expect(html).toContain('две дихотомии информационных аспектов');
    expect(html).toContain('Квадры — тетрады соционических типов');
    expect(html).toContain('Вербальные функции 1, 2, 5, 6');
    expect(html).toContain('Лаборные функции 3, 4, 7, 8');
    expect(count(html, 'data-reference-aspect')).toBe(ASPECTS.length);
    expect(count(html, 'data-reference-aspect-feature')).toBe(ASPECTS.length * ASPECT_FEATURES.length);
    expect(count(html, 'data-reference-function')).toBe(FUNCTIONS.length);
    expect(count(html, 'data-reference-function-feature')).toBe(FUNCTIONS.length * FUNCTION_FEATURES.length);
    expect(count(html, 'data-reference-type')).toBe(SOCIONIC_TYPES.length);
    expect(count(html, 'data-reference-model-assignment')).toBe(SOCIONIC_TYPES.length * FUNCTIONS.length);
    expect(count(html, 'data-reference-quadra')).toBe(4);
    for (const aspect of ASPECTS) expect(html).toContain(aspect.fullName);
    expect(html).not.toMatch(/(?:Альфа|Гамма|Бета|Дельта)-ценн/);
  });
});
