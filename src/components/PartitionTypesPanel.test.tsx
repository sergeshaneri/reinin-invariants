import { isValidElement, type ReactNode, Children, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { selectTypeArpExample } from '../data/typeArp';
import { ModelAPreviewGrid } from './ModelAPreviewGrid';
import { PartitionTypesPanel } from './PartitionTypesPanel';

const elements = (node: ReactNode): ReactElement<Record<string, unknown>>[] => Children.toArray(node).flatMap(child => {
  if (!isValidElement<Record<string, unknown>>(child)) return [];
  return [child, ...elements(child.props.children as ReactNode)];
});

describe('partition type selection contract', () => {
  it('forwards optional selection props unchanged to the existing gallery', () => {
    const example = selectTypeArpExample('ILE', 'process');
    const select = vi.fn();
    const tree = PartitionTypesPanel({ view: example.typesPanel, activeView: example.view, aspectDisplayMode: 'symbol', selectedTypeId: 'ILE', onSelectType: select });
    const gallery = elements(tree as ReactNode).find(element => element.type === ModelAPreviewGrid)!;
    expect(gallery.props.selectedTypeId).toBe('ILE');
    expect(gallery.props.onSelectType).toBe(select);
    expect(gallery.props.typeIds).toEqual(example.typesPanel.types.map(type => type.id));
  });
  it('preserves the old panel without buttons or selection labels', () => {
    const example = selectTypeArpExample('ILE', 'process');
    const html = renderToStaticMarkup(<PartitionTypesPanel view={example.typesPanel} activeView={example.view} aspectDisplayMode="icon" />);
    expect(html).not.toContain('<button');
    expect(html).not.toContain('Выбранный тип');
    expect(html).toContain('Типы полюса');
    expect(html.match(/data-model-preview-type-id=/g)).toHaveLength(example.typesPanel.types.length);
  });
  it('calls selection with the actual clicked type ID', () => {
    const example = selectTypeArpExample('ILE', 'vertness');
    const select = vi.fn();
    const ids = example.typesPanel.types.map(type => type.id);
    const tree = ModelAPreviewGrid({ typeIds: ids, view: example.view, aspectDisplayMode: 'symbol', selectedTypeId: 'ILE', onSelectType: select });
    const buttons = elements(tree as ReactNode).filter(element => element.type === 'button');
    buttons.forEach(button => (button.props.onClick as () => void)());
    expect(select.mock.calls).toEqual(ids.map(id => [id]));
  });
});
