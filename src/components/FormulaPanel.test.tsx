import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ASPECTS, REININ_TRAITS } from '../data/socionics';
import { FormulaPanel } from './FormulaPanel';

const trait = REININ_TRAITS.find(candidate => candidate.id === 'democracy')!;

describe('fixed-pair formula presentation', () => {
  for (const mode of ['icon', 'symbol', 'icon-symbol'] as const) {
    it(`respects ${mode} in every fixed-pair view without block indices`, () => {
      let checkedViews = 0;
      for (const candidate of REININ_TRAITS) for (const pole of candidate.poles) for (const view of pole.views) {
        if (view.isBlockPermutation) continue;
        const html = renderToStaticMarkup(<FormulaPanel trait={candidate} view={view} aspectDisplayMode={mode} />);
        const aspectCount = view.mappings.reduce((count, mapping) => count + mapping.aspects.length, 0);
        expect(html.match(/<span[^>]*rounded-full[^>]*>\d+<\/span>/g) ?? []).toHaveLength(0);
        expect(html.match(new RegExp(`data-aspect-glyph-mode="${mode}"`, 'g')) ?? []).toHaveLength(aspectCount);
        expect(html.match(/data-aspect-icon-size=/g) ?? []).toHaveLength(mode === 'symbol' ? 0 : aspectCount);
        expect([...html.matchAll(/<span[^>]*>(\d+)<\/span>/g)].map(match => Number(match[1])))
          .toEqual(view.mappings.flatMap(mapping => mapping.functions));
        for (const mapping of view.mappings) for (const aspectId of mapping.aspects) {
          expect(html).toContain(ASPECTS.find(aspect => aspect.id === aspectId)!.fullName);
        }
        checkedViews += 1;
      }
      expect(checkedViews).toBeGreaterThan(0);
    });
  }
});

describe('block formula presentation', () => {
  for (const mode of ['icon', 'symbol', 'icon-symbol'] as const) {
    it(`respects ${mode} in every block view without block-number badges`, () => {
      for (const pole of trait.poles) for (const view of pole.views) {
        const html = renderToStaticMarkup(<FormulaPanel trait={trait} view={view} aspectDisplayMode={mode} />);
        expect(html.match(new RegExp(`data-aspect-glyph-mode="${mode}"`, 'g')) ?? []).toHaveLength(8);
        expect(html.match(/data-aspect-icon-size=/g) ?? []).toHaveLength(mode === 'symbol' ? 0 : 8);
        expect(html).not.toContain('rounded-full');
        expect([...html.matchAll(/class="block-number">(\d)<\/span>/g)].map(match => Number(match[1])).sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      }
    });
  }

  it('uses two separate block collections with unboxed function numbers', () => {
    for (const pole of trait.poles) {
      for (const view of pole.views) {
        const html = renderToStaticMarkup(<FormulaPanel trait={trait} view={view} />);
        expect(html).toContain('data-block-formula');
        expect(html).toContain('block-surface');
        expect(html.match(/data-formula-aspect-block=/g)).toHaveLength(view.mappings.length);
        expect(html.match(/data-formula-function-block=/g)).toHaveLength(view.mappings.length);
        expect(html.match(/class="block-number"/g)).toHaveLength(8);
        expect(html).toContain('Перестановка целых блоков');
        expect(html).not.toContain('lucide-arrow-right');
        for (const mapping of view.mappings) {
          expect(html).toContain(`data-formula-aspect-block="${mapping.aspects.join(',')}"`);
          expect(html).toContain(`data-formula-function-block="${mapping.functions.join(',')}"`);
          for (const id of mapping.aspects) {
            expect(html).toContain(ASPECTS.find(aspect => aspect.id === id)!.name);
          }
        }
      }
    }
  });

  it('keeps fixed-pair formulas on their existing presentation', () => {
    const otherTrait = REININ_TRAITS.find(candidate => candidate.id === 'vertness')!;
    const html = renderToStaticMarkup(<FormulaPanel trait={otherTrait} view={otherTrait.poles[0].views[0]} />);
    expect(html).not.toContain('block-surface');
    expect(html).not.toContain('data-block-formula');
    expect(html).toContain('lucide-arrow-right');
  });
});
