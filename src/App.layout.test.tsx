import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from './App';

const renderWithSearch = (search: string): string => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      location: { search },
    },
  });
  try {
    return renderToString(<App />);
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
  }
};

const expectBefore = (html: string, first: string, second: string) => {
  expect(html).toContain(first);
  expect(html).toContain(second);
  expect(html.indexOf(first)).toBeLessThan(html.indexOf(second));
};

describe('diagram-first layout', () => {
  it('puts the dichotomy diagram before collapsed optional materials', () => {
    const html = renderWithSearch('');
    expectBefore(html, 'data-primary-diagram="dichotomy"', 'data-dichotomy-extra-materials');
    expectBefore(html, 'data-dichotomy-extra-materials', 'data-partition-pattern="dichotomy"');
    expectBefore(html, 'data-dichotomy-extra-materials', 'data-model-preview-type-id=');
    expectBefore(html, 'data-dichotomy-extra-materials', 'data-dichotomy-card=');
    expect(html).toMatch(/<details[^>]*data-dichotomy-extra-materials[^>]*>/);
    expect(html).not.toMatch(/<details[^>]*data-dichotomy-extra-materials[^>]*\sopen(?:[\s=>])/);
  });

  it('puts the tetrachotomy diagram before its optional patterns and previews', () => {
    const html = renderWithSearch('?mode=tetrachotomy&traits=carefree,intuition');
    expectBefore(html, 'data-tetrachotomy-model-a-slot', 'data-tetrachotomy-extra-materials');
    expectBefore(html, 'data-tetrachotomy-extra-materials', 'data-partition-pattern="tetrachotomy"');
    expectBefore(html, 'data-tetrachotomy-extra-materials', 'data-model-preview-type-id=');
    expect(html).toContain('data-tetrachotomy-class-select');
    expect(html).not.toMatch(/<details[^>]*data-tetrachotomy-extra-materials[^>]*\sopen(?:[\s=>])/);
  });

  it('keeps introductory links collapsed by default', () => {
    const html = renderWithSearch('');
    expect(html).not.toContain('Подробная статья');
    expect(html).not.toContain('Короткое видео');
  });
});
