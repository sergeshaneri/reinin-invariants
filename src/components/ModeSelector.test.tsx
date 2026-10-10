import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ModeSelector } from './ModeSelector';

const renderTabs = () => renderToStaticMarkup(
  <ModeSelector mode="trait" onSelectMode={() => {}} />,
).match(/<button\b[^>]*>.*?<\/button>/g)!;

describe('mode selector', () => {
  it('places type after octochotomy', () => {
    const labels = renderTabs().map(tab => tab.match(/<span[^>]*>(.*?)<\/span>/)![1]);
    expect(labels).toEqual(['Признак', 'Тетрахотомия', 'Октохотомия', 'Тип']);
  });

  it('uses a person for type and a cube for octochotomy', () => {
    const tabs = renderTabs();
    const type = tabs.find(tab => tab.includes('>Тип</span>'))!;
    const octochotomy = tabs.find(tab => tab.includes('>Октохотомия</span>'))!;
    expect(type).toContain('lucide-user-round');
    expect(octochotomy).toContain('lucide-box');
    expect(type).not.toContain('lucide-boxes');
    expect(octochotomy).not.toContain('lucide-git-branch');
  });
});
