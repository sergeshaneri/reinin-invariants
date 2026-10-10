import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { REININ_TRAITS, SOCIONIC_TYPE_ORDER } from '../data/socionics';
import { selectTypeArpExample } from '../data/typeArp';
import { TypeArpExplorer, type TypeArpExplorerProps } from './TypeArpExplorer';

const render = (overrides: Partial<TypeArpExplorerProps> = {}) => renderToStaticMarkup(
  <TypeArpExplorer typeId="ILE" aspectDisplayMode="icon" state={undefined} fallbackTraitId="logic"
    onAction={() => undefined} onSelectType={() => undefined} onOpenGeneral={() => undefined} {...overrides} />,
);

describe('TypeArpExplorer', () => {
  it('uses the selected equivalence description with the pole description as fallback', () => {
    const example = selectTypeArpExample('ILE', 'positivism', 1);
    const html = render({ state: { isOpen: true, traitId: 'positivism', viewIndex: 1 } });
    const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    expect(html).toContain(`>${escape(example.view.description!)}<`);
    const fallback = selectTypeArpExample('ILE', 'logic');
    expect(render({ state: { isOpen: true, traitId: 'logic', viewIndex: 0 } })).toContain(`>${escape(fallback.pole.description)}<`);
  });
  it('keeps only one neutral model and an accessible disclosure when closed', () => {
    const html = render({ state: { isOpen: false, traitId: 'democracy', viewIndex: 2 } });
    expect(html.match(/id="type-model-title"/g)).toHaveLength(1);
    expect(html).toContain('Посмотреть АРП на примере этого типа');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="type-arp-analysis"');
    expect(html).toContain('id="type-arp-analysis" hidden=""');
    expect(html).not.toContain('map-tone-');
    expect(html).not.toContain('data-type-arp-explanation');
    expect(html).not.toContain('data-model-preview-type-id');
  });

  it('replaces rather than duplicates the model and orders concrete/general/gallery material', () => {
    const html = render({ state: { isOpen: true, traitId: 'democracy', viewIndex: 2 } });
    expect(html.match(/id="type-model-title"/g)).toHaveLength(1);
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('Скрыть АРП');
    expect(html).toContain('Показано для выбранного типа');
    expect(html).toContain('data-type-arp-trait-select');
    expect(html).toContain('aria-label="Выбор инварианта"');
    expect(html.indexOf('data-type-arp-explanation')).toBeLessThan(html.indexOf('data-type-arp-general-condition'));
    expect(html.indexOf('data-type-arp-general-condition')).toBeLessThan(html.indexOf('data-model-preview-grid'));
    expect(html).toMatch(/<details[^>]*data-type-arp-general-condition[^>]*>/);
    expect(html).not.toMatch(/<details[^>]*data-type-arp-general-condition[^>]* open/);
    expect(html).toContain('Открыть общее представление АРП');
    expect(html).not.toContain('aria-label="Выбор полюса"');
  });

  it('renders every real type/trait/view context with its automatic pole and exact selected gallery', () => {
    for (const trait of REININ_TRAITS) {
      for (const typeId of SOCIONIC_TYPE_ORDER) {
        const first = selectTypeArpExample(typeId, trait.id);
        first.views.forEach((_, viewIndex) => {
          const example = selectTypeArpExample(typeId, trait.id, viewIndex);
          const html = render({ typeId, state: { isOpen: true, traitId: trait.id, viewIndex } });
          expect(html).toContain(`data-type-arp-pole-index="${example.pole.poleIndex}"`);
          expect(html.includes('aria-label="Выбор инварианта"')).toBe(example.views.length > 1);
          const galleryIds = [...html.matchAll(/data-model-preview-type-id="([^"]+)"/g)].map(match => match[1]);
          expect(galleryIds).toEqual(example.typesPanel.types.map(type => type.id));
          expect(html).toContain(`data-model-preview-type-id="${typeId}" data-model-preview-selected="true"`);
          expect(html.match(/id="type-model-title"/g)).toHaveLength(1);
        });
      }
    }
  }, 20000);
});
