import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ASPECTS, REININ_TRAITS } from '../data/socionics';
import { FormulaPanel } from './FormulaPanel';

const trait = REININ_TRAITS.find(candidate => candidate.id === 'democracy')!;

describe('block formula presentation', () => {
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
