import {
  REININ_TRAITS,
  SOCIONIC_TYPE_ORDER,
  TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID,
  type PoleIndex,
  type ReininTraitId,
  type SocionicTypeId,
} from './data/socionics';
import { buildPartition, type PartitionKind } from './data/partitions';

export type AppMode = 'trait' | 'type' | 'tetrachotomy' | 'octochotomy';

export interface PartitionExplorerState {
  kind: PartitionKind;
  traitIds: readonly ReininTraitId[];
  selectedClassKey: string;
}

export interface AppUrlState {
  mode: AppMode;
  traitIdx: number;
  poleIdx: number;
  viewIdx: number;
  typeId: SocionicTypeId;
  partition: PartitionExplorerState;
}

const DEFAULT_MODE: AppMode = 'trait';

const APP_MODES = new Set<AppMode>([
  'trait',
  'type',
  'tetrachotomy',
  'octochotomy',
]);

const REININ_TRAIT_IDS = new Set<ReininTraitId>(
  REININ_TRAITS.map(trait => trait.id),
);

const DEFAULT_PARTITION_TRAITS: Record<PartitionKind, readonly ReininTraitId[]> = {
  dichotomy: ['vertness'],
  tetrachotomy: ['vertness', 'nalness'],
  octochotomy: ['vertness', 'nalness', 'carefree'],
};

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

const parseIndex = (value: string | null): number => {
  const parsed = Number.parseInt(value ?? '0', 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseOptionalIndex = (value: string | null): number | null => {
  if (value === null) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
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

export const getDefaultTraitPoleIndex = (traitId: ReininTraitId): PoleIndex => {
  const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[traitId];
  const ilePole = membership.poles.find(pole => pole.typeIds.includes('ILE'));

  return ilePole?.poleIndex ?? 0;
};

export const getPartitionKindForMode = (mode: AppMode): PartitionKind => {
  if (mode === 'tetrachotomy') return 'tetrachotomy';
  if (mode === 'octochotomy') return 'octochotomy';
  return 'dichotomy';
};

const getPartitionTraitCount = (kind: PartitionKind): number => {
  if (kind === 'dichotomy') return 1;
  if (kind === 'tetrachotomy') return 2;
  return 3;
};

const parsePartitionTraitIds = (
  value: string | null,
  kind: PartitionKind,
): readonly ReininTraitId[] => {
  if (!value) {
    return DEFAULT_PARTITION_TRAITS[kind];
  }

  const traitIds = value
    .split(',')
    .map(traitId => traitId.trim())
    .filter(Boolean) as ReininTraitId[];
  const hasOnlyKnownTraits = traitIds.every(traitId => REININ_TRAIT_IDS.has(traitId));
  const hasUniqueTraits = new Set(traitIds).size === traitIds.length;

  if (
    traitIds.length !== getPartitionTraitCount(kind)
    || !hasOnlyKnownTraits
    || !hasUniqueTraits
  ) {
    return DEFAULT_PARTITION_TRAITS[kind];
  }

  const partition = buildPartition(traitIds);

  return partition.ok && partition.kind === kind
    ? traitIds
    : DEFAULT_PARTITION_TRAITS[kind];
};

const getIlePartitionClassKey = (traitIds: readonly ReininTraitId[]): string => {
  const partition = buildPartition(traitIds);

  if (!partition.ok) {
    return '';
  }

  return partition.classes.find(partitionClass => partitionClass.typeIds.includes('ILE'))?.key
    ?? partition.classes[0]?.key
    ?? '';
};

export const getDefaultPartitionState = (kind: PartitionKind): PartitionExplorerState => {
  const traitIds = DEFAULT_PARTITION_TRAITS[kind];

  return {
    kind,
    traitIds,
    selectedClassKey: getIlePartitionClassKey(traitIds),
  };
};

const parseSelectedClassKey = (
  value: string | null,
  traitIds: readonly ReininTraitId[],
): string => {
  const partition = buildPartition(traitIds);

  if (!partition.ok) {
    return '';
  }

  if (value && partition.classes.some(partitionClass => partitionClass.key === value)) {
    return value;
  }

  return getIlePartitionClassKey(traitIds);
};

const parsePartitionState = (
  params: URLSearchParams,
  mode: AppMode,
): PartitionExplorerState => {
  const kind = getPartitionKindForMode(mode);
  const traitIds = parsePartitionTraitIds(params.get('traits'), kind);

  return {
    kind,
    traitIds,
    selectedClassKey: parseSelectedClassKey(params.get('class'), traitIds),
  };
};

export const parseAppUrlState = (search: string | URLSearchParams): AppUrlState => {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const mode = parseMode(params.get('mode'));
  const traitId = params.get('trait') as ReininTraitId | null;
  const traitIndex = traitId ? REININ_TRAITS.findIndex(trait => trait.id === traitId) : -1;
  const traitIdx = traitIndex >= 0 ? traitIndex : 0;
  const trait = REININ_TRAITS[traitIdx] ?? REININ_TRAITS[0];
  const defaultPoleIdx = getDefaultTraitPoleIndex(trait.id);
  const parsedPoleIdx = parseOptionalIndex(params.get('pole')) ?? defaultPoleIdx;
  const poleIdx = clamp(parsedPoleIdx, 0, trait.poles.length - 1);
  const viewIdx = clamp(parseIndex(params.get('view')), 0, trait.poles[poleIdx].views.length - 1);

  return {
    mode,
    traitIdx,
    poleIdx,
    viewIdx,
    typeId: parseTypeId(params.get('type')),
    partition: parsePartitionState(params, mode),
  };
};

export const serializeAppUrlState = (state: AppUrlState): URLSearchParams => {
  const trait = REININ_TRAITS[state.traitIdx] ?? REININ_TRAITS[0];
  const poleIdx = clamp(state.poleIdx, 0, trait.poles.length - 1);
  const viewIdx = clamp(state.viewIdx, 0, trait.poles[poleIdx].views.length - 1);
  const defaultPoleIdx = getDefaultTraitPoleIndex(trait.id);
  const params = new URLSearchParams();

  if (state.mode !== DEFAULT_MODE) {
    params.set('mode', state.mode);
  }

  if (state.mode === 'type') {
    params.set('type', state.typeId);
    return params;
  }

  if (state.mode !== 'trait') {
    const kind = getPartitionKindForMode(state.mode);
    const traitIds = state.partition.kind === kind
      ? state.partition.traitIds
      : DEFAULT_PARTITION_TRAITS[kind];
    const partition = buildPartition(traitIds);
    const selectedClassKey = partition.ok
      && partition.classes.some(partitionClass => partitionClass.key === state.partition.selectedClassKey)
      ? state.partition.selectedClassKey
      : getIlePartitionClassKey(traitIds);

    params.set('traits', traitIds.join(','));
    if (selectedClassKey) params.set('class', selectedClassKey);
    return params;
  }

  params.set('trait', trait.id);
  if (poleIdx !== defaultPoleIdx) params.set('pole', String(poleIdx));
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
      partition: getDefaultPartitionState('dichotomy'),
    };
  }

  return parseAppUrlState(window.location.search);
};
