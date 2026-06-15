import { describe, expect, it } from 'vitest';
import { MODEL_A_LAYOUT, REININ_TRAITS } from './socionics';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from './memberships';
import {
  selectDichotomyDistributionView,
  selectDichotomyTypesPanelView,
  selectOctochotomyView,
  selectPartitionExplorerView,
  selectPartitionTypesPanelView,
  selectTetrachotomyView,
  selectTypeModelPreviews,
  selectTypeModelView,
  selectTypeTraitExample,
} from './selectors';

describe('domain selectors', () => {
  it('selects a type model in Model A layout order', () => {
    const view = selectTypeModelView('ILE');

    expect(view.type).toEqual({
      id: 'ILE',
      name: 'Интуитивно-логический экстраверт',
      quadraId: 'alpha',
      aliases: ['ИЛЭ', 'Дон Кихот', 'ENTp'],
    });
    expect(view.assignments.map(assignment => assignment.functionId)).toEqual(MODEL_A_LAYOUT);
    expect(view.assignments.map(assignment => assignment.aspectId)).toEqual([
      'Ne',
      'Ti',
      'Fi',
      'Se',
      'Fe',
      'Si',
      'Ni',
      'Te',
    ]);
  });

  it('uses localized type names with Russian fallback for domain labels', () => {
    const view = selectTypeModelView('ILE', 'en');

    expect(view.type.name).toBe('Intuitive Logical Extravert');
    expect(view.assignments[0]).toMatchObject({
      functionName: 'Базовая',
      aspectName: 'ЧИ',
      aspectFullName: 'Интуиция возможностей',
    });
  });

  it('selects the selected type pole for a trait example', () => {
    const view = selectTypeTraitExample('SEI', 'vertness');

    expect(view).toMatchObject({
      type: {
        id: 'SEI',
        name: 'Сенсорно-этический интроверт',
      },
      trait: {
        id: 'vertness',
        name: 'Экстраверсия / Интроверсия',
      },
      pole: {
        poleIndex: 1,
        name: 'Интроверты',
      },
    });
  });

  it('selects tetrachotomy classes with labels and type summaries', () => {
    const view = selectTetrachotomyView(['vertness', 'nalness']);

    expect(view.ok).toBe(true);
    if (!view.ok) return;

    expect(view.kind).toBe('tetrachotomy');
    expect(view.traits.map(trait => trait.id)).toEqual(['vertness', 'nalness']);
    expect(view.classes).toHaveLength(4);
    expect(view.classes[0]).toMatchObject({
      key: 'vertness:0|nalness:0',
      poles: [
        { trait: { id: 'vertness' }, poleIndex: 0, poleName: 'Экстраверты' },
        { trait: { id: 'nalness' }, poleIndex: 0, poleName: 'Иррационалы' },
      ],
      types: [
        { id: 'ILE', name: 'Интуитивно-логический экстраверт' },
        { id: 'SLE', name: 'Сенсорно-логический экстраверт' },
        { id: 'SEE', name: 'Сенсорно-этический экстраверт' },
        { id: 'IEE', name: 'Интуитивно-этический экстраверт' },
      ],
    });
    expect(view.patternCells).toHaveLength(16);
    expect(view.patternCells.map(cell => cell.type.id).slice(0, 4)).toEqual([
      'ILE',
      'SEI',
      'ESE',
      'LII',
    ]);
    expect(view.patternCells[0]).toMatchObject({
      type: { id: 'ILE' },
      classKey: 'vertness:0|nalness:0',
      poleNames: ['Экстраверты', 'Иррационалы'],
    });
  });

  it('selects octochotomy classes for valid triples', () => {
    const view = selectOctochotomyView(['vertness', 'nalness', 'carefree']);

    expect(view.ok).toBe(true);
    if (!view.ok) return;

    expect(view.kind).toBe('octochotomy');
    expect(view.classes).toHaveLength(8);
    expect(view.classes.every(partitionClass => partitionClass.types.length === 2)).toBe(true);
  });

  it('selects a dichotomy distribution class by pole index', () => {
    const view = selectDichotomyDistributionView('vertness', 1);

    expect(view).toMatchObject({
      kind: 'dichotomy',
      selectedClassKey: 'vertness:1',
      selectedClass: {
        key: 'vertness:1',
        poles: [
          { trait: { id: 'vertness' }, poleIndex: 1, poleName: 'Интроверты' },
        ],
        types: [
          { id: 'SEI' },
          { id: 'LII' },
          { id: 'LSI' },
          { id: 'IEI' },
          { id: 'ESI' },
          { id: 'ILI' },
          { id: 'SLI' },
          { id: 'EII' },
        ],
      },
    });
  });

  it('selects types for the active dichotomy pole panel', () => {
    const view = selectDichotomyTypesPanelView('vertness', 1);

    expect(view).toMatchObject({
      kind: 'dichotomy',
      classKey: 'vertness:1',
      types: [
        { id: 'SEI' },
        { id: 'LII' },
        { id: 'LSI' },
        { id: 'IEI' },
        { id: 'ESI' },
        { id: 'ILI' },
        { id: 'SLI' },
        { id: 'EII' },
      ],
    });
  });

  it('selects types for the active partition explorer class panel', () => {
    const view = selectPartitionTypesPanelView(
      ['vertness', 'nalness'],
      'vertness:1|nalness:0',
    );

    expect(view).toMatchObject({
      kind: 'tetrachotomy',
      classKey: 'vertness:1|nalness:0',
      types: [
        { id: 'SEI' },
        { id: 'IEI' },
        { id: 'ILI' },
        { id: 'SLI' },
      ],
    });
  });

  it('selects compact model previews with invariant highlight groups', () => {
    const vertnessView = REININ_TRAITS[0].poles[0].views[0];
    const previews = selectTypeModelPreviews(['ILE'], vertnessView);

    expect(previews[0]).toMatchObject({
      type: { id: 'ILE' },
      assignments: [
        { functionId: 1, aspectId: 'Ne', isHighlighted: true, highlightGroupIndex: 0 },
        { functionId: 2, aspectId: 'Ti', isHighlighted: true, highlightGroupIndex: 1 },
        { functionId: 4, aspectId: 'Fi', isHighlighted: true, highlightGroupIndex: 1 },
        { functionId: 3, aspectId: 'Se', isHighlighted: true, highlightGroupIndex: 0 },
        { functionId: 6, aspectId: 'Fe', isHighlighted: true, highlightGroupIndex: 0 },
        { functionId: 5, aspectId: 'Si', isHighlighted: true, highlightGroupIndex: 1 },
        { functionId: 7, aspectId: 'Ni', isHighlighted: true, highlightGroupIndex: 1 },
        { functionId: 8, aspectId: 'Te', isHighlighted: true, highlightGroupIndex: 0 },
      ],
    });
  });

  it('highlights compact model previews by aspect block for block-permutation views', () => {
    const democracy = REININ_TRAITS.find(trait => trait.id === 'democracy');
    expect(democracy).toBeDefined();
    if (!democracy) return;

    const democraticTypeIds = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID.democracy.poles[0].typeIds;
    const previews = selectTypeModelPreviews(democraticTypeIds, democracy.poles[0].views[0]);

    expect(previews.map(preview => ({
      typeId: preview.type.id,
      highlightedCount: preview.assignments.filter(assignment => assignment.isHighlighted).length,
    }))).toEqual(democraticTypeIds.map(typeId => ({
      typeId,
      highlightedCount: 8,
    })));

    expect(previews[1]).toMatchObject({
      type: { id: 'SEI' },
      assignments: [
        { functionId: 1, aspectId: 'Si', isHighlighted: true, highlightGroupIndex: 2 },
        { functionId: 2, aspectId: 'Fe', isHighlighted: true, highlightGroupIndex: 2 },
        { functionId: 4, aspectId: 'Te', isHighlighted: true, highlightGroupIndex: 3 },
        { functionId: 3, aspectId: 'Ni', isHighlighted: true, highlightGroupIndex: 3 },
        { functionId: 6, aspectId: 'Ti', isHighlighted: true, highlightGroupIndex: 0 },
        { functionId: 5, aspectId: 'Ne', isHighlighted: true, highlightGroupIndex: 0 },
        { functionId: 7, aspectId: 'Se', isHighlighted: true, highlightGroupIndex: 1 },
        { functionId: 8, aspectId: 'Fi', isHighlighted: true, highlightGroupIndex: 1 },
      ],
    });
  });

  it('keeps process/result compact model previews fully highlighted as cycle groups', () => {
    const process = REININ_TRAITS.find(trait => trait.id === 'process');
    expect(process).toBeDefined();
    if (!process) return;

    const processTypeIds = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID.process.poles[0].typeIds;
    const previews = selectTypeModelPreviews(processTypeIds, process.poles[0].views[0]);

    expect(previews.every(preview => (
      preview.assignments.every(assignment => assignment.isHighlighted)
    ))).toBe(true);
    expect(previews[0].assignments.map(assignment => assignment.highlightGroupIndex)).toEqual([
      0,
      1,
      3,
      2,
      3,
      2,
      0,
      1,
    ]);
  });

  it('returns partition diagnostics without throwing', () => {
    const view = selectOctochotomyView(['vertness', 'nalness', 'talness']);

    expect(view).toMatchObject({
      ok: false,
      traitIds: ['vertness', 'nalness', 'talness'],
      reason: 'dependent-traits',
      traits: [
        { id: 'vertness' },
        { id: 'nalness' },
        { id: 'talness' },
      ],
    });
  });

  it('selects the requested partition explorer class', () => {
    const view = selectPartitionExplorerView(
      ['vertness', 'nalness'],
      'vertness:1|nalness:0',
    );

    expect(view).toMatchObject({
      kind: 'tetrachotomy',
      selectedClassKey: 'vertness:1|nalness:0',
      selectedClass: {
        key: 'vertness:1|nalness:0',
        types: [
          { id: 'SEI' },
          { id: 'IEI' },
          { id: 'ILI' },
          { id: 'SLI' },
        ],
      },
    });
  });

  it('defaults partition explorer class selection to the class containing ILE', () => {
    const view = selectPartitionExplorerView(
      ['carefree', 'yielding', 'intuition'],
      'missing',
    );

    expect(view).toMatchObject({
      kind: 'octochotomy',
      selectedClassKey: 'carefree:0|yielding:0|intuition:0',
      selectedClass: {
        key: 'carefree:0|yielding:0|intuition:0',
        types: [
          { id: 'ILE' },
          { id: 'LIE' },
        ],
      },
    });
  });

  it('does not select a partition class for diagnostic results', () => {
    const view = selectPartitionExplorerView(
      ['vertness', 'nalness', 'talness'],
      'vertness:0|nalness:0|talness:0',
    );

    expect(view).toMatchObject({
      kind: 'octochotomy',
      partition: {
        ok: false,
        reason: 'dependent-traits',
      },
      selectedClassKey: null,
      selectedClass: null,
    });
  });
});
