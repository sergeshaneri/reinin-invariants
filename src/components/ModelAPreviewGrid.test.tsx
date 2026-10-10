import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { selectTypeArpExample } from '../data/typeArp';
import { ModelAPreviewGrid } from './ModelAPreviewGrid';
import { PartitionTypesPanel } from './PartitionTypesPanel';

const example = selectTypeArpExample('ILE', 'vertness');
describe('selectable model gallery', () => {
  it('marks the selected type and forwards selection through the panel', () => {
    const html = renderToStaticMarkup(<PartitionTypesPanel view={example.typesPanel} activeView={example.view} aspectDisplayMode="symbol" selectedTypeId="ILE" onSelectType={() => {}} />);
    expect(html).toContain('Выбранный тип');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html.match(/<button /g)).toHaveLength(8);
    expect(html.match(/<button[^>]*><\/button>/g)).toHaveLength(8);
  });
  it('keeps old galleries non-interactive', () => {
    const html = renderToStaticMarkup(<ModelAPreviewGrid typeIds={['ILE']} view={example.view} aspectDisplayMode="icon" />);
    expect(html).not.toContain('<button');
    expect(html).not.toContain('Выбранный тип');
    expect(html).toContain('data-model-preview-type-id="ILE"');
  });
  it('keeps unassigned groups neutral in selectable galleries, without changing legacy fallback', () => {
    const view = { title: '', mappings: [{ aspects: ['Ne' as const], functions: [1, 2] }] };
    const interactive = renderToStaticMarkup(<ModelAPreviewGrid typeIds={['ILE']} view={view} aspectDisplayMode="symbol" selectedTypeId="ILE" />);
    const legacy = renderToStaticMarkup(<ModelAPreviewGrid typeIds={['ILE']} view={view} aspectDisplayMode="symbol" />);
    expect(interactive.match(/map-tone-0/g)).toHaveLength(1);
    expect(legacy.match(/map-tone-0/g)).toHaveLength(2);
  });
  it.each(['icon', 'symbol', 'icon-symbol'] as const)('uses identical assignments and group indices in %s', mode => {
    for (const trait of ['vertness', 'democracy', 'process'] as const) {
      const example = selectTypeArpExample('ILE', trait);
      const html = renderToStaticMarkup(<ModelAPreviewGrid typeIds={['ILE']} view={example.view} aspectDisplayMode={mode} selectedTypeId="ILE" />);
      expect(html.match(new RegExp(`data-aspect-glyph-mode="${mode}"`, 'g'))).toHaveLength(8);
      for (const cell of example.assignments) expect(html).toContain(`data-model-preview-function-id="${cell.functionId}" data-model-preview-aspect-id="${cell.aspectId}" data-model-preview-highlighted="${cell.isHighlighted}" data-model-preview-highlight-group="${cell.highlightGroupIndex ?? ''}"`);
      if (trait === 'process') {
        for (const direction of ['cw', 'ccw']) expect(html.match(new RegExp(`data-cycle-pointer-direction="${direction}"`, 'g'))).toHaveLength(4);
      }
    }
  });
});
