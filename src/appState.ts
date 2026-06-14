import {
  REININ_TRAITS,
  SOCIONIC_TYPE_ORDER,
  type ReininTraitId,
  type SocionicTypeId,
} from './data/socionics';

export type AppMode = 'trait' | 'type' | 'tetrachotomy' | 'octochotomy';

export interface AppUrlState {
  mode: AppMode;
  traitIdx: number;
  poleIdx: number;
  viewIdx: number;
  typeId: SocionicTypeId;
}

const DEFAULT_MODE: AppMode = 'trait';

const APP_MODES = new Set<AppMode>([
  'trait',
  'type',
  'tetrachotomy',
  'octochotomy',
]);

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

const parseIndex = (value: string | null): number => {
  const parsed = Number.parseInt(value ?? '0', 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseMode = (value: string | null): AppMode => {
  if (value && APP_MODES.has(value as AppMode)) {
    return value as AppMode;
  }

  return DEFAULT_MODE;
};

const parseTypeId = (value: string | null): SocionicTypeId => {
  if (value && SOCIONIC_TYPE_ORDER.includes(value as SocionicTypeId)) {
    return value as SocionicTypeId;
  }

  return SOCIONIC_TYPE_ORDER[0];
};

export const parseAppUrlState = (search: string | URLSearchParams): AppUrlState => {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const traitId = params.get('trait') as ReininTraitId | null;
  const traitIndex = traitId ? REININ_TRAITS.findIndex(trait => trait.id === traitId) : -1;
  const traitIdx = traitIndex >= 0 ? traitIndex : 0;
  const trait = REININ_TRAITS[traitIdx] ?? REININ_TRAITS[0];
  const poleIdx = clamp(parseIndex(params.get('pole')), 0, trait.poles.length - 1);
  const viewIdx = clamp(parseIndex(params.get('view')), 0, trait.poles[poleIdx].views.length - 1);

  return {
    mode: parseMode(params.get('mode')),
    traitIdx,
    poleIdx,
    viewIdx,
    typeId: parseTypeId(params.get('type')),
  };
};

export const serializeAppUrlState = (state: AppUrlState): URLSearchParams => {
  const trait = REININ_TRAITS[state.traitIdx] ?? REININ_TRAITS[0];
  const poleIdx = clamp(state.poleIdx, 0, trait.poles.length - 1);
  const viewIdx = clamp(state.viewIdx, 0, trait.poles[poleIdx].views.length - 1);
  const params = new URLSearchParams();

  if (state.mode !== DEFAULT_MODE) {
    params.set('mode', state.mode);
  }

  params.set('trait', trait.id);
  if (state.mode === 'type') {
    params.set('type', state.typeId);
  }
  if (poleIdx !== 0) params.set('pole', String(poleIdx));
  if (viewIdx !== 0) params.set('view', String(viewIdx));

  return params;
};

export const readInitialAppState = (): AppUrlState => {
  if (typeof window === 'undefined') {
    return {
      mode: DEFAULT_MODE,
      traitIdx: 0,
      poleIdx: 0,
      viewIdx: 0,
      typeId: SOCIONIC_TYPE_ORDER[0],
    };
  }

  return parseAppUrlState(window.location.search);
};
