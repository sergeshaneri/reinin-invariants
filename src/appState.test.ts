import { describe, expect, it } from 'vitest';
import {
  getDefaultTraitPoleIndex,
  parseAppUrlState,
  serializeAppUrlState,
  type AppUrlState,
} from './appState';
import { REININ_TRAITS } from './data/socionics';

const traitIndex = (traitId: string) => REININ_TRAITS.findIndex(trait => trait.id === traitId);
const defaultDichotomyPartition = {
  kind: 'dichotomy',
  traitIds: ['vertness'],
  selectedClassKey: 'vertness:0',
} as const;
const defaultTetrachotomyPartition = {
  kind: 'tetrachotomy',
  traitIds: ['vertness', 'nalness'],
  selectedClassKey: 'vertness:0|nalness:0',
} as const;
const defaultOctochotomyPartition = {
  kind: 'octochotomy',
  traitIds: ['vertness', 'nalness', 'carefree'],
  selectedClassKey: 'vertness:0|nalness:0|carefree:0',
} as const;

describe('app URL state', () => {
  it('uses the ILE pole as the default dichotomy detail pole', () => {
    expect(REININ_TRAITS.map(trait => [trait.id, getDefaultTraitPoleIndex(trait.id)])).toEqual(
      REININ_TRAITS.map(trait => [trait.id, 0]),
    );

    expect(parseAppUrlState('?trait=democracy')).toMatchObject({
      mode: 'trait',
      traitIdx: traitIndex('democracy'),
      poleIdx: 0,
      viewIdx: 0,
    });
  });

  it('keeps the existing trait/pole/view URL contract as the default mode', () => {
    expect(parseAppUrlState('?trait=democracy&pole=1&view=2')).toEqual({
      mode: 'trait',
      traitIdx: traitIndex('democracy'),
      poleIdx: 1,
      viewIdx: 2,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    });

    const state: AppUrlState = {
      mode: 'trait',
      traitIdx: traitIndex('democracy'),
      poleIdx: 1,
      viewIdx: 2,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    };

    expect(serializeAppUrlState(state).toString()).toBe('trait=democracy&pole=1&view=2');
  });

  it('parses supported modes while preserving default trait selection fallbacks', () => {
    expect(parseAppUrlState('?mode=type&trait=carefree')).toEqual({
      mode: 'type',
      traitIdx: traitIndex('carefree'),
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    });

    expect(parseAppUrlState('?mode=tetrachotomy&trait=carefree')).toMatchObject({
      mode: 'tetrachotomy',
      traitIdx: traitIndex('carefree'),
      partition: defaultTetrachotomyPartition,
    });

    expect(parseAppUrlState('?mode=octochotomy&trait=carefree')).toMatchObject({
      mode: 'octochotomy',
      traitIdx: traitIndex('carefree'),
      partition: defaultOctochotomyPartition,
    });
  });

  it('parses and serializes selected type IDs without trait state in type URLs', () => {
    expect(parseAppUrlState('?mode=type&type=LSI&trait=democracy')).toEqual({
      mode: 'type',
      traitIdx: traitIndex('democracy'),
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'LSI',
      partition: defaultDichotomyPartition,
    });

    expect(serializeAppUrlState({
      mode: 'type',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'LSI',
      partition: defaultDichotomyPartition,
    }).toString()).toBe('mode=type&type=LSI');
  });

  it('parses and serializes partition explorer state for tetrachotomies', () => {
    expect(parseAppUrlState(
      '?mode=tetrachotomy&traits=carefree,yielding&class=carefree:0|yielding:1',
    )).toMatchObject({
      mode: 'tetrachotomy',
      partition: {
        kind: 'tetrachotomy',
        traitIds: ['carefree', 'yielding'],
        selectedClassKey: 'carefree:0|yielding:1',
      },
    });

    expect(serializeAppUrlState({
      mode: 'tetrachotomy',
      traitIdx: 0,
      poleIdx: 1,
      viewIdx: 1,
      typeId: 'ILE',
      partition: {
        kind: 'tetrachotomy',
        traitIds: ['carefree', 'yielding'],
        selectedClassKey: 'carefree:0|yielding:1',
      },
    }).toString()).toBe(
      'mode=tetrachotomy&traits=carefree%2Cyielding&class=carefree%3A0%7Cyielding%3A1',
    );
  });

  it('defaults partition class selection to the class containing ILE', () => {
    expect(parseAppUrlState('?mode=octochotomy&traits=carefree,yielding,intuition')).toMatchObject({
      mode: 'octochotomy',
      partition: {
        kind: 'octochotomy',
        traitIds: ['carefree', 'yielding', 'intuition'],
        selectedClassKey: 'carefree:0|yielding:0|intuition:0',
      },
    });

    expect(parseAppUrlState(
      '?mode=tetrachotomy&traits=carefree,yielding&class=carefree:1|yielding:9',
    )).toMatchObject({
      partition: {
        selectedClassKey: 'carefree:0|yielding:0',
      },
    });
  });

  it('keeps known unique dependent triples in partition URLs for diagnostics', () => {
    expect(parseAppUrlState('?mode=octochotomy&traits=vertness,nalness,talness')).toMatchObject({
      mode: 'octochotomy',
      partition: {
        kind: 'octochotomy',
        traitIds: ['vertness', 'nalness', 'talness'],
        selectedClassKey: '',
      },
    });
  });

  it('falls back to default partition traits for structurally invalid partition URLs', () => {
    expect(parseAppUrlState('?mode=tetrachotomy&traits=vertness,missing')).toMatchObject({
      mode: 'tetrachotomy',
      partition: defaultTetrachotomyPartition,
    });

    expect(parseAppUrlState('?mode=octochotomy&traits=vertness,nalness')).toMatchObject({
      mode: 'octochotomy',
      partition: defaultOctochotomyPartition,
    });

    expect(parseAppUrlState('?mode=octochotomy&traits=vertness,nalness,vertness')).toMatchObject({
      mode: 'octochotomy',
      partition: defaultOctochotomyPartition,
    });
  });

  it('falls back predictably for invalid URL values', () => {
    expect(parseAppUrlState('?mode=unknown&trait=missing&type=UNKNOWN&pole=99&view=-2')).toEqual({
      mode: 'trait',
      traitIdx: 0,
      poleIdx: 1,
      viewIdx: 0,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    });
  });

  it('serializes non-default modes without adding mode to default trait URLs', () => {
    expect(serializeAppUrlState({
      mode: 'type',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    }).toString()).toBe('mode=type&type=ILE');

    expect(serializeAppUrlState({
      mode: 'tetrachotomy',
      traitIdx: 0,
      poleIdx: 1,
      viewIdx: 1,
      typeId: 'ILE',
      partition: defaultTetrachotomyPartition,
    }).toString()).toBe(
      'mode=tetrachotomy&traits=vertness%2Cnalness&class=vertness%3A0%7Cnalness%3A0',
    );

    expect(serializeAppUrlState({
      mode: 'trait',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    }).toString()).toBe('trait=vertness');
  });
});
