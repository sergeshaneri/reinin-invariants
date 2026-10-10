import { describe, expect, it } from 'vitest';
import { getDefaultPartitionState, parseAppUrlState, serializeAppUrlState, type TypeArpState } from './appState';
import { REININ_TRAITS, SOCIONIC_TYPE_ORDER } from './data/socionics';
import { selectTypeArpExample } from './data/typeArp';
import { transitionTypeArp, openGeneralTypeArp, togglePinnedArpGroup, resolveActiveArpGroup } from './typeArpState';

const saved: TypeArpState = { isOpen: false, traitId: 'democracy', viewIndex: 1 };

describe('type ARP session transitions', () => {
  it('first opens the current general trait, then remembers its own setting across close/reopen', () => {
    const first = transitionTypeArp(undefined, 'ILE', { kind: 'open', fallbackTraitId: 'democracy' });
    expect(first).toEqual({ isOpen: true, traitId: 'democracy', viewIndex: 0 });
    const closed = transitionTypeArp({ ...saved, isOpen: true }, 'ILE', { kind: 'close' });
    expect(closed).toEqual(saved);
    expect(transitionTypeArp(closed, 'ILE', { kind: 'open', fallbackTraitId: 'vertness' }))
      .toEqual({ ...saved, isOpen: true });
  });

  it('changing trait resets the view without closing; changing view preserves the trait', () => {
    const changed = transitionTypeArp({ ...saved, isOpen: true }, 'ILE', { kind: 'trait', traitId: 'asking' });
    expect(changed).toEqual({ isOpen: true, traitId: 'asking', viewIndex: 0 });
    expect(transitionTypeArp(changed, 'ILE', { kind: 'view', viewIndex: 1 })).toEqual({ ...changed, viewIndex: 1 });
  });

  it('type changes preserve open/closed state and immediately normalize every registered context', () => {
    expect(transitionTypeArp(undefined, 'EII', { kind: 'type' })).toBeUndefined();
    for (const trait of REININ_TRAITS) {
      for (const typeId of SOCIONIC_TYPE_ORDER) {
        const example = selectTypeArpExample(typeId, trait.id);
        for (const isOpen of [true, false]) {
          for (const viewIndex of [0, example.views.length - 1, example.views.length, -1, NaN]) {
            const next = transitionTypeArp({ isOpen, traitId: trait.id, viewIndex }, typeId, { kind: 'type' });
            expect(next).toEqual({ isOpen, traitId: trait.id, viewIndex: selectTypeArpExample(typeId, trait.id, viewIndex).viewIndex });
          }
        }
      }
    }
  });

  it('serializes open and closed session transitions without leaking manual pole or general view', () => {
    const base = parseAppUrlState('?mode=type&type=ILE&theme=dark');
    const typeArp = transitionTypeArp(undefined, 'ILE', { kind: 'open', fallbackTraitId: 'logic' });
    const open = serializeAppUrlState({ ...base, poleIdx: 1, viewIdx: 2, typeArp });
    expect(open.get('arp')).toBe('logic');
    expect(open.has('pole')).toBe(false);
    expect(parseAppUrlState(open).typeArp).toEqual(typeArp);
    const closed = serializeAppUrlState({ ...base, typeArp: transitionTypeArp(typeArp, 'ILE', { kind: 'close' }) });
    expect(closed.has('arp')).toBe(false);
    expect(closed.has('arpView')).toBe(false);
  });

  it('opens the exact general trait/pole/view with theme and session memory preserved', () => {
    const state = {
      ...parseAppUrlState('?mode=type&type=EII&arp=democracy&arpView=1&theme=dark'),
      partition: getDefaultPartitionState('dichotomy'),
    };
    const next = openGeneralTypeArp(state);
    const target = selectTypeArpExample('EII', 'democracy', 1).generalView;
    expect(next.mode).toBe('trait');
    expect(REININ_TRAITS[next.traitIdx].id).toBe(target.traitId);
    expect(next.poleIdx).toBe(target.poleIndex);
    expect(next.viewIdx).toBe(target.viewIndex);
    expect(next.theme).toBe('dark');
    expect(next.typeArp).toEqual(state.typeArp);
    const url = serializeAppUrlState(next);
    expect(parseAppUrlState(url).viewIdx).toBe(target.viewIndex);
    expect(parseAppUrlState(url).poleIdx).toBe(target.poleIndex);
    expect(url.has('arp')).toBe(false);
    expect(openGeneralTypeArp({ ...state, typeArp: undefined })).toEqual({ ...state, typeArp: undefined });
  });
});

describe('type ARP group interaction', () => {
  it('hover/focus temporarily overrides pin; leaving restores pin; repeat click unpins', () => {
    const pin = togglePinnedArpGroup(null, 1);
    expect(resolveActiveArpGroup(0, pin)).toBe(0);
    expect(resolveActiveArpGroup(null, pin)).toBe(1);
    expect(togglePinnedArpGroup(pin, 1)).toBeNull();
    expect(togglePinnedArpGroup(pin, 0)).toBe(0);
    expect(resolveActiveArpGroup(null, null)).toBeNull();
  });
});
