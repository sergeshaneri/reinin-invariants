import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReferencePage } from '../components/ReferencePage';
import {
  ASPECT_FEATURES, FUNCTIONS, FUNCTION_FEATURES, deriveGroupFunctionFeatures,
  formatFunctionFeatures, formatFunctionGroupLabel, formatBlockEquivalenceDescription,
} from './socionics';

const obsoleteTerms = /статич|динамич|статик|динамик/i;

describe('mental/vital function terminology', () => {
  it('uses mental/vital poles in all generated function labels and descriptions', () => {
    const feature = FUNCTION_FEATURES.find(item => item.key === 'isMental')!;
    expect(feature.title).toBe('Ментальная / Витальная');
    expect([feature.posSingular, feature.negSingular, feature.posPlural, feature.negPlural])
      .toEqual(['Ментальная', 'Витальная', 'Ментальные', 'Витальные']);
    expect(feature.categoryDative).toBe('ментальности/витальности');
    expect(JSON.stringify(FUNCTION_FEATURES)).not.toMatch(obsoleteTerms);
    for (const fn of FUNCTIONS) {
      const label = formatFunctionFeatures(fn);
      expect(label).toContain(fn.isMental ? 'Ментальная' : 'Витальная');
      expect(label).not.toMatch(obsoleteTerms);
    }
    for (const mental of [true, false]) {
      const group = FUNCTIONS.filter(fn => fn.isMental === mental);
      expect(group.map(fn => fn.id)).toEqual(mental ? [1, 2, 3, 4] : [5, 6, 7, 8]);
      expect(formatFunctionGroupLabel(deriveGroupFunctionFeatures(group)))
        .toBe(mental ? 'Ментальные' : 'Витальные');
    }
    const description = formatBlockEquivalenceDescription([
      { aspects: ['Ne', 'Ti', 'Fi', 'Se'], functions: [1, 2, 3, 4] },
      { aspects: ['Si', 'Fe', 'Te', 'Ni'], functions: [5, 6, 7, 8] },
    ]);
    expect(description).toContain('по ментальности/витальности');
    expect(ASPECT_FEATURES.find(item => item.key === 'isStatic')?.title).toBe('Статичный / Динамичный');
  });

  it('distinguishes aspect statics/dynamics from function mentality/vitality in the reference page', () => {
    const html = renderToString(<ReferencePage />);
    const functionSection = html.split('<section id="functions"')[1].split('</section>')[0];
    expect(functionSection).toContain('Ментальная / Витальная');
    expect(functionSection).toContain('Ментальные функции — позиции 1, 2, 3, 4; витальные — 5, 6, 7, 8.');
    expect(functionSection).not.toMatch(obsoleteTerms);
    const aspectSection = html.split('<section id="aspects"')[1].split('</section>')[0];
    expect(aspectSection).toContain('Статичный / Динамичный');
  });
});
