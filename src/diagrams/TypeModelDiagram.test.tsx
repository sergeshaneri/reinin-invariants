import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Children, isValidElement, type ReactNode, type ReactElement } from 'react';
import { MODEL_A_LAYOUT } from '../data/socionics';
import { selectTypeModelPreviews } from '../data/selectors';
import { selectTypeArpExample } from '../data/typeArp';
import { TypeModelDiagram } from './TypeModelDiagram';

const elements = (node: ReactNode): ReactElement<Record<string, unknown>>[] => Children.toArray(node).flatMap(child => {
  if (!isValidElement<Record<string, unknown>>(child)) return [];
  return [child, ...elements(child.props.children as ReactNode)];
});

describe('type model ARP', () => {
  it('marks only pinned cells pressed while retaining transient highlight', () => {
    const example = selectTypeArpExample('ILE', 'logic');
    const html = renderToStaticMarkup(<TypeModelDiagram typeId="ILE" aspectDisplayMode="icon" arpExample={example} activeArpGroupIndex={0} pinnedArpGroupIndex={null} />);
    expect(html).toContain('data-arp-active="true"');
    expect(html).not.toContain('aria-pressed="true"');
    const pinned = renderToStaticMarkup(<TypeModelDiagram typeId="ILE" aspectDisplayMode="icon" arpExample={example} activeArpGroupIndex={1} pinnedArpGroupIndex={0} />);
    expect(pinned.match(/aria-pressed="true"/g)).toHaveLength(2);
    expect(html).toContain('flex-col items-start gap-3 sm:flex-row sm:items-center');
  });
  it('uses actual fixed assignments and registered group tones', () => {
    const example = selectTypeArpExample('ILE', 'vertness');
    const html = renderToStaticMarkup(<TypeModelDiagram typeId="ILE" aspectDisplayMode="symbol" arpExample={example} />);
    for (const cell of example.assignments) {
      expect(html).toContain(`data-type-model-function-id="${cell.functionId}" data-type-model-aspect-id="${cell.aspectId}" data-arp-group-index="${cell.highlightGroupIndex}"`);
    }
    expect(html).toContain('map-tone-0');
    expect(html).toContain('map-tone-1');
  });
  it('separates large-model rings using their actual grid rows with four arrows each', () => {
    const html = renderToStaticMarkup(<TypeModelDiagram typeId="ILE" aspectDisplayMode="icon" arpExample={selectTypeArpExample('ILE', 'process')} />);
    expect(html).toContain('data-type-model-ring-gap');
    expect(html).toContain('grid-row:1 / 3');
    expect(html).toContain('grid-row:4 / 6');
    for (const direction of ['cw', 'ccw']) {
      expect(html.match(new RegExp(`data-cycle-pointer-direction="${direction}"`, 'g'))).toHaveLength(4);
    }
    for (const tone of [0, 1, 2, 3]) expect(html).toContain(`map-tone-${tone}`);
  });
  it.each(['icon', 'symbol', 'icon-symbol'] as const)('preserves the neutral model in %s', mode => {
    const html = renderToStaticMarkup(<TypeModelDiagram typeId="ILE" aspectDisplayMode={mode} />);
    expect([...html.matchAll(/data-type-model-function-id="(\d+)"/g)].map(match => Number(match[1]))).toEqual(MODEL_A_LAYOUT);
    expect(html.match(new RegExp(`data-aspect-glyph-mode="${mode}"`, 'g'))).toHaveLength(8);
    expect(html).not.toContain('map-tone-');
    expect(html).not.toContain('<button');
    expect(html).not.toContain('data-type-model-cycle-ring');
    expect(html).toContain('Базовая');
    expect(html).toContain('Интуиция возможностей');
  });
  it('colors actual aspect blocks, not their target-block indices', () => {
    const example = selectTypeArpExample('SEI', 'democracy');
    const html = renderToStaticMarkup(<TypeModelDiagram typeId="SEI" aspectDisplayMode="symbol" arpExample={example} />);
    for (const cell of example.assignments) expect(html).toContain(`data-type-model-function-id="${cell.functionId}" data-type-model-aspect-id="${cell.aspectId}" data-arp-group-index="${cell.highlightGroupIndex}"`);
    expect(html).not.toContain('data-type-model-cycle-ring');
  });
  it('forwards mouse, keyboard and repeated selection by group index', () => {
    const hover = vi.fn();
    const select = vi.fn();
    const tree = TypeModelDiagram({ typeId: 'ILE', aspectDisplayMode: 'symbol', arpExample: selectTypeArpExample('ILE', 'vertness'), activeArpGroupIndex: 0, onArpGroupHover: hover, onArpGroupSelect: select });
    const button = elements(tree as ReactNode).find(element => element.type === 'button')!;
    for (const event of ['onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur', 'onClick', 'onClick']) (button.props[event] as () => void)();
    expect(hover.mock.calls).toEqual([[0], [null], [0], [null]]);
    expect(select.mock.calls).toEqual([[0], [0]]);
    expect(button.props['aria-pressed']).toBe(true);
  });
  it('ignores a stale example for another selected type', () => {
    const html = renderToStaticMarkup(<TypeModelDiagram typeId="SEI" aspectDisplayMode="symbol" arpExample={selectTypeArpExample('ILE', 'process')} />);
    expect(html).not.toContain('map-tone-');
    expect(html).not.toContain('data-type-model-cycle-ring');
  });
  it('leaves cells outside a partial mapping neutral', () => {
    const base = selectTypeArpExample('ILE', 'vertness');
    const view = { title: '', mappings: [{ aspects: ['Ne' as const], functions: [1, 2] }] };
    const example = { ...base, assignments: selectTypeModelPreviews(['ILE'], view)[0].assignments };
    const html = renderToStaticMarkup(<TypeModelDiagram typeId="ILE" aspectDisplayMode="symbol" arpExample={example} />);
    expect(html.match(/map-tone-0/g)).toHaveLength(1);
    expect(html.match(/data-arp-group-index=""/g)).toHaveLength(7);
    expect(html.match(/<button /g)).toHaveLength(1);
  });
});
