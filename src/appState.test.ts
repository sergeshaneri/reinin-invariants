import { describe, expect, it } from 'vitest';
import {
  parseAppUrlState,
  serializeAppUrlState,
  type AppUrlState,
} from './appState';
import { REININ_TRAITS } from './data/socionics';

const traitIndex = (traitId: string) => REININ_TRAITS.findIndex(trait => trait.id === traitId);

describe('app URL state', () => {
  it('keeps the existing trait/pole/view URL contract as the default mode', () => {
    expect(parseAppUrlState('?trait=democracy&pole=1&view=2')).toEqual({
      mode: 'trait',
      traitIdx: traitIndex('democracy'),
      poleIdx: 1,
      viewIdx: 2,
      typeId: 'ILE',
    });

    const state: AppUrlState = {
      mode: 'trait',
      traitIdx: traitIndex('democracy'),
      poleIdx: 1,
      viewIdx: 2,
      typeId: 'ILE',
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
    });

    expect(parseAppUrlState('?mode=tetrachotomy&trait=carefree')).toMatchObject({
      mode: 'tetrachotomy',
      traitIdx: traitIndex('carefree'),
    });

    expect(parseAppUrlState('?mode=octochotomy&trait=carefree')).toMatchObject({
      mode: 'octochotomy',
      traitIdx: traitIndex('carefree'),
    });
  });

  it('parses and serializes selected type IDs', () => {
    expect(parseAppUrlState('?mode=type&type=LSI&trait=democracy')).toEqual({
      mode: 'type',
      traitIdx: traitIndex('democracy'),
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'LSI',
    });

    expect(serializeAppUrlState({
      mode: 'type',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'LSI',
    }).toString()).toBe('mode=type&trait=vertness&type=LSI');
  });

  it('falls back predictably for invalid URL values', () => {
    expect(parseAppUrlState('?mode=unknown&trait=missing&type=UNKNOWN&pole=99&view=-2')).toEqual({
      mode: 'trait',
      traitIdx: 0,
      poleIdx: 1,
      viewIdx: 0,
      typeId: 'ILE',
    });
  });

  it('serializes non-default modes without adding mode to default trait URLs', () => {
    expect(serializeAppUrlState({
      mode: 'type',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'ILE',
    }).toString()).toBe('mode=type&trait=vertness&type=ILE');

    expect(serializeAppUrlState({
      mode: 'trait',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'ILE',
    }).toString()).toBe('trait=vertness');
  });
});
