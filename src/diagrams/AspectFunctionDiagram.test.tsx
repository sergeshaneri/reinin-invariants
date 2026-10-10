import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ASPECTS, REININ_TRAITS } from '../data/socionics';
import { AspectFunctionDiagram } from './AspectFunctionDiagram';
import type { AspectDisplayMode } from '../components/AspectGlyph';

const trait = REININ_TRAITS.find(candidate => candidate.id === 'talness')!;

const renderDiagram = (mode: AspectDisplayMode) => renderToStaticMarkup(
  <AspectFunctionDiagram trait={trait} pole={trait.poles[0]} view={trait.poles[0].views[0]}
    aspectDisplayMode={mode} activeCell={null} onAspectHover={() => {}} onFunctionHover={() => {}}
    onAspectClick={() => {}} onFunctionClick={() => {}} />,
);

describe('ordinary aspecton display modes', () => {
  for (const mode of ['icon', 'symbol', 'icon-symbol'] as const) {
    it(`renders ${mode} while preserving accessible aspect names`, () => {
      const html = renderDiagram(mode);
      expect(html.match(new RegExp(`data-aspect-glyph-mode="${mode}"`, 'g')) ?? []).toHaveLength(8);
      expect(html.match(/data-aspect-icon-size=/g) ?? []).toHaveLength(mode === 'symbol' ? 0 : 8);
      for (const aspect of ASPECTS) {
        expect(html).toContain(`aria-label="${aspect.fullName} (${aspect.name}).`);
        if (mode === 'icon') expect(html).not.toContain(`>${aspect.name}</span>`);
        else expect(html).toContain(`>${aspect.name}</span>`);
      }
    });
  }
});
