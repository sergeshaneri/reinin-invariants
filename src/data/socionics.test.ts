import { describe, expect, it } from 'vitest';
import { DECORATORS } from '../decorators/registry';
import { DEFAULT_DIAGRAM_ID, DIAGRAMS } from '../diagrams/registry';
import { ASPECTS, FUNCTIONS, MODEL_A_LAYOUT, REININ_TRAITS } from './socionics';

const aspectIds = new Set(ASPECTS.map(aspect => aspect.id));
const functionIds = new Set(FUNCTIONS.map(fn => fn.id));

const expectUnique = <T>(values: T[], label: string) => {
  const seen = new Set<T>();
  const duplicates = new Set<T>();

  values.forEach(value => {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  });

  expect([...duplicates], label).toEqual([]);
};

describe('socionics data', () => {
  it('defines unique aspect and function ids', () => {
    expectUnique(ASPECTS.map(aspect => aspect.id), 'aspect ids');
    expectUnique(FUNCTIONS.map(fn => fn.id), 'function ids');
  });

  it('keeps the Model A layout aligned with registered functions', () => {
    expectUnique([...MODEL_A_LAYOUT], 'MODEL_A_LAYOUT function ids');
    expect(new Set(MODEL_A_LAYOUT)).toEqual(functionIds);
  });

  it('defines two non-empty poles and at least one view for every trait', () => {
    REININ_TRAITS.forEach(trait => {
      expect(trait.poles, `${trait.id} poles`).toHaveLength(2);

      trait.poles.forEach((pole, poleIndex) => {
        expect(pole.views.length, `${trait.id}/pole${poleIndex} views`).toBeGreaterThan(0);

        pole.views.forEach((view, viewIndex) => {
          expect(
            view.mappings.length,
            `${trait.id}/pole${poleIndex}/view${viewIndex} mappings`,
          ).toBeGreaterThan(0);
        });
      });
    });
  });

  it('references only registered aspects and functions in mappings', () => {
    REININ_TRAITS.forEach(trait => {
      trait.poles.forEach((pole, poleIndex) => {
        pole.views.forEach((view, viewIndex) => {
          view.mappings.forEach((mapping, mappingIndex) => {
            mapping.aspects.forEach(aspectId => {
              expect(
                aspectIds.has(aspectId),
                `${trait.id}/pole${poleIndex}/view${viewIndex}/mapping${mappingIndex} aspect ${aspectId}`,
              ).toBe(true);
            });

            mapping.functions.forEach(functionId => {
              expect(
                functionIds.has(functionId),
                `${trait.id}/pole${poleIndex}/view${viewIndex}/mapping${mappingIndex} function ${functionId}`,
              ).toBe(true);
            });
          });
        });
      });
    });
  });

  it('does not repeat an aspect or function inside one view', () => {
    REININ_TRAITS.forEach(trait => {
      trait.poles.forEach((pole, poleIndex) => {
        pole.views.forEach((view, viewIndex) => {
          const aspects = view.mappings.flatMap(mapping => mapping.aspects);
          const functions = view.mappings.flatMap(mapping => mapping.functions);

          expectUnique(aspects, `${trait.id}/pole${poleIndex}/view${viewIndex} aspects`);
          expectUnique(functions, `${trait.id}/pole${poleIndex}/view${viewIndex} functions`);
        });
      });
    });
  });
});

describe('diagram and decorator registries', () => {
  it('registers the default diagram and every trait diagram reference', () => {
    expect(DIAGRAMS[DEFAULT_DIAGRAM_ID], `default diagram ${DEFAULT_DIAGRAM_ID}`).toBeDefined();

    REININ_TRAITS.forEach(trait => {
      const diagramId = trait.diagramId ?? DEFAULT_DIAGRAM_ID;
      expect(DIAGRAMS[diagramId], `${trait.id} diagram ${diagramId}`).toBeDefined();
    });
  });

  it('registers every decorator referenced by a view', () => {
    REININ_TRAITS.forEach(trait => {
      trait.poles.forEach((pole, poleIndex) => {
        pole.views.forEach((view, viewIndex) => {
          view.decoratorIds?.forEach(decoratorId => {
            expect(
              DECORATORS[decoratorId],
              `${trait.id}/pole${poleIndex}/view${viewIndex} decorator ${decoratorId}`,
            ).toBeDefined();
          });
        });
      });
    });
  });
});
