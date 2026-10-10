import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReferencePage } from '../components/ReferencePage';
import { HADAMARD_MATRICES } from './hadamard';
import { TETRACHOTOMY_FORMULAS } from './tetrachotomies';
import { OCTOCHOTOMY_FORMULAS } from './octochotomies';
import {
  ASPECT_FEATURES, FUNCTIONS, FUNCTION_FEATURES, deriveGroupFunctionFeatures,
  formatFunctionFeatures, formatFunctionGroupLabel, formatBlockEquivalenceDescription,
} from './socionics';

const obsoleteTerms = /статич|динамич|статик|динамик|иррациональ|рациональ/i;

describe('mental/vital function terminology', () => {
  it('uses accepting/producing poles for individual functions, groups and equivalence descriptions', () => {
    const feature = FUNCTION_FEATURES.find(item => item.key === 'isAcceptant')!;
    expect(feature.title).toBe('Акцептная / Продуктивная');
    expect([feature.posSingular, feature.negSingular, feature.posPlural, feature.negPlural])
      .toEqual(['Акцептная', 'Продуктивная', 'Акцептные', 'Продуктивные']);
    expect(feature.categoryDative).toBe('акцептности/продуктивности');
    for (const fn of FUNCTIONS) {
      expect(formatFunctionFeatures(fn)).toContain(fn.isAcceptant ? 'Акцептная' : 'Продуктивная');
    }
    for (const acceptant of [true, false]) {
      const group = FUNCTIONS.filter(fn => fn.isAcceptant === acceptant);
      expect(group.map(fn => fn.id)).toEqual(acceptant ? [1, 3, 5, 7] : [2, 4, 6, 8]);
      expect(formatFunctionGroupLabel(deriveGroupFunctionFeatures(group)))
        .toBe(acceptant ? 'Акцептные' : 'Продуктивные');
    }
    const description = formatBlockEquivalenceDescription([
      { aspects: ['Ne', 'Si', 'Se', 'Ni'], functions: [1, 3, 5, 7] },
      { aspects: ['Fe', 'Ti', 'Te', 'Fi'], functions: [2, 4, 6, 8] },
    ]);
    expect(description).toContain('по иррациональности/рациональности');
    expect(description).toContain('по акцептности/продуктивности');
    expect(ASPECT_FEATURES.find(item => item.key === 'isIrrational')?.title).toBe('Иррациональный / Рациональный');
  });

  it('uses carrier-specific functional poles in the Hadamard matrix', () => {
    const matrix = HADAMARD_MATRICES.find(item => item.id === 'functionon')!;
    expect(JSON.stringify(matrix.columns)).not.toMatch(obsoleteTerms);
    expect(matrix.columns.find(column => column.short === 'Наль'))
      .toMatchObject({ positive: 'Акцептная', negative: 'Продуктивная' });
    expect(matrix.columns.find(column => column.short === 'Таль'))
      .toMatchObject({ positive: 'Ментальная', negative: 'Витальная' });
  });

  it('keeps function terms distinct from aspect terms in every imported source row', () => {
    const rows = [
      ...TETRACHOTOMY_FORMULAS.flatMap(formula => formula.sourceBlocks?.flatMap(block => block.rows) ?? []),
      ...OCTOCHOTOMY_FORMULAS.flatMap(formula => formula.classes?.flatMap(group => group.sourceBlock?.rows ?? []) ?? []),
    ];
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.functionFeaturesText).not.toMatch(obsoleteTerms);
      expect(row.functionBlockLabel).not.toMatch(obsoleteTerms);
    }
  });

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
    expect(functionSection).toContain('Акцептная / Продуктивная');
    expect(functionSection).toContain('Акцептные функции — позиции 1, 3, 5, 7; продуктивные — 2, 4, 6, 8.');
    expect(functionSection).not.toMatch(obsoleteTerms);
    const aspectSection = html.split('<section id="aspects"')[1].split('</section>')[0];
    expect(aspectSection).toContain('Статичный / Динамичный');
  });
});
