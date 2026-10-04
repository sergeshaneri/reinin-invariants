import { describe, expect, it } from 'vitest';
import { ASPECTS, ASPECT_FEATURES, formatAspectFeatures, formatGroupLabel, deriveGroupFeatures, formatBlockEquivalenceDescription } from './socionics';

describe('aspect quadra-derived terminology', () => {
  it('uses short pole names in labels, tooltips and equivalence descriptions', () => {
    for (const [key, positive, negative] of [
      ['isAlphaValued', 'Альфа', 'Гамма'],
      ['isDeltaValued', 'Дельта', 'Бета'],
    ] as const) {
      const feature = ASPECT_FEATURES.find(item => item.key === key)!;
      expect(feature.title).toBe(`${positive} / ${negative}`);
      expect([feature.posSingular, feature.posPlural]).toEqual([positive, positive]);
      expect([feature.negSingular, feature.negPlural]).toEqual([negative, negative]);
      expect(formatGroupLabel(deriveGroupFeatures(ASPECTS.filter(aspect => aspect[key])))).toBe(positive);
    }
    expect(formatAspectFeatures(ASPECTS[0])).toContain('Дельта · Отвлечённый · Альфа');
    const description = formatBlockEquivalenceDescription([
      { aspects: ['Ne', 'Si', 'Fe', 'Ti'], functions: [1, 2, 5, 6] },
      { aspects: ['Te', 'Fi', 'Se', 'Ni'], functions: [3, 4, 7, 8] },
    ]);
    expect(description).toContain('по признаку «Альфа / Гамма»');
    expect(JSON.stringify(ASPECT_FEATURES)).not.toMatch(/ценн|ценност/);
  });
});
