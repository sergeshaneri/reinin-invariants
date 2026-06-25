import sourceExtract from '../../plans/roadmap/tetrachotomy-doc-extract.json';
import { buildPartition } from './partitions';
import type { AspectId, ReininTraitId } from './socionics';
import type { SocionicTypeId } from './types';

export type FormulaSourceStatus = 'extracted' | 'draft' | 'incomplete' | 'verified';

export interface TetrachotomyFormulaSource {
  document: string;
  tetraNumber: number;
  tableNumber: number;
  formulaText: string;
  relationText?: string;
  nearbyLabel?: string;
}

export interface TetrachotomyFormulaGroup {
  sourceColor?: string;
  typeIds: readonly SocionicTypeId[];
}

export interface TetrachotomySourceFormulaRow {
  aspectIds: readonly AspectId[];
  aspectText: string;
  aspectFeaturesText: string;
  functionBlockLabel: string;
  functionIds: readonly number[];
  functionFeaturesText: string;
}

export interface TetrachotomySourceFormulaBlock {
  typeIds: readonly SocionicTypeId[];
  labels: readonly string[];
  rows: readonly TetrachotomySourceFormulaRow[];
  status: 'extracted';
}

export interface TetrachotomyFormulaRecord {
  id: string;
  source: TetrachotomyFormulaSource;
  targetTraitId: ReininTraitId;
  basisTraitIds: readonly [ReininTraitId, ReininTraitId];
  status: Extract<FormulaSourceStatus, 'extracted' | 'verified'>;
  groups: readonly TetrachotomyFormulaGroup[];
  sourceBlocks?: readonly TetrachotomySourceFormulaBlock[];
}

interface ExtractedTetrachotomyEntry {
  tetraNumber: number;
  docTableNumber: number;
  formula: string;
  relation?: string;
  nearbyLabel?: string;
  groups: readonly {
    color?: string;
    typeIds: readonly SocionicTypeId[];
  }[];
}

interface TetrachotomyExtract {
  sourceDocument: string;
  tableCount: number;
  entries: readonly ExtractedTetrachotomyEntry[];
}

export const TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL = {
  'Верт': 'vertness',
  'Наль': 'nalness',
  'Таль': 'talness',
  'Бс/Пр': 'carefree',
  'Ус/Уп': 'yielding',
  'Ит/Сн': 'intuition',
  'Лг/Эт': 'logic',
  'Сб/Об': 'subjectivism',
  'Рс/Рш': 'judicious',
  'Кн/Эм': 'constructivism',
  'Тк/Ст': 'tactical',
  'Дм/Ар': 'democracy',
  '+/-': 'positivism',
  '?/!': 'asking',
  'Пц/Рз': 'process',
} as const satisfies Record<string, ReininTraitId>;

export type TetrachotomySourceLabel = keyof typeof TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL;

const TETRACHOTOMY_EXTRACT = sourceExtract as TetrachotomyExtract;

function parseFormulaTraits(formula: string): {
  targetTraitId: ReininTraitId;
  basisTraitIds: readonly [ReininTraitId, ReininTraitId];
} {
  const match = formula.match(/^(.+?)\s*=\s*(.+?)\s*[ХXx]\s*(.+?)\s*\(/u);

  if (!match) {
    throw new Error(`Cannot parse tetrachotomy formula: ${formula}`);
  }

  const labels = match.slice(1, 4).map(label => label.trim());
  const traitIds = labels.map(label => {
    const traitId = TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL[label as TetrachotomySourceLabel];
    if (!traitId) {
      throw new Error(`Unknown tetrachotomy source trait label: ${label}`);
    }
    return traitId;
  });

  return {
    targetTraitId: traitIds[0],
    basisTraitIds: [traitIds[1], traitIds[2]],
  };
}

const buildTetrachotomyFormulaId = (tetraNumber: number): string => (
  `tetra-${String(tetraNumber).padStart(2, '0')}`
);

const TETRACHOTOMY_SOURCE_BLOCKS_BY_FORMULA_ID: Partial<Record<string, readonly TetrachotomySourceFormulaBlock[]>> = {
  'tetra-01': [
    {
      typeIds: ['ILE', 'EIE', 'LIE', 'IEE'],
      labels: ['Рыцари', 'Уникальность'],
      status: 'extracted',
      rows: [
        {
          aspectIds: ['Ne'],
          aspectText: 'ЧИ',
          aspectFeaturesText: 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные',
          functionBlockLabel: 'мерность 4',
          functionIds: [1, 8],
          functionFeaturesText: 'экстравертные оценочные сильные',
        },
        {
          aspectIds: ['Ni'],
          aspectText: 'БИ',
          aspectFeaturesText: 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные',
          functionBlockLabel: 'мерность 3',
          functionIds: [2, 7],
          functionFeaturesText: 'интровертные ситуативные сильные',
        },
        {
          aspectIds: ['Se'],
          aspectText: 'ЧС',
          aspectFeaturesText: 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные',
          functionBlockLabel: 'мерность 2',
          functionIds: [3, 6],
          functionFeaturesText: 'экстравертные ситуативные слабые',
        },
        {
          aspectIds: ['Si'],
          aspectText: 'БС',
          aspectFeaturesText: 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные',
          functionBlockLabel: 'мерность 1',
          functionIds: [4, 5],
          functionFeaturesText: 'интровертные оценочные слабые',
        },
      ],
    },
  ],
};

export const TETRACHOTOMY_FORMULAS: readonly TetrachotomyFormulaRecord[] = (
  TETRACHOTOMY_EXTRACT.entries.map(entry => {
    const { targetTraitId, basisTraitIds } = parseFormulaTraits(entry.formula);
    const id = buildTetrachotomyFormulaId(entry.tetraNumber);

    return {
      id,
      source: {
        document: TETRACHOTOMY_EXTRACT.sourceDocument,
        tetraNumber: entry.tetraNumber,
        tableNumber: entry.docTableNumber,
        formulaText: entry.formula,
        relationText: entry.relation,
        nearbyLabel: entry.nearbyLabel,
      },
      targetTraitId,
      basisTraitIds,
      status: 'extracted',
      groups: entry.groups.map(group => ({
        sourceColor: group.color,
        typeIds: group.typeIds,
      })),
      sourceBlocks: TETRACHOTOMY_SOURCE_BLOCKS_BY_FORMULA_ID[id],
    };
  })
);

export function getTetrachotomyFormulaById(
  formulaId: string,
): TetrachotomyFormulaRecord | undefined {
  return TETRACHOTOMY_FORMULAS.find(formula => formula.id === formulaId);
}

export function getComputedTetrachotomyClassTypeSets(
  formula: TetrachotomyFormulaRecord,
): readonly (readonly SocionicTypeId[])[] {
  const partition = buildPartition(formula.basisTraitIds);
  if (!partition.ok || partition.kind !== 'tetrachotomy') {
    throw new Error(`Tetrachotomy formula ${formula.id} does not compute a tetrachotomy`);
  }

  return partition.classes.map(partitionClass => partitionClass.typeIds);
}
