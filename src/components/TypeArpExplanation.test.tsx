import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Children, isValidElement, type ReactNode, type ReactElement } from 'react';
import { analyzeTypeArpStructure, selectTypeArpExample } from '../data/typeArp';
import { selectTypeModelView } from '../data/selectors';
import { TypeArpExplanation } from './TypeArpExplanation';

const elements = (node: ReactNode): ReactElement<Record<string, unknown>>[] => Children.toArray(node).flatMap(child => {
  if (!isValidElement<Record<string, unknown>>(child)) return [];
  return [child, ...elements(child.props.children as ReactNode)];
});

describe('concrete type ARP explanation', () => {
  it('separates transient activity from explicit committed selection', () => {
    const example = selectTypeArpExample('ILE', 'logic');
    const html = renderToStaticMarkup(<TypeArpExplanation example={example} aspectDisplayMode="icon" activeGroupIndex={0} pinnedGroupIndex={null} />);
    expect(html).toContain('data-arp-active="true"');
    expect(html).not.toContain('aria-pressed="true"');
    const pinned = renderToStaticMarkup(<TypeArpExplanation example={example} aspectDisplayMode="icon" activeGroupIndex={1} pinnedGroupIndex={0} />);
    expect(pinned).toMatch(/data-arp-group-index="0" aria-pressed="true"/);
    expect(pinned).toMatch(/data-arp-group-index="1" data-arp-active="true" aria-pressed="false"/);
  });
  it('renders the accepted groups, concrete images and structural result', () => {
    const example = selectTypeArpExample('SEI', 'democracy');
    const html = renderToStaticMarkup(<TypeArpExplanation example={example} aspectDisplayMode="symbol" activeGroupIndex={0} />);
    for (const group of example.groups) expect(html).toContain(group.explanation);
    expect(html).toContain('Как это устроено у');
    expect(html).toContain('Структурное условие подтверждено');
    expect(html).toContain('aria-pressed="true"');
  });
  it.each(['icon', 'symbol', 'icon-symbol'] as const)('renders group glyphs and actual cyclic tacts in %s', mode => {
    const example = selectTypeArpExample('ILE', 'process');
    const html = renderToStaticMarkup(<TypeArpExplanation example={example} aspectDisplayMode={mode} />);
    expect(html.match(new RegExp(`data-aspect-glyph-mode="${mode}"`, 'g'))).toHaveLength(8);
    expect(html).toContain(example.structuralCheck.cycle!.explanation);
    expect(html).toContain('1-й такт: функции {3, 5}');
    expect(html).toContain('Сохранение блоков: подтверждено');
    expect(html).toContain('Циклический порядок: подтверждено');
  });
  it('shows containment without replacing it with equality', () => {
    const base = selectTypeArpExample('ILE', 'vertness');
    const analysis = analyzeTypeArpStructure(selectTypeModelView('ILE').assignments, { title: '', mappings: [{ aspects: ['Ne'], functions: [1, 2] }] });
    const html = renderToStaticMarkup(<TypeArpExplanation example={{ ...base, ...analysis }} aspectDisplayMode="symbol" />);
    expect(html).toContain('принадлежность допустимой группе');
    expect(html).not.toContain('равенство множеств');
  });
  it.each(['failed', 'unsupported'] as const)('reports %s diagnostics without substituting membership as proof', status => {
    const base = selectTypeArpExample('ILE', 'vertness');
    const analysis = analyzeTypeArpStructure(selectTypeModelView('ILE').assignments, { title: '', mappings: status === 'unsupported' ? [] : [{ aspects: ['Ne'], functions: [8] }] });
    const html = renderToStaticMarkup(<TypeArpExplanation example={{ ...base, ...analysis }} aspectDisplayMode="symbol" />);
    expect(html).toContain(`data-arp-structural-status="${status}"`);
    expect(html).not.toContain('Структурное условие подтверждено');
    for (const diagnostic of analysis.structuralCheck.diagnostics) expect(html).toContain(diagnostic.message);
  });
  it('forwards hover, focus and clicks without owning interaction state', () => {
    const hover = vi.fn();
    const select = vi.fn();
    const tree = TypeArpExplanation({ example: selectTypeArpExample('ILE', 'process'), aspectDisplayMode: 'symbol', activeGroupIndex: 1, onGroupHover: hover, onGroupSelect: select });
    const button = elements(tree as ReactNode).filter(element => element.type === 'button')[1];
    for (const event of ['onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur', 'onClick', 'onClick']) (button.props[event] as () => void)();
    expect(hover.mock.calls).toEqual([[1], [null], [1], [null]]);
    expect(select.mock.calls).toEqual([[1], [1]]);
    expect(button.props['aria-pressed']).toBe(true);
  });
});
