import {
  ASPECTS,
  FUNCTIONS,
  MODEL_A_LAYOUT,
  REININ_TRAITS,
  type AspectId,
  type ReininTrait,
  type ReininTraitId,
  type View,
} from './socionics';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID, type PoleIndex } from './memberships';
import {
  buildPartition,
  type PartitionKind,
  type PartitionBuildResult,
  type PartitionDiagnostic,
  type PartitionResult,
} from './partitions';
import {
  SOCIONIC_TYPES_BY_ID,
  SOCIONIC_TYPE_ORDER,
  type LocalizedText,
  type SocionicTypeId,
} from './types';
import {
  TETRACHOTOMY_FORMULAS,
  type TetrachotomyFormulaRecord,
  type TetrachotomySourceFormulaRow,
} from './tetrachotomies';

export type Locale = 'ru' | 'en';

export interface TypeSummaryViewModel {
  id: SocionicTypeId;
  name: string;
  quadraId: string;
  aliases: readonly string[];
}

export interface TraitSummaryViewModel {
  id: ReininTraitId;
  name: string;
}

export interface TypeModelAssignmentViewModel {
  functionId: number;
  functionName: string;
  aspectId: AspectId;
  aspectName: string;
  aspectFullName: string;
}

export interface TypeModelViewModel {
  type: TypeSummaryViewModel;
  assignments: readonly TypeModelAssignmentViewModel[];
}

export interface TypeModelPreviewAssignmentViewModel extends TypeModelAssignmentViewModel {
  isHighlighted: boolean;
  highlightGroupIndex: number | null;
  highlightIntensity?: 'primary' | 'secondary';
}

export interface TypeModelPreviewViewModel {
  type: TypeSummaryViewModel;
  assignments: readonly TypeModelPreviewAssignmentViewModel[];
}

export interface TypeTraitExampleViewModel {
  type: TypeSummaryViewModel;
  trait: TraitSummaryViewModel;
  pole: {
    poleIndex: PoleIndex;
    name: string;
    description: string;
  };
}

export interface PartitionClassViewModel {
  key: string;
  poles: readonly {
    trait: TraitSummaryViewModel;
    poleIndex: PoleIndex;
    poleName: string;
  }[];
  types: readonly TypeSummaryViewModel[];
}

export interface PartitionPatternCellViewModel {
  type: TypeSummaryViewModel;
  classKey: string;
  classLabel: string;
  poleNames: readonly string[];
}

export interface PartitionViewModel {
  ok: true;
  traitIds: readonly ReininTraitId[];
  rank: number;
  kind: PartitionResult['kind'];
  traits: readonly TraitSummaryViewModel[];
  classes: readonly PartitionClassViewModel[];
  patternCells: readonly PartitionPatternCellViewModel[];
}

export interface PartitionDiagnosticViewModel {
  ok: false;
  traitIds: readonly ReininTraitId[];
  rank: number;
  reason: PartitionDiagnostic['reason'];
  message: string;
  traits: readonly TraitSummaryViewModel[];
}

export interface PartitionExplorerViewModel {
  kind: PartitionKind;
  partition: PartitionViewModel | PartitionDiagnosticViewModel;
  selectedClassKey: string | null;
  selectedClass: PartitionClassViewModel | null;
  sourceFormula?: PartitionCatalogEntryViewModel['sourceFormula'];
}

export interface PartitionTypesPanelViewModel {
  kind: PartitionKind;
  classKey: string | null;
  title: string;
  traits: readonly TraitSummaryViewModel[];
  poles: PartitionClassViewModel['poles'];
  types: readonly TypeSummaryViewModel[];
}

export interface PartitionCatalogEntryViewModel {
  key: string;
  traitIds: readonly ReininTraitId[];
  title: string;
  traits: readonly TraitSummaryViewModel[];
  classCount: number;
  classSize: number;
  partition: PartitionViewModel;
  sourceFormula?: {
    id: string;
    formulaText: string;
    targetTrait: TraitSummaryViewModel;
    basisTraits: readonly [TraitSummaryViewModel, TraitSummaryViewModel];
    relationText?: string;
    status: TetrachotomyFormulaRecord['status'];
    sourceTableNumber: number;
    groups: readonly {
      sourceColor?: string;
      typeIds: readonly SocionicTypeId[];
    }[];
    sourceBlocks?: readonly {
      typeIds: readonly SocionicTypeId[];
      labels: readonly string[];
      status: 'extracted';
      rows: readonly {
        aspectIds: readonly AspectId[];
        aspectText: string;
        aspectFeaturesText: string;
        functionBlockLabel: string;
        functionIds: readonly number[];
        functionFeaturesText: string;
      }[];
    }[];
  };
}

export interface PartitionCatalogViewModel {
  kind: Extract<PartitionKind, 'tetrachotomy' | 'octochotomy'>;
  entries: readonly PartitionCatalogEntryViewModel[];
}

const getLocalizedText = (text: LocalizedText, locale: Locale): string => (
  text[locale] ?? text.ru
);

const getTraitById = (traitId: ReininTraitId): ReininTrait => {
  const trait = REININ_TRAITS.find(candidate => candidate.id === traitId);
  if (!trait) {
    throw new Error(`Unknown Reinin trait ${traitId}`);
  }

  return trait;
};

const selectTypeSummary = (
  typeId: SocionicTypeId,
  locale: Locale,
): TypeSummaryViewModel => {
  const type = SOCIONIC_TYPES_BY_ID[typeId];

  return {
    id: type.id,
    name: getLocalizedText(type.names, locale),
    quadraId: type.quadraId,
    aliases: [
      ...(type.aliases.socionics ?? []),
      ...(type.aliases.mbtiLike ?? []),
    ],
  };
};

const selectTraitSummary = (traitId: ReininTraitId): TraitSummaryViewModel => {
  const trait = getTraitById(traitId);

  return {
    id: trait.id,
    name: trait.name,
  };
};

const findMembershipPoleIndex = (
  traitId: ReininTraitId,
  typeId: SocionicTypeId,
): PoleIndex => {
  const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[traitId];
  const pole = membership.poles.find(candidate => candidate.typeIds.includes(typeId));

  if (!pole) {
    throw new Error(`Missing type ${typeId} in ${traitId} membership`);
  }

  return pole.poleIndex;
};

const selectPartition = (
  partition: PartitionBuildResult,
  locale: Locale,
): PartitionViewModel | PartitionDiagnosticViewModel => {
  const traits = partition.traitIds.map(selectTraitSummary);

  if (!partition.ok) {
    return {
      ok: false,
      traitIds: partition.traitIds,
      rank: partition.rank,
      reason: partition.reason,
      message: partition.message,
      traits,
    };
  }

  const classes = partition.classes.map(partitionClass => ({
    key: partitionClass.key,
    poles: partitionClass.poles.map(pole => {
      const trait = getTraitById(pole.traitId);

      return {
        trait: selectTraitSummary(pole.traitId),
        poleIndex: pole.poleIndex,
        poleName: trait.poles[pole.poleIndex].name,
      };
    }),
    types: partitionClass.typeIds.map(typeId => selectTypeSummary(typeId, locale)),
  }));
  const patternCells = SOCIONIC_TYPE_ORDER.map(typeId => {
    const partitionClass = classes.find(candidate => (
      candidate.types.some(type => type.id === typeId)
    ));

    if (!partitionClass) {
      throw new Error(`Missing partition class for type ${typeId}`);
    }

    const poleNames = partitionClass.poles.map(pole => pole.poleName);

    return {
      type: selectTypeSummary(typeId, locale),
      classKey: partitionClass.key,
      classLabel: poleNames.join(' + '),
      poleNames,
    };
  });

  return {
    ok: true,
    traitIds: partition.traitIds,
    rank: partition.rank,
    kind: partition.kind,
    traits,
    classes,
    patternCells,
  };
};

const selectDefaultPartitionClass = (
  partition: PartitionViewModel,
): PartitionClassViewModel | null => (
  partition.classes.find(partitionClass => (
    partitionClass.types.some(type => type.id === 'ILE')
  )) ?? partition.classes[0] ?? null
);

const buildTraitCombinations = (
  traitIds: readonly ReininTraitId[],
  size: number,
): readonly (readonly ReininTraitId[])[] => {
  const combinations: ReininTraitId[][] = [];

  const visit = (startIndex: number, selected: ReininTraitId[]): void => {
    if (selected.length === size) {
      combinations.push([...selected]);
      return;
    }

    const remainingSlots = size - selected.length;
    const lastStartIndex = traitIds.length - remainingSlots;

    for (let index = startIndex; index <= lastStartIndex; index += 1) {
      selected.push(traitIds[index]);
      visit(index + 1, selected);
      selected.pop();
    }
  };

  visit(0, []);

  return combinations;
};

const getCatalogTraitCount = (
  kind: PartitionCatalogViewModel['kind'],
): number => (
  kind === 'tetrachotomy' ? 2 : 3
);

const selectPartitionCatalog = (
  kind: PartitionCatalogViewModel['kind'],
  locale: Locale,
): PartitionCatalogViewModel => {
  const traitCount = getCatalogTraitCount(kind);
  const entries = buildTraitCombinations(
    REININ_TRAITS.map(trait => trait.id),
    traitCount,
  ).flatMap(traitIds => {
    const partition = selectPartition(buildPartition(traitIds), locale);

    if (!partition.ok) {
      return [];
    }

    return [{
      key: traitIds.join('+'),
      traitIds,
      title: partition.traits.map(trait => trait.name).join(' + '),
      traits: partition.traits,
      classCount: partition.classes.length,
      classSize: partition.classes[0]?.types.length ?? 0,
      partition,
    }];
  });

  return {
    kind,
    entries,
  };
};

const selectTetrachotomySourceCatalog = (
  locale: Locale,
): PartitionCatalogViewModel => {
  const entries = TETRACHOTOMY_FORMULAS.map(formula => {
    const partition = selectPartition(buildPartition(formula.basisTraitIds), locale);

    if (!partition.ok || partition.kind !== 'tetrachotomy') {
      throw new Error(`Tetrachotomy formula ${formula.id} does not compute a tetrachotomy`);
    }

    return {
      key: formula.id,
      traitIds: formula.basisTraitIds,
      title: formula.source.formulaText,
      traits: partition.traits,
      classCount: partition.classes.length,
      classSize: partition.classes[0]?.types.length ?? 0,
      partition,
      sourceFormula: {
        id: formula.id,
        formulaText: formula.source.formulaText,
        targetTrait: selectTraitSummary(formula.targetTraitId),
        basisTraits: [
          selectTraitSummary(formula.basisTraitIds[0]),
          selectTraitSummary(formula.basisTraitIds[1]),
        ] as const,
        relationText: formula.source.relationText,
        status: formula.status,
        sourceTableNumber: formula.source.tableNumber,
        groups: formula.groups.map(group => ({
          sourceColor: group.sourceColor,
          typeIds: group.typeIds,
        })),
        sourceBlocks: formula.sourceBlocks?.map(block => ({
          typeIds: block.typeIds,
          labels: block.labels,
          status: block.status,
          rows: block.rows.map(row => ({
            aspectIds: row.aspectIds,
            aspectText: row.aspectText,
            aspectFeaturesText: row.aspectFeaturesText,
            functionBlockLabel: row.functionBlockLabel,
            functionIds: row.functionIds,
            functionFeaturesText: row.functionFeaturesText,
          })),
        })),
      },
    };
  });

  return {
    kind: 'tetrachotomy',
    entries,
  };
};

const findTetrachotomySourceFormula = (
  traitIds: readonly ReininTraitId[],
  locale: Locale,
): PartitionCatalogEntryViewModel['sourceFormula'] | undefined => {
  if (traitIds.length !== 2) {
    return undefined;
  }

  return selectTetrachotomySourceCatalog(locale).entries.find(entry => (
    hasSameTraits(entry.traitIds, traitIds)
  ))?.sourceFormula;
};

const hasSameTraits = (
  left: readonly ReininTraitId[],
  right: readonly ReininTraitId[],
): boolean => (
  left.length === right.length
  && left.every(traitId => right.includes(traitId))
);

export function selectTypeModelView(
  typeId: SocionicTypeId,
  locale: Locale = 'ru',
): TypeModelViewModel {
  const type = SOCIONIC_TYPES_BY_ID[typeId];

  const assignments = MODEL_A_LAYOUT.map(functionId => {
    const assignment = type.modelA.find(candidate => candidate.functionId === functionId);
    const socionicFunction = FUNCTIONS.find(candidate => candidate.id === functionId);

    if (!assignment || !socionicFunction) {
      throw new Error(`Missing Model A assignment for ${typeId} function ${functionId}`);
    }

    const aspect = ASPECTS.find(candidate => candidate.id === assignment.aspectId);
    if (!aspect) {
      throw new Error(`Unknown aspect ${assignment.aspectId}`);
    }

    return {
      functionId,
      functionName: socionicFunction.name,
      aspectId: aspect.id,
      aspectName: aspect.name,
      aspectFullName: aspect.fullName,
    };
  });

  return {
    type: selectTypeSummary(typeId, locale),
    assignments,
  };
}

const getAssignmentViewGroupIndex = (
  assignment: TypeModelAssignmentViewModel,
  view: View,
): number | null => {
  const index = view.mappings.findIndex(mapping => (
    mapping.aspects.includes(assignment.aspectId)
    && (
      view.isBlockPermutation === true
      || mapping.functions.includes(assignment.functionId)
    )
  ));

  return index >= 0 ? index : null;
};

export function selectTypeModelPreviews(
  typeIds: readonly SocionicTypeId[],
  view: View,
  locale: Locale = 'ru',
): readonly TypeModelPreviewViewModel[] {
  return typeIds.map(typeId => {
    const model = selectTypeModelView(typeId, locale);

    return {
      type: model.type,
      assignments: model.assignments.map(assignment => {
        const highlightGroupIndex = getAssignmentViewGroupIndex(assignment, view);

        return {
          ...assignment,
          isHighlighted: highlightGroupIndex !== null,
          highlightGroupIndex,
        };
      }),
    };
  });
}

export function selectTypeModelPreviewsForSourceRows(
  typeIds: readonly SocionicTypeId[],
  rows: readonly TetrachotomySourceFormulaRow[],
  locale: Locale = 'ru',
): readonly TypeModelPreviewViewModel[] {
  return typeIds.map(typeId => {
    const model = selectTypeModelView(typeId, locale);

    return {
      type: model.type,
      assignments: model.assignments.map(assignment => {
        const highlightGroupIndex = rows.findIndex(row => (
          row.functionIds.includes(assignment.functionId)
        ));
        const sourceRow = highlightGroupIndex >= 0 ? rows[highlightGroupIndex] : null;
        const isSourceAspect = sourceRow?.aspectIds.includes(assignment.aspectId) === true;

        return {
          ...assignment,
          isHighlighted: highlightGroupIndex !== -1,
          highlightGroupIndex: highlightGroupIndex !== -1 ? highlightGroupIndex : null,
          highlightIntensity: highlightGroupIndex === -1
            ? undefined
            : isSourceAspect ? 'primary' : 'secondary',
        };
      }),
    };
  });
}

export function selectTypeTraitExample(
  typeId: SocionicTypeId,
  traitId: ReininTraitId,
  locale: Locale = 'ru',
): TypeTraitExampleViewModel {
  const trait = getTraitById(traitId);
  const poleIndex = findMembershipPoleIndex(traitId, typeId);

  return {
    type: selectTypeSummary(typeId, locale),
    trait: selectTraitSummary(traitId),
    pole: {
      poleIndex,
      name: trait.poles[poleIndex].name,
      description: trait.poles[poleIndex].description,
    },
  };
}

export function selectTetrachotomyView(
  traitIds: readonly [ReininTraitId, ReininTraitId],
  locale: Locale = 'ru',
): PartitionViewModel | PartitionDiagnosticViewModel {
  return selectPartition(buildPartition(traitIds), locale);
}

export function selectOctochotomyView(
  traitIds: readonly [ReininTraitId, ReininTraitId, ReininTraitId],
  locale: Locale = 'ru',
): PartitionViewModel | PartitionDiagnosticViewModel {
  return selectPartition(buildPartition(traitIds), locale);
}

export function selectTetrachotomyCatalog(
  locale: Locale = 'ru',
): PartitionCatalogViewModel {
  return selectTetrachotomySourceCatalog(locale);
}

export function selectStructuralTetrachotomyCatalog(
  locale: Locale = 'ru',
): PartitionCatalogViewModel {
  return selectPartitionCatalog('tetrachotomy', locale);
}

export function selectOctochotomyCatalog(
  locale: Locale = 'ru',
): PartitionCatalogViewModel {
  return selectPartitionCatalog('octochotomy', locale);
}

export function selectDichotomyDistributionView(
  traitId: ReininTraitId,
  selectedPoleIndex: PoleIndex,
  locale: Locale = 'ru',
): PartitionExplorerViewModel {
  const partition = buildPartition([traitId]);
  const selectedClassKey = partition.ok
    ? partition.classes.find(partitionClass => (
      partitionClass.poles[0]?.poleIndex === selectedPoleIndex
    ))?.key ?? null
    : null;

  return selectPartitionExplorerView([traitId], selectedClassKey, locale);
}

export function selectPartitionTypesPanelView(
  traitIds: readonly ReininTraitId[],
  selectedClassKey: string | null = null,
  locale: Locale = 'ru',
): PartitionTypesPanelViewModel {
  const view = selectPartitionExplorerView(traitIds, selectedClassKey, locale);
  const selectedClass = view.selectedClass;

  return {
    kind: view.kind,
    classKey: selectedClass?.key ?? null,
    title: selectedClass
      ? selectedClass.poles.map(pole => pole.poleName).join(' + ')
      : view.partition.traits.map(trait => trait.name).join(' + '),
    traits: view.partition.traits,
    poles: selectedClass?.poles ?? [],
    types: selectedClass?.types ?? [],
  };
}

export function selectDichotomyTypesPanelView(
  traitId: ReininTraitId,
  selectedPoleIndex: PoleIndex,
  locale: Locale = 'ru',
): PartitionTypesPanelViewModel {
  const distributionView = selectDichotomyDistributionView(traitId, selectedPoleIndex, locale);

  return selectPartitionTypesPanelView([traitId], distributionView.selectedClassKey, locale);
}

export function selectPartitionExplorerView(
  traitIds: readonly ReininTraitId[],
  selectedClassKey: string | null = null,
  locale: Locale = 'ru',
): PartitionExplorerViewModel {
  const partition = selectPartition(buildPartition(traitIds), locale);

  if (!partition.ok) {
    return {
      kind: traitIds.length === 2 ? 'tetrachotomy' : traitIds.length === 3 ? 'octochotomy' : 'dichotomy',
      partition,
      selectedClassKey: null,
      selectedClass: null,
      sourceFormula: traitIds.length === 2
        ? findTetrachotomySourceFormula(traitIds, locale)
        : undefined,
    };
  }

  const selectedClass = partition.classes.find(partitionClass => (
    partitionClass.key === selectedClassKey
  )) ?? selectDefaultPartitionClass(partition);

  return {
    kind: partition.kind,
    partition,
    selectedClassKey: selectedClass?.key ?? null,
    selectedClass,
    sourceFormula: partition.kind === 'tetrachotomy'
      ? findTetrachotomySourceFormula(traitIds, locale)
      : undefined,
  };
}
