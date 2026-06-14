import { describe, expect, it } from 'vitest';
import { DECORATORS } from '../decorators/registry';
import { DEFAULT_DIAGRAM_ID, DIAGRAMS } from '../diagrams/registry';
import {
  ASPECTS,
  FUNCTIONS,
  MODEL_A_LAYOUT,
  REININ_TRAITS,
  SOCIONIC_TYPE_ORDER,
  SOCIONIC_TYPES,
  TRAIT_TYPE_MEMBERSHIPS,
} from './socionics';

const aspectIds = new Set(ASPECTS.map(aspect => aspect.id));
const functionIds = new Set(FUNCTIONS.map(fn => fn.id));
const traitIds = new Set(REININ_TRAITS.map(trait => trait.id));
const socionicTypeIds = new Set(SOCIONIC_TYPES.map(type => type.id));

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

  it('defines the canonical 16 socionic types in stable order', () => {
    expect(SOCIONIC_TYPES).toHaveLength(16);
    expect(SOCIONIC_TYPE_ORDER).toHaveLength(16);
    expect(SOCIONIC_TYPES.map(type => type.id)).toEqual([...SOCIONIC_TYPE_ORDER]);
    expectUnique([...SOCIONIC_TYPE_ORDER], 'SOCIONIC_TYPE_ORDER ids');
    expectUnique(SOCIONIC_TYPES.map(type => type.id), 'socionic type ids');
  });

  it('keeps socionic type metadata complete for the foundation layer', () => {
    expect(socionicTypeIds).toEqual(new Set(SOCIONIC_TYPE_ORDER));

    SOCIONIC_TYPES.forEach(type => {
      expect(type.names.ru.trim(), `${type.id} Russian name`).not.toBe('');
      expect(type.names.en?.trim(), `${type.id} English name`).not.toBe('');
      expect(type.aliases.socionics?.length, `${type.id} socionics aliases`).toBeGreaterThan(0);
      expect(type.aliases.mbtiLike?.length, `${type.id} MBTI-like aliases`).toBeGreaterThan(0);
    });
  });

  it('defines complete Model A assignments for every socionic type', () => {
    SOCIONIC_TYPES.forEach(type => {
      expect(type.modelA, `${type.id} Model A assignments`).toHaveLength(8);

      const assignedFunctionIds = type.modelA.map(assignment => assignment.functionId);
      const assignedAspectIds = type.modelA.map(assignment => assignment.aspectId);

      expectUnique(assignedFunctionIds, `${type.id} Model A function ids`);
      expectUnique(assignedAspectIds, `${type.id} Model A aspect ids`);
      expect(new Set(assignedFunctionIds), `${type.id} Model A function coverage`).toEqual(
        functionIds,
      );
      expect(new Set(assignedAspectIds), `${type.id} Model A aspect coverage`).toEqual(aspectIds);

      type.modelA.forEach(assignment => {
        expect(
          functionIds.has(assignment.functionId),
          `${type.id} function ${assignment.functionId}`,
        ).toBe(true);
        expect(aspectIds.has(assignment.aspectId), `${type.id} aspect ${assignment.aspectId}`).toBe(
          true,
        );
      });
    });
  });

  it('defines complete type membership for every Reinin trait pole', () => {
    expect(TRAIT_TYPE_MEMBERSHIPS).toHaveLength(REININ_TRAITS.length);
    expectUnique(
      TRAIT_TYPE_MEMBERSHIPS.map(membership => membership.traitId),
      'trait membership ids',
    );
    expect(new Set(TRAIT_TYPE_MEMBERSHIPS.map(membership => membership.traitId))).toEqual(
      traitIds,
    );

    TRAIT_TYPE_MEMBERSHIPS.forEach(membership => {
      expect(traitIds.has(membership.traitId), `${membership.traitId} trait id`).toBe(true);
      expect(membership.poles, `${membership.traitId} membership poles`).toHaveLength(2);

      const typeIdsInMembership = membership.poles.flatMap(pole => [...pole.typeIds]);

      expectUnique(typeIdsInMembership, `${membership.traitId} membership type ids`);
      expect(new Set(typeIdsInMembership), `${membership.traitId} membership coverage`).toEqual(
        socionicTypeIds,
      );

      membership.poles.forEach((pole, poleIndex) => {
        expect(pole.poleIndex, `${membership.traitId} pole index ${poleIndex}`).toBe(poleIndex);
        expect(pole.typeIds, `${membership.traitId} pole ${poleIndex} size`).toHaveLength(8);
        expect(pole.typeIds, `${membership.traitId} pole ${poleIndex} canonical order`).toEqual(
          SOCIONIC_TYPE_ORDER.filter(typeId => pole.typeIds.includes(typeId)),
        );

        pole.typeIds.forEach(typeId => {
          expect(socionicTypeIds.has(typeId), `${membership.traitId} pole ${poleIndex} ${typeId}`)
            .toBe(true);
        });
      });
    });
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
