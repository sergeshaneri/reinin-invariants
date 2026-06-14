import { describe, expect, it } from 'vitest';
import { MODEL_A_LAYOUT } from './socionics';
import {
  selectOctochotomyView,
  selectTetrachotomyView,
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
      aliases: ['ИЛЭ', 'ENTp'],
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
  });

  it('selects octochotomy classes for valid triples', () => {
    const view = selectOctochotomyView(['vertness', 'nalness', 'carefree']);

    expect(view.ok).toBe(true);
    if (!view.ok) return;

    expect(view.kind).toBe('octochotomy');
    expect(view.classes).toHaveLength(8);
    expect(view.classes.every(partitionClass => partitionClass.types.length === 2)).toBe(true);
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
});
