import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SOCIONIC_TYPES } from '../data/socionics';
import { TypeSelector } from './TypeSelector';

describe('selected type visibility', () => {
  it.each(SOCIONIC_TYPES)('clearly marks $id without marking other types', type => {
    const html = renderToStaticMarkup(<TypeSelector selectedTypeId={type.id} onSelectType={() => {}} />);
    const cards = html.match(/<button\b[^>]*>.*?<\/button>/g)!;
    expect(cards).toHaveLength(SOCIONIC_TYPES.length);
    const selected = cards.filter(card => card.includes('aria-current="true"'));
    expect(selected).toHaveLength(1);
    expect(selected[0]).toContain('data-selected-type-marker');
    expect(selected[0]).toContain(`data-type-choice="${type.id}"`);
    expect(html.match(/data-selected-type-marker/g)).toHaveLength(1);
    expect(cards.filter(card => !card.includes('aria-current="true"')).every(card => !card.includes('data-selected-type-marker'))).toBe(true);
    expect(html).not.toContain('lucide-badge');
    const summary = html.match(/<p[^>]*data-selected-type-summary[^>]*>(.*?)<\/p>/)![1].replace(/<[^>]+>/g, '').trim();
    expect(summary).toBe(`Выбран: ${type.aliases.socionics?.[0] ?? type.id}`);
  });
});
