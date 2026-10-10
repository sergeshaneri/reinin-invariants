import type { AppUrlState, TypeArpState } from './appState';
import { REININ_TRAITS, type ReininTraitId, type SocionicTypeId } from './data/socionics';
import { selectTypeArpExample } from './data/typeArp';

export type TypeArpAction =
  | { kind: 'open'; fallbackTraitId: ReininTraitId }
  | { kind: 'close' }
  | { kind: 'type' }
  | { kind: 'trait'; traitId: ReininTraitId }
  | { kind: 'view'; viewIndex: number };

/** Normalize in the event transaction, not an effect after a stale render/URL. */
export function transitionTypeArp(
  current: TypeArpState | undefined,
  typeId: SocionicTypeId,
  action: TypeArpAction,
): TypeArpState | undefined {
  let next = current;
  if (action.kind === 'open') {
    next = { ...(current ?? { traitId: action.fallbackTraitId, viewIndex: 0 }), isOpen: true };
  } else if (current) {
    if (action.kind === 'close') next = { ...current, isOpen: false };
    if (action.kind === 'trait') next = { ...current, traitId: action.traitId, viewIndex: 0 };
    if (action.kind === 'view') next = { ...current, viewIndex: action.viewIndex };
  }
  if (!next) return undefined;
  return { ...next, viewIndex: selectTypeArpExample(typeId, next.traitId, next.viewIndex).viewIndex };
}

export function openGeneralTypeArp(state: AppUrlState): AppUrlState {
  if (!state.typeArp) return state;
  const target = selectTypeArpExample(state.typeId, state.typeArp.traitId, state.typeArp.viewIndex).generalView;
  return {
    ...state,
    mode: target.mode,
    traitIdx: REININ_TRAITS.findIndex(trait => trait.id === target.traitId),
    poleIdx: target.poleIndex,
    viewIdx: target.viewIndex,
  };
}

export const togglePinnedArpGroup = (current: number | null, groupIndex: number): number | null => (
  current === groupIndex ? null : groupIndex
);

export const resolveActiveArpGroup = (hovered: number | null, pinned: number | null): number | null => (
  hovered ?? pinned
);
