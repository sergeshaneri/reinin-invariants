import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReferencePage } from './ReferencePage';
import { ASPECTS, ASPECT_FEATURES, FUNCTIONS, FUNCTION_FEATURES, SOCIONIC_TYPES } from '../data/socionics';

const count = (html: string, attribute: string) => (html.match(new RegExp(`${attribute}=`, 'g')) ?? []).length;

describe('reference page', () => {
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
