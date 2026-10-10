import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getDefaultTraitPoleIndex,
  parseAppUrlState,
  readInitialAppState,
  serializeAppUrlState,
  type AppUrlState,
  type TypeArpState,
} from './appState';
import { REININ_TRAITS, SOCIONIC_TYPE_ORDER, TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from './data/socionics';

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
  afterEach(() => vi.unstubAllGlobals());

  it('opens the requested logic ARP but resets its unavailable second view', () => {
    const state = parseAppUrlState('?mode=type&type=ILE&arp=logic&arpView=1');
    expect(state.typeArp).toEqual({ isOpen: true, traitId: 'logic', viewIndex: 0 });
    expect(serializeAppUrlState(state).toString()).toBe('mode=type&type=ILE&arp=logic');
  });

  it('omits closed analysis from URLs without losing its in-memory settings', () => {
    const typeArp: TypeArpState = { isOpen: false, traitId: 'democracy', viewIndex: 2 };
    const state: AppUrlState = { ...parseAppUrlState('?mode=type&type=LSI'), typeArp };
    const params = serializeAppUrlState(state);
    expect(params.toString()).toBe('mode=type&type=LSI');
    expect(parseAppUrlState(params)).toEqual(parseAppUrlState('?mode=type&type=LSI'));
    expect(state.typeArp).toEqual(typeArp);
    expect(parseAppUrlState(params)).not.toHaveProperty('typeArp');
  });

  it.each(['', 'missing', 'Logic', ' logic '])('omits an unknown or empty arp ID: %j', arp => {
    const params = new URLSearchParams({ mode: 'type', type: 'ILE', arp, arpView: '1' });
    const state = parseAppUrlState(params);
    expect(state).not.toHaveProperty('typeArp');
    expect(serializeAppUrlState(state).toString()).toBe('mode=type&type=ILE');
  });

  it('defensively omits unknown ARP IDs during serialization', () => {
    const state = parseAppUrlState('?mode=type');
    state.typeArp = { isOpen: true, traitId: 'missing' as TypeArpState['traitId'], viewIndex: 1 };
    expect(serializeAppUrlState(state).toString()).toBe('mode=type&type=ILE');
  });

  it.each([
    '', '-1', '-0', '1.5', '1.0', 'NaN', 'Infinity', '-Infinity', '1foo', '1e0',
    '0x1', '+1', ' 1 ', '1\n', '1\r', '1/2', '99999', '9007199254740993', '9'.repeat(400),
  ])('resets malformed or unavailable arpView %j to the first view', arpView => {
    const params = new URLSearchParams({ mode: 'type', type: 'ILE', arp: 'democracy', arpView });
    const state = parseAppUrlState(params);
    expect(state.typeArp).toEqual({ isOpen: true, traitId: 'democracy', viewIndex: 0 });
    expect(serializeAppUrlState(state).has('arpView')).toBe(false);
  });

  it.each([NaN, Infinity, -Infinity, -1, 1.5, 99999, Number.MAX_SAFE_INTEGER + 1])(
    'normalizes invalid in-memory indices during serialization: %s', viewIndex => {
      const state = parseAppUrlState('?mode=type&arp=democracy');
      state.typeArp = { isOpen: true, traitId: 'democracy', viewIndex };
      expect(serializeAppUrlState(state).toString()).toBe('mode=type&type=ILE&arp=democracy');
    },
  );

  it.each([null, '0', '00'])('omits the first view parameter: %j', arpView => {
    const params = new URLSearchParams({ mode: 'type', arp: 'democracy' });
    if (arpView !== null) params.set('arpView', arpView);
    const state = parseAppUrlState(params);
    expect(state.typeArp?.viewIndex).toBe(0);
    expect(serializeAppUrlState(state).has('arpView')).toBe(false);
  });

  it('normalizes all registered type/trait views using type membership, not manual pole', () => {
    for (const typeId of SOCIONIC_TYPE_ORDER) {
      for (const trait of REININ_TRAITS) {
        const pole = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[trait.id].poles
          .find(candidate => candidate.typeIds.includes(typeId))!;
        const views = trait.poles[pole.poleIndex].views;
        for (let viewIndex = 0; viewIndex <= views.length; viewIndex += 1) {
          const params = new URLSearchParams({
            mode: 'type', type: typeId, arp: trait.id, arpView: String(viewIndex),
            trait: 'vertness', pole: String(1 - pole.poleIndex), view: '99',
          });
          const state = parseAppUrlState(params);
          expect(state.typeArp).toEqual({
            isOpen: true, traitId: trait.id, viewIndex: viewIndex < views.length ? viewIndex : 0,
          });
          const serialized = serializeAppUrlState(state);
          expect(serialized.has('pole')).toBe(false);
          expect(serialized.has('trait')).toBe(false);
          expect(serialized.has('view')).toBe(false);
          expect(parseAppUrlState(serialized).typeArp).toEqual(state.typeArp);
        }
      }
    }
  });

  it('recalculates available views when a state is serialized with a different type', () => {
    const state = parseAppUrlState('?mode=type&type=ILE&arp=democracy&arpView=2');
    state.typeId = 'LSI';
    const params = serializeAppUrlState(state);
    expect(params.get('type')).toBe('LSI');
    expect(params.get('arp')).toBe('democracy');
    expect(parseAppUrlState(params).typeArp).toEqual(state.typeArp);
    expect(params.has('pole')).toBe(false);
  });

  it('applies the existing unknown-type fallback before normalizing ARP views', () => {
    expect(parseAppUrlState('?mode=type&type=UNKNOWN&arp=democracy&arpView=1')).toMatchObject({
      typeId: 'ILE', typeArp: { isOpen: true, traitId: 'democracy', viewIndex: 1 },
    });
  });

  it.each(['trait', 'tetrachotomy', 'octochotomy', 'unknown'])('ignores ARP parameters outside type mode: %s', mode => {
    const legacy = parseAppUrlState(`?mode=${mode}&trait=democracy&pole=1&view=2&theme=dark`);
    expect(parseAppUrlState(`?mode=${mode}&trait=democracy&pole=1&view=2&theme=dark&arp=logic&arpView=1`))
      .toEqual(legacy);
    expect(serializeAppUrlState({
      ...legacy, typeArp: { isOpen: true, traitId: 'logic', viewIndex: 0 },
    }).toString()).toBe(serializeAppUrlState(legacy).toString());
  });

  it('preserves theme and open ARP when URL state is reused for navigation links', () => {
    const state = parseAppUrlState('?mode=type&type=LSI&arp=democracy&arpView=2&theme=dark');
    const params = serializeAppUrlState({ ...state });
    params.set('page', 'reference');
    expect(parseAppUrlState(params)).toEqual(state);
    expect(params.get('theme')).toBe('dark');
  });

  it('serializes a transition to the general ARP without leaking type analysis parameters', () => {
    const state = parseAppUrlState('?mode=type&type=LSI&arp=democracy&arpView=2&theme=dark');
    const params = serializeAppUrlState({
      ...state, mode: 'trait', traitIdx: traitIndex('democracy'), poleIdx: 1, viewIdx: 2,
    });
    expect(params.toString()).toBe('theme=dark&trait=democracy&pole=1&view=2');
    expect(parseAppUrlState(params)).not.toHaveProperty('typeArp');
  });

  it('keeps SSR defaults and legacy type URLs closed', () => {
    vi.stubGlobal('window', undefined);
    expect(readInitialAppState()).toEqual(parseAppUrlState(''));
    expect(readInitialAppState()).not.toHaveProperty('typeArp');
    expect(parseAppUrlState('?mode=type&type=ILE&arpView=1')).not.toHaveProperty('typeArp');
  });

  it('reads open ARP from the browser URL with stored theme and explicit theme precedence', () => {
    vi.stubGlobal('window', {
      location: { search: '?mode=type&type=ILE&arp=democracy&arpView=1' },
      localStorage: { getItem: () => 'dark' },
    });
    expect(readInitialAppState()).toMatchObject({
      theme: 'dark', typeArp: { isOpen: true, traitId: 'democracy', viewIndex: 1 },
    });
    expect(parseAppUrlState('?mode=type&arp=logic&theme=light').theme).toBe('light');
  });

  it('keeps type ARP parsing safe when browser theme storage is unavailable', () => {
    vi.stubGlobal('window', { localStorage: { getItem: () => { throw new Error('blocked'); } } });
    expect(parseAppUrlState('?mode=type&arp=logic')).toMatchObject({
      theme: 'light', typeArp: { isOpen: true, traitId: 'logic', viewIndex: 0 },
    });
  });

  it('round-trips an open type ARP independently from general trait state', () => {
    const state = parseAppUrlState('?mode=type&type=ILE&arp=democracy&arpView=1');

    expect(state).toMatchObject({
      mode: 'type',
      typeId: 'ILE',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeArp: { isOpen: true, traitId: 'democracy', viewIndex: 1 },
    });
    expect(serializeAppUrlState(state).toString()).toBe('mode=type&type=ILE&arp=democracy&arpView=1');
    expect(parseAppUrlState(serializeAppUrlState(state))).toEqual(state);
  });

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
      theme: 'light',
      traitIdx: traitIndex('democracy'),
      poleIdx: 1,
      viewIdx: 2,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    });

    const state: AppUrlState = {
      mode: 'trait',
      theme: 'light',
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
      theme: 'light',
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
      theme: 'light',
      traitIdx: traitIndex('democracy'),
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'LSI',
      partition: defaultDichotomyPartition,
    });

    expect(serializeAppUrlState({
      mode: 'type',
      theme: 'light',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'LSI',
      partition: defaultDichotomyPartition,
    }).toString()).toBe('mode=type&type=LSI');
  });

  it('parses and serializes non-default theme URLs', () => {
    expect(parseAppUrlState('?theme=dark')).toMatchObject({
      mode: 'trait',
      theme: 'dark',
    });

    expect(parseAppUrlState('?theme=unknown')).toMatchObject({
      theme: 'light',
    });

    expect(serializeAppUrlState({
      mode: 'trait',
      theme: 'dark',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    }).toString()).toBe('theme=dark&trait=vertness');
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
      theme: 'light',
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
      theme: 'light',
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
      theme: 'light',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    }).toString()).toBe('mode=type&type=ILE');

    expect(serializeAppUrlState({
      mode: 'tetrachotomy',
      theme: 'light',
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
      theme: 'light',
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: 'ILE',
      partition: defaultDichotomyPartition,
    }).toString()).toBe('trait=vertness');
  });
});
