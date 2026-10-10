import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { REININ_TRAITS } from '../data/socionics';
import { PoleSelector } from './PoleSelector';

const trait = REININ_TRAITS.find(candidate => candidate.id === 'process')!;

describe('pole selector heading', () => {
  it.each([0, 1])('has no heading icon and retains the selected-pole marker for pole %i', selectedPoleIndex => {
    const html = renderToStaticMarkup(<PoleSelector
      trait={trait}
      selectedPoleIndex={selectedPoleIndex}
      activeView={trait.poles[selectedPoleIndex].views[0]}
      onSelectPole={() => {}}
    />);
    const heading = html.match(/<h2[^>]*>(.*?)<\/h2>/)![1];
    expect(heading.trim()).toBe('Полюс');
    expect(heading).not.toContain('<svg');
    expect(html.match(/data-selected-pole-marker/g)).toHaveLength(1);
  });
});
