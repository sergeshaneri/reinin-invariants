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
  it('keeps old type URLs neutral with the analysis disclosure', () => {
    const html = renderWithSearch('?mode=type&type=EII');
    expect(html).toContain('Посмотреть АРП на примере этого типа');
    expect(html).toContain('aria-controls="type-arp-analysis"');
    expect(html).not.toContain('data-type-arp-explanation');
    expect(html.match(/id="type-model-title"/g)).toHaveLength(1);
  });

  it('opens URL analysis and preserves it in the reference navigation link', () => {
    const html = renderWithSearch('?mode=type&type=EII&arp=democracy&arpView=2&theme=dark');
    expect(html).toContain('data-type-arp-explanation');
    expect(html).toContain('Скрыть АРП');
    expect(html).toContain('href="?mode=type&amp;theme=dark&amp;type=EII&amp;arp=democracy&amp;arpView=2&amp;page=reference"');
    expect(html.match(/id="type-model-title"/g)).toHaveLength(1);
  });

  it('normalizes reference return URLs without reopening unknown analysis', () => {
    const open = renderWithSearch('?page=reference&mode=type&type=ILE&arp=democracy&arpView=999');
    expect(open).toContain('href="?mode=type&amp;type=ILE&amp;arp=democracy"');
    expect(open).not.toContain('arpView=999');
    const unknown = renderWithSearch('?mode=type&type=ILE&arp=unknown');
    expect(unknown).not.toContain('data-type-arp-explanation');
    expect(unknown).toContain('href="?mode=type&amp;type=ILE&amp;page=reference"');
  });

  it('puts the dichotomy diagram before collapsed optional materials', () => {
    const html = renderWithSearch('');
    expectBefore(html, 'data-primary-diagram="dichotomy"', 'data-dichotomy-extra-materials');
    expectBefore(html, 'data-dichotomy-extra-materials', 'data-partition-pattern="dichotomy"');
    expectBefore(html, 'data-primary-diagram="dichotomy"', 'data-partition-types-panel="dichotomy"');
    expectBefore(html, 'data-partition-types-panel="dichotomy"', 'data-dichotomy-extra-materials');
    expectBefore(html, 'data-model-preview-type-id=', 'data-dichotomy-extra-materials');
    expectBefore(html, 'data-dichotomy-extra-materials', 'data-dichotomy-card=');
    expect(html).toMatch(/<details[^>]*data-dichotomy-extra-materials[^>]*>/);
    expect(html).not.toMatch(/<details[^>]*data-dichotomy-extra-materials[^>]*\sopen(?:[\s=>])/);
  });

  it('puts tetrachotomy types directly after the diagram and before optional patterns', () => {
    const html = renderWithSearch('?mode=tetrachotomy&traits=carefree,intuition');
    expectBefore(html, 'data-tetrachotomy-model-a-slot', 'data-tetrachotomy-extra-materials');
    expectBefore(html, 'data-tetrachotomy-extra-materials', 'data-partition-pattern="tetrachotomy"');
    expectBefore(html, 'data-tetrachotomy-model-a-slot', 'data-partition-types-panel="tetrachotomy"');
    expectBefore(html, 'data-partition-types-panel="tetrachotomy"', 'data-tetrachotomy-extra-materials');
    expectBefore(html, 'data-model-preview-type-id=', 'data-tetrachotomy-extra-materials');
    expect(html).toContain('data-tetrachotomy-class-select');
    expect(html).not.toMatch(/<details[^>]*data-tetrachotomy-extra-materials[^>]*\sopen(?:[\s=>])/);
  });

  it('keeps introductory links collapsed by default', () => {
    const html = renderWithSearch('');
    expect(html).not.toContain('Подробная статья');
    expect(html).not.toContain('Короткое видео');
  });

  it('marks transferred diagrams in the compact tetrachotomy selector', () => {
    const html = renderWithSearch('?mode=tetrachotomy&traits=carefree,intuition');
    expect(html).toMatch(/<option[^>]*value="tetra-01"[^>]*>1\. Верт ⊙ Бс\/Пр ⊙ Ит\/Сн = 1 ✓<\/option>/);
  });

  it('retains group colors on unused source cells while muting them', () => {
    const html = renderWithSearch('?mode=tetrachotomy&traits=judicious,nalness');
    const unusedCells = [...html.matchAll(/<button[^>]*data-tetrachotomy-source-(?:aspect|function)=[^>]*>/g)]
      .map(match => match[0])
      .filter(tag => tag.includes('data-source-row-index=""'));
    expect(unusedCells).toHaveLength(8);
    unusedCells.forEach(tag => {
      expect(tag).toMatch(/\bmap-tone-[0-7]\b/);
      expect(tag).toContain('opacity-45');
      expect(tag).not.toContain('map-tone-inactive');
    });
  });

  it('keeps source rows in the default pictogram-only mode and preserves their direction', () => {
    const html = renderWithSearch('?mode=tetrachotomy&traits=judicious,nalness');
    const firstRow = html.split('data-tetrachotomy-aspect-function-row="ЧИ БС"')[1]
      ?.split('data-tetrachotomy-aspect-function-row=')[0];
    expect(firstRow).toBeDefined();
    expect(firstRow?.match(/data-aspect-glyph-mode="icon"/g)).toHaveLength(2);
    expect(firstRow).not.toContain('data-aspect-glyph-mode="icon-symbol"');
    expect(firstRow).not.toMatch(/>ЧИ<\/span>|>БС<\/span>/);
    expect(firstRow).toContain('data-source-row-direction');
    expect(firstRow).toContain('source-row-arrow');
    expect(firstRow).toContain('data-source-function-chip="1"');
    expect(firstRow).toContain('data-source-function-chip="5"');
    expect(firstRow).toContain('map-tone-0');
    expect(firstRow).not.toContain('bg-[var(--color-shell-active-bg)]');
  });

  it('separates source features without reclassifying quadra-value aspect terms', () => {
    const html = renderWithSearch('?mode=tetrachotomy&traits=judicious,nalness');
    const firstRow = html.split('data-tetrachotomy-aspect-function-row="ЧИ БС"')[1]
      ?.split('data-tetrachotomy-aspect-function-row=')[0];
    expect(firstRow).toMatch(/data-source-feature="aspect">дельта<\/span>/);
    expect(firstRow).toMatch(/data-source-feature="aspect">альфа<\/span>/);
    expect(firstRow).toMatch(/data-source-feature="aspect">иррациональные<\/span>/);
    expect(firstRow).toMatch(/data-source-feature="function">оценочные<\/span>/);
    expect(firstRow).toMatch(/data-source-feature="function">вербальные<\/span>/);
    expect(firstRow).toMatch(/data-source-feature="function">акцептные<\/span>/);
    expect(firstRow).not.toContain('Квадры');
  });

  it('explains direct source rows as allowed function groups', () => {
    const html = renderWithSearch('?mode=tetrachotomy&traits=judicious,nalness');
    expect(html).toContain('data-tetrachotomy-invariant-explanation');
    expect(html).toContain('Каждая строка задаёт группу функций, в которую попадают указанные аспекты у всех типов выбранной тетрады.');
    expect(html).not.toContain('Соответствие между блоками может различаться');
  });

  it('explains block permutations without claiming fixed aspect-to-function row matches', () => {
    const html = renderWithSearch('?trait=democracy');
    expect(html).toContain('data-block-invariant-explanation');
    expect(html).toContain('каждый блок аспектов целиком занимает один из блоков функций');
    expect(html).toContain('Соответствие между блоками может различаться между типами; состав каждого блока сохраняется.');
    expect(html).not.toContain('у всех типов выбранной тетрады');
  });
});
