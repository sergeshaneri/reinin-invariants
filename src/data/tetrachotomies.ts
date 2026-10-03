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

export interface TetrachotomySourceGroupCorrection {
  formulaId: string;
  sourceTypeIds: readonly SocionicTypeId[];
  typeIds: readonly SocionicTypeId[];
  confirmedBy: 'author';
  confirmedOn: string;
}

export interface TetrachotomySourceFormulaBlock {
  typeIds: readonly SocionicTypeId[];
  labels: readonly string[];
  rows: readonly TetrachotomySourceFormulaRow[];
  status: 'extracted';
  sourceGroupCorrection?: TetrachotomySourceGroupCorrection;
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

const ASPECT_ID_BY_SOURCE_TEXT = {
  'ЧИ': 'Ne',
  'БС': 'Si',
  'ЧС': 'Se',
  'БИ': 'Ni',
  'ЧЛ': 'Te',
  'БЛ': 'Ti',
  'ЧЭ': 'Fe',
  'БЭ': 'Fi',
} as const satisfies Record<string, AspectId>;

function aspectIdsFromSourceText(aspectText: string): readonly AspectId[] {
  return aspectText.split(' ').map(aspect => {
    const aspectId = ASPECT_ID_BY_SOURCE_TEXT[aspect as keyof typeof ASPECT_ID_BY_SOURCE_TEXT];
    if (!aspectId) {
      throw new Error(`Unknown tetrachotomy source aspect label: ${aspect}`);
    }
    return aspectId;
  });
}

const sourceRow = (
  aspectText: string,
  aspectFeaturesText: string,
  functionBlockLabel: string,
  functionIds: readonly number[],
  functionFeaturesText: string,
): TetrachotomySourceFormulaRow => ({
  aspectIds: aspectIdsFromSourceText(aspectText),
  aspectText,
  aspectFeaturesText,
  functionBlockLabel,
  functionIds,
  functionFeaturesText,
});

const sourceBlock = (
  typeIds: readonly SocionicTypeId[],
  labels: readonly string[],
  rows: readonly TetrachotomySourceFormulaRow[],
  sourceGroupCorrection?: TetrachotomySourceGroupCorrection,
): TetrachotomySourceFormulaBlock => ({
  typeIds,
  labels,
  status: 'extracted',
  rows,
  ...(sourceGroupCorrection ? { sourceGroupCorrection } : {}),
});

// Author confirmation: extracted table groups are correct; preserve literal DOCX groups.
export const TETRACHOTOMY_SOURCE_GROUP_CORRECTIONS: readonly TetrachotomySourceGroupCorrection[] = [
  {
    formulaId: 'tetra-07',
    sourceTypeIds: ['SEI', 'IEE', 'ILI', 'SLI'],
    typeIds: ['SEI', 'IEI', 'ILI', 'SLI'],
    confirmedBy: 'author',
    confirmedOn: '2026-10-02',
  },
  {
    formulaId: 'tetra-13',
    sourceTypeIds: ['SEI', 'EII', 'LIE', 'SLI'],
    typeIds: ['SEI', 'EIE', 'LIE', 'SLI'],
    confirmedBy: 'author',
    confirmedOn: '2026-10-02',
  },
];

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
    {
      typeIds: ['SEI', 'LSI', 'ESI', 'SLI'],
      labels: ['Благосостояние'],
      status: 'extracted',
      rows: [
        {
          aspectIds: ['Si'],
          aspectText: 'БС',
          aspectFeaturesText: 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные',
          functionBlockLabel: 'мерность 4',
          functionIds: [1, 8],
          functionFeaturesText: 'экстравертные оценочные сильные',
        },
        {
          aspectIds: ['Se'],
          aspectText: 'ЧС',
          aspectFeaturesText: 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные',
          functionBlockLabel: 'мерность 3',
          functionIds: [2, 7],
          functionFeaturesText: 'интровертные ситуативные сильные',
        },
        {
          aspectIds: ['Ni'],
          aspectText: 'БИ',
          aspectFeaturesText: 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные',
          functionBlockLabel: 'мерность 2',
          functionIds: [3, 6],
          functionFeaturesText: 'экстравертные ситуативные слабые',
        },
        {
          aspectIds: ['Ne'],
          aspectText: 'ЧИ',
          aspectFeaturesText: 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные',
          functionBlockLabel: 'мерность 1',
          functionIds: [4, 5],
          functionFeaturesText: 'интровертные оценочные слабые',
        },
      ],
    },
    {
      typeIds: ['ESE', 'SLE', 'SEE', 'LSE'],
      labels: ['Статус'],
      status: 'extracted',
      rows: [
        {
          aspectIds: ['Se'],
          aspectText: 'ЧС',
          aspectFeaturesText: 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные',
          functionBlockLabel: 'мерность 4',
          functionIds: [1, 8],
          functionFeaturesText: 'экстравертные оценочные сильные',
        },
        {
          aspectIds: ['Si'],
          aspectText: 'БС',
          aspectFeaturesText: 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные',
          functionBlockLabel: 'мерность 3',
          functionIds: [2, 7],
          functionFeaturesText: 'интровертные ситуативные сильные',
        },
        {
          aspectIds: ['Ne'],
          aspectText: 'ЧИ',
          aspectFeaturesText: 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные',
          functionBlockLabel: 'мерность 2',
          functionIds: [3, 6],
          functionFeaturesText: 'экстравертные ситуативные слабые',
        },
        {
          aspectIds: ['Ni'],
          aspectText: 'БИ',
          aspectFeaturesText: 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные',
          functionBlockLabel: 'мерность 1',
          functionIds: [4, 5],
          functionFeaturesText: 'интровертные оценочные слабые',
        },
      ],
    },
    {
      typeIds: ['LII', 'IEI', 'ILI', 'EII'],
      labels: ['Целостность опыта'],
      status: 'extracted',
      rows: [
        {
          aspectIds: ['Ni'],
          aspectText: 'БИ',
          aspectFeaturesText: 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные',
          functionBlockLabel: 'мерность 4',
          functionIds: [1, 8],
          functionFeaturesText: 'экстравертные оценочные сильные',
        },
        {
          aspectIds: ['Ne'],
          aspectText: 'ЧИ',
          aspectFeaturesText: 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные',
          functionBlockLabel: 'мерность 3',
          functionIds: [2, 7],
          functionFeaturesText: 'интровертные ситуативные сильные',
        },
        {
          aspectIds: ['Si'],
          aspectText: 'БС',
          aspectFeaturesText: 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные',
          functionBlockLabel: 'мерность 2',
          functionIds: [3, 6],
          functionFeaturesText: 'экстравертные ситуативные слабые',
        },
        {
          aspectIds: ['Se'],
          aspectText: 'ЧС',
          aspectFeaturesText: 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные',
          functionBlockLabel: 'мерность 1',
          functionIds: [4, 5],
          functionFeaturesText: 'интровертные оценочные слабые',
        },
      ],
    },
  ],
  'tetra-03': [
    {
      typeIds: ['ILE', 'SLE', 'LIE', 'LSE'],
      labels: [],
      status: 'extracted',
      rows: [
        {
          aspectIds: ['Te'],
          aspectText: 'ЧЛ',
          aspectFeaturesText: 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные',
          functionBlockLabel: 'мерность 4',
          functionIds: [1, 8],
          functionFeaturesText: 'экстравертные оценочные сильные',
        },
        {
          aspectIds: ['Ti'],
          aspectText: 'БЛ',
          aspectFeaturesText: 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные',
          functionBlockLabel: 'мерность 3',
          functionIds: [2, 7],
          functionFeaturesText: 'интровертные ситуативные сильные',
        },
        {
          aspectIds: ['Fe'],
          aspectText: 'ЧЭ',
          aspectFeaturesText: 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные',
          functionBlockLabel: 'мерность 2',
          functionIds: [3, 6],
          functionFeaturesText: 'экстравертные ситуативные слабые',
        },
        {
          aspectIds: ['Fi'],
          aspectText: 'БЭ',
          aspectFeaturesText: 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные',
          functionBlockLabel: 'мерность 1',
          functionIds: [4, 5],
          functionFeaturesText: 'интровертные оценочные слабые',
        },
      ],
    },
    {
      typeIds: ['SEI', 'IEI', 'ESI', 'EII'],
      labels: [],
      status: 'extracted',
      rows: [
        {
          aspectIds: ['Fi'],
          aspectText: 'БЭ',
          aspectFeaturesText: 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные',
          functionBlockLabel: 'мерность 4',
          functionIds: [1, 8],
          functionFeaturesText: 'экстравертные оценочные сильные',
        },
        {
          aspectIds: ['Fe'],
          aspectText: 'ЧЭ',
          aspectFeaturesText: 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные',
          functionBlockLabel: 'мерность 3',
          functionIds: [2, 7],
          functionFeaturesText: 'интровертные ситуативные сильные',
        },
        {
          aspectIds: ['Ti'],
          aspectText: 'БЛ',
          aspectFeaturesText: 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные',
          functionBlockLabel: 'мерность 2',
          functionIds: [3, 6],
          functionFeaturesText: 'экстравертные ситуативные слабые',
        },
        {
          aspectIds: ['Te'],
          aspectText: 'ЧЛ',
          aspectFeaturesText: 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные',
          functionBlockLabel: 'мерность 1',
          functionIds: [4, 5],
          functionFeaturesText: 'интровертные оценочные слабые',
        },
      ],
    },
    {
      typeIds: ['ESE', 'EIE', 'SEE', 'IEE'],
      labels: [],
      status: 'extracted',
      rows: [
        {
          aspectIds: ['Fe'],
          aspectText: 'ЧЭ',
          aspectFeaturesText: 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные',
          functionBlockLabel: 'мерность 4',
          functionIds: [1, 8],
          functionFeaturesText: 'экстравертные оценочные сильные',
        },
        {
          aspectIds: ['Fi'],
          aspectText: 'БЭ',
          aspectFeaturesText: 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные',
          functionBlockLabel: 'мерность 3',
          functionIds: [2, 7],
          functionFeaturesText: 'интровертные ситуативные сильные',
        },
        {
          aspectIds: ['Te'],
          aspectText: 'ЧЛ',
          aspectFeaturesText: 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные',
          functionBlockLabel: 'мерность 2',
          functionIds: [3, 6],
          functionFeaturesText: 'экстравертные ситуативные слабые',
        },
        {
          aspectIds: ['Ti'],
          aspectText: 'БЛ',
          aspectFeaturesText: 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные',
          functionBlockLabel: 'мерность 1',
          functionIds: [4, 5],
          functionFeaturesText: 'интровертные оценочные слабые',
        },
      ],
    },
    {
      typeIds: ['LII', 'LSI', 'ILI', 'SLI'],
      labels: [],
      status: 'extracted',
      rows: [
        {
          aspectIds: ['Ti'],
          aspectText: 'БЛ',
          aspectFeaturesText: 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные',
          functionBlockLabel: 'мерность 4',
          functionIds: [1, 8],
          functionFeaturesText: 'экстравертные оценочные сильные',
        },
        {
          aspectIds: ['Te'],
          aspectText: 'ЧЛ',
          aspectFeaturesText: 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные',
          functionBlockLabel: 'мерность 3',
          functionIds: [2, 7],
          functionFeaturesText: 'интровертные ситуативные сильные',
        },
        {
          aspectIds: ['Fi'],
          aspectText: 'БЭ',
          aspectFeaturesText: 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные',
          functionBlockLabel: 'мерность 2',
          functionIds: [3, 6],
          functionFeaturesText: 'экстравертные ситуативные слабые',
        },
        {
          aspectIds: ['Fe'],
          aspectText: 'ЧЭ',
          aspectFeaturesText: 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные',
          functionBlockLabel: 'мерность 1',
          functionIds: [4, 5],
          functionFeaturesText: 'интровертные оценочные слабые',
        },
      ],
    },
  ],
  'tetra-04': [
    sourceBlock(['ILE', 'ESE', 'EIE', 'SLE'], [], [
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные', '', [2, 5], 'интровертные вербальные контактные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [3, 8], 'экстравертные лаборные контактные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [4, 7], 'интровертные лаборные инертные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [1, 6], 'экстравертные вербальные инертные'),
    ]),
    sourceBlock(['SEI', 'LII', 'LSI', 'IEI'], [], [
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [2, 5], 'интровертные вербальные контактные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [3, 8], 'экстравертные лаборные контактные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [4, 7], 'интровертные лаборные инертные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные', '', [1, 6], 'экстравертные вербальные инертные'),
    ]),
    sourceBlock(['LIE', 'SEE', 'IEE', 'LSE'], [], [
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [2, 5], 'интровертные вербальные контактные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [3, 8], 'экстравертные лаборные контактные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные', '', [4, 7], 'интровертные лаборные инертные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [1, 6], 'экстравертные вербальные инертные'),
    ]),
    sourceBlock(['ESI', 'ILI', 'SLI', 'EII'], [], [
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [2, 5], 'интровертные вербальные контактные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные', '', [3, 8], 'экстравертные лаборные контактные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [4, 7], 'интровертные лаборные инертные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [1, 6], 'экстравертные вербальные инертные'),
    ]),
  ],
  'tetra-06': [
    sourceBlock(['ILE', 'ESE', 'IEE', 'LSE'], ['Открытые'], [
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', '', [1, 6], 'экстравертные вербальные инертные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', '', [2, 5], 'интровертные вербальные контактные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', '', [3, 8], 'экстравертные лаборные контактные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', '', [4, 7], 'интровертные лаборные инертные'),
    ]),
    sourceBlock(['SEI', 'LII', 'SLI', 'EII'], ['Избегающие'], [
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', '', [1, 6], 'экстравертные вербальные инертные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', '', [2, 5], 'интровертные вербальные контактные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', '', [3, 8], 'экстравертные лаборные контактные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', '', [4, 7], 'интровертные лаборные инертные'),
    ]),
    sourceBlock(['EIE', 'SLE', 'LIE', 'SEE'], ['Экспансивные'], [
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', '', [1, 6], 'экстравертные вербальные инертные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', '', [2, 5], 'интровертные вербальные контактные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', '', [3, 8], 'экстравертные лаборные контактные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', '', [4, 7], 'интровертные лаборные инертные'),
    ]),
    sourceBlock(['LSI', 'IEI', 'ESI', 'ILI'], ['Скрытные'], [
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', '', [1, 6], 'экстравертные вербальные инертные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', '', [2, 5], 'интровертные вербальные контактные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', '', [3, 8], 'экстравертные лаборные контактные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', '', [4, 7], 'интровертные лаборные инертные'),
    ]),
  ],
  'tetra-07': [
    sourceBlock(['ILE', 'SLE', 'SEE', 'IEE'], ['Гибко-разворотливые'], [
      sourceRow('ЧИ ЧС', 'Экстравертные Иррациональные Статичные', '', [1, 3], 'экстравертные акцептные ментальные'),
      sourceRow('БС БИ', 'Интровертные Иррациональные Динамичные', '', [5, 7], 'интровертные акцептные витальные'),
      sourceRow('ЧЭ ЧЛ', 'Экстравертные Рациональные Динамичные', '', [6, 8], 'экстравертные продуктивные витальные'),
      sourceRow('БЛ БЭ', 'Интровертные Рациональные Статичные', '', [2, 4], 'интровертные продуктивные ментальные'),
    ]),
    sourceBlock(['SEI', 'IEI', 'ILI', 'SLI'], ['Восприимчиво-адаптивные'], [
      sourceRow('БС БИ', 'Интровертные Иррациональные Динамичные', '', [1, 3], 'экстравертные акцептные ментальные'),
      sourceRow('ЧИ ЧС', 'Экстравертные Иррациональные Статичные', '', [5, 7], 'интровертные акцептные витальные'),
      sourceRow('БЛ БЭ', 'Интровертные Рациональные Статичные', '', [6, 8], 'экстравертные продуктивные витальные'),
      sourceRow('ЧЭ ЧЛ', 'Экстравертные Рациональные Динамичные', '', [2, 4], 'интровертные продуктивные ментальные'),
    ], TETRACHOTOMY_SOURCE_GROUP_CORRECTIONS[0]),
    sourceBlock(['ESE', 'EIE', 'LIE', 'LSE'], ['Линейно-напористые'], [
      sourceRow('ЧЭ ЧЛ', 'Экстравертные Рациональные Динамичные', '', [1, 3], 'экстравертные акцептные ментальные'),
      sourceRow('БЛ БЭ', 'Интровертные Рациональные Статичные', '', [5, 7], 'интровертные акцептные витальные'),
      sourceRow('ЧИ ЧС', 'Экстравертные Иррациональные Статичные', '', [6, 8], 'экстравертные продуктивные витальные'),
      sourceRow('БС БИ', 'Интровертные Иррациональные Динамичные', '', [2, 4], 'интровертные продуктивные ментальные'),
    ]),
    sourceBlock(['LII', 'LSI', 'ESI', 'EII'], ['Уравновешено-стабильные'], [
      sourceRow('БЛ БЭ', 'Интровертные Рациональные Статичные', '', [1, 3], 'экстравертные акцептные ментальные'),
      sourceRow('ЧЭ ЧЛ', 'Экстравертные Рациональные Динамичные', '', [5, 7], 'интровертные акцептные витальные'),
      sourceRow('БС БИ', 'Интровертные Иррациональные Динамичные', '', [6, 8], 'экстравертные продуктивные витальные'),
      sourceRow('ЧИ ЧС', 'Экстравертные Иррациональные Статичные', '', [2, 4], 'интровертные продуктивные ментальные'),
    ]),
  ],
  'tetra-02': [
    sourceBlock(['ILE', 'ESE', 'LIE', 'SEE'], [], [
      sourceRow('ЧИ ЧЭ ЧЛ ЧС', 'Экстравертные', '', [1, 3, 6, 8], 'экстравертные'),
      sourceRow('БС БЛ БЭ БИ', 'Интровертные', '', [2, 4, 5, 7], 'интровертные'),
    ]),
    sourceBlock(['SEI', 'LII', 'ESI', 'ILI'], [], [
      sourceRow('БС БЛ БЭ БИ', 'Интровертные', '', [1, 3, 6, 8], 'экстравертные'),
      sourceRow('ЧИ ЧЭ ЧЛ ЧС', 'Экстравертные', '', [2, 4, 5, 7], 'интровертные'),
    ]),
    sourceBlock(['EIE', 'SLE', 'IEE', 'LSE'], [], [
      sourceRow('ЧИ ЧЭ ЧЛ ЧС', 'Экстравертные', '', [1, 3, 6, 8], 'экстравертные'),
      sourceRow('БС БЛ БЭ БИ', 'Интровертные', '', [2, 4, 5, 7], 'интровертные'),
    ]),
    sourceBlock(['LSI', 'IEI', 'SLI', 'EII'], [], [
      sourceRow('БС БЛ БЭ БИ', 'Интровертные', '', [1, 3, 6, 8], 'экстравертные'),
      sourceRow('ЧИ ЧЭ ЧЛ ЧС', 'Экстравертные', '', [2, 4, 5, 7], 'интровертные'),
    ]),
  ],
  'tetra-08': [
    sourceBlock(['ILE', 'SEI', 'LIE', 'ESI'], [], [
      sourceRow('ЧИ БС ЧЛ БЭ', 'Дельта', '', [1, 4, 5, 8], 'оценочные'),
      sourceRow('ЧЭ БЛ ЧС БИ', 'Бета', '', [2, 3, 6, 7], 'ситуативные'),
    ]),
    sourceBlock(['ESE', 'LII', 'SEE', 'ILI'], [], [
      sourceRow('ЧЭ БЛ ЧС БИ', 'Бета', '', [1, 4, 5, 8], 'оценочные'),
      sourceRow('ЧИ БС ЧЛ БЭ', 'Дельта', '', [2, 3, 6, 7], 'ситуативные'),
    ]),
    sourceBlock(['EIE', 'LSI', 'IEE', 'SLI'], [], [
      sourceRow('ЧИ БС ЧЭ БЛ', 'Альфа', '', [1, 4, 5, 8], 'оценочные'),
      sourceRow('ЧЛ БЭ ЧС БИ', 'Гамма', '', [2, 3, 6, 7], 'ситуативные'),
    ]),
    sourceBlock(['SLE', 'IEI', 'LSE', 'EII'], [], [
      sourceRow('ЧЛ БЭ ЧС БИ', 'Гамма', '', [1, 4, 5, 8], 'оценочные'),
      sourceRow('ЧИ БС ЧЭ БЛ', 'Альфа', '', [2, 3, 6, 7], 'ситуативные'),
    ]),
  ],
  'tetra-14': [
    sourceBlock(['ILE', 'LII', 'LIE', 'ILI'], [], [
      sourceRow('ЧИ БИ ЧЛ БЛ', 'Отвлеченные', '', [1, 2, 7, 8], 'сильные'),
      sourceRow('БС ЧЭ БЭ ЧС', 'Вовлеченные', '', [3, 4, 5, 6], 'слабые'),
    ]),
    sourceBlock(['SEI', 'ESE', 'ESI', 'SEE'], [], [
      sourceRow('БС ЧЭ БЭ ЧС', 'Вовлеченные', '', [1, 2, 7, 8], 'сильные'),
      sourceRow('ЧИ БИ ЧЛ БЛ', 'Отвлеченные', '', [3, 4, 5, 6], 'слабые'),
    ]),
    sourceBlock(['EIE', 'IEI', 'IEE', 'EII'], [], [
      sourceRow('ЧИ БИ ЧЭ БЭ', 'Неявные', '', [1, 2, 7, 8], 'сильные'),
      sourceRow('БС БЛ ЧЛ ЧС', 'Явные', '', [3, 4, 5, 6], 'слабые'),
    ]),
    sourceBlock(['LSI', 'SLE', 'SLI', 'LSE'], [], [
      sourceRow('БС БЛ ЧЛ ЧС', 'Явные', '', [1, 2, 7, 8], 'сильные'),
      sourceRow('ЧИ БИ ЧЭ БЭ', 'Неявные', '', [3, 4, 5, 6], 'слабые'),
    ]),
  ],
  'tetra-20': [
    sourceBlock(['ILE', 'SEI', 'ESE', 'LII'], ['Альфа'], [
      sourceRow('ЧИ БС ЧЭ БЛ', 'Альфа', '', [1, 2, 5, 6], 'вербальные'),
      sourceRow('ЧЛ БЭ ЧС БИ', 'Гамма', '', [3, 4, 7, 8], 'лаборные'),
    ]),
    sourceBlock(['EIE', 'LSI', 'SLE', 'IEI'], ['Бета'], [
      sourceRow('ЧЭ БЛ ЧС БИ', 'Бета', '', [1, 2, 5, 6], 'вербальные'),
      sourceRow('ЧИ БС ЧЛ БЭ', 'Дельта', '', [3, 4, 7, 8], 'лаборные'),
    ]),
    sourceBlock(['LIE', 'ESI', 'SEE', 'ILI'], ['Гамма'], [
      sourceRow('ЧЛ БЭ ЧС БИ', 'Гамма', '', [1, 2, 5, 6], 'вербальные'),
      sourceRow('ЧИ БС ЧЭ БЛ', 'Альфа', '', [3, 4, 7, 8], 'лаборные'),
    ]),
    sourceBlock(['IEE', 'SLI', 'LSE', 'EII'], ['Дельта'], [
      sourceRow('ЧИ БС ЧЛ БЭ', 'Дельта', '', [1, 2, 5, 6], 'вербальные'),
      sourceRow('ЧЭ БЛ ЧС БИ', 'Бета', '', [3, 4, 7, 8], 'лаборные'),
    ]),
  ],
  'tetra-21': [
    sourceBlock(['ILE', 'ESE', 'ESI', 'ILI'], [], [
      sourceRow('ЧИ БИ ЧЭ БЭ', 'Неявные', '', [1, 4, 6, 7], 'инертные'),
      sourceRow('БС БЛ ЧЛ ЧС', 'Явные', '', [2, 3, 5, 8], 'контактные'),
    ]),
    sourceBlock(['SEI', 'LII', 'LIE', 'SEE'], [], [
      sourceRow('БС БЛ ЧЛ ЧС', 'Явные', '', [1, 4, 6, 7], 'инертные'),
      sourceRow('ЧИ БИ ЧЭ БЭ', 'Неявные', '', [2, 3, 5, 8], 'контактные'),
    ]),
    sourceBlock(['EIE', 'SLE', 'SLI', 'EII'], [], [
      sourceRow('ЧИ БИ ЧЛ БЛ', 'Отвлеченные', '', [2, 3, 5, 8], 'контактные'),
      sourceRow('БС ЧЭ БЭ ЧС', 'Вовлеченные', '', [1, 4, 6, 7], 'инертные'),
    ]),
    sourceBlock(['LSI', 'IEI', 'IEE', 'LSE'], [], [
      sourceRow('БС ЧЭ БЭ ЧС', 'Вовлеченные', '', [2, 3, 5, 8], 'контактные'),
      sourceRow('ЧИ БИ ЧЛ БЛ', 'Отвлеченные', '', [1, 4, 6, 7], 'инертные'),
    ]),
  ],
  'tetra-22': [
    sourceBlock(['ILE', 'SEI', 'SEE', 'ILI'], ['Последовательность Процесса'], [
      sourceRow('ЧИ БС ЧС БИ', 'иррациональные', '', [1, 3, 5, 7], 'акцептные'),
      sourceRow('ЧЭ БЛ ЧЛ БЭ', 'рациональные', '', [2, 4, 6, 8], 'продуктивные'),
    ]),
    sourceBlock(['ESE', 'LII', 'LIE', 'ESI'], ['Последовательность Результата'], [
      sourceRow('ЧЭ БЛ ЧЛ БЭ', 'рациональные', '', [1, 3, 5, 7], 'акцептные'),
      sourceRow('ЧИ БС ЧС БИ', 'иррациональные', '', [2, 4, 6, 8], 'продуктивные'),
    ]),
    sourceBlock(['EIE', 'LSI', 'LSE', 'EII'], ['Последовательность Процесса'], [
      sourceRow('ЧЭ БЛ ЧЛ БЭ', 'рациональные', '', [1, 3, 5, 7], 'акцептные'),
      sourceRow('ЧИ БС ЧС БИ', 'иррациональные', '', [2, 4, 6, 8], 'продуктивные'),
    ]),
    sourceBlock(['SLE', 'IEI', 'IEE', 'SLI'], ['Последовательность Результата'], [
      sourceRow('ЧИ БС ЧС БИ', 'иррациональные', '', [1, 3, 5, 7], 'акцептные'),
      sourceRow('ЧЭ БЛ ЧЛ БЭ', 'рациональные', '', [2, 4, 6, 8], 'продуктивные'),
    ]),
  ],
  'tetra-23': [
    sourceBlock(['ILE', 'ESI', 'SEE', 'LII'], ['Эквивалентность Демократов'], [
      sourceRow('ЧИ БЛ БЭ ЧС', 'Статичные', '', [1, 2, 3, 4], 'ментальные'),
      sourceRow('БС ЧЭ ЧЛ БИ', 'Динамичные', '', [5, 6, 7, 8], 'витальные'),
    ]),
    sourceBlock(['SEI', 'ESE', 'LIE', 'ILI'], ['Эквивалентность Демократов'], [
      sourceRow('БС ЧЭ ЧЛ БИ', 'Динамичные', '', [1, 2, 3, 4], 'ментальные'),
      sourceRow('ЧИ БЛ БЭ ЧС', 'Статичные', '', [5, 6, 7, 8], 'витальные'),
    ]),
    sourceBlock(['EIE', 'SLI', 'LSE', 'IEI'], ['Эквивалентность Аристократов'], [
      sourceRow('БС ЧЭ ЧЛ БИ', 'Динамичные', '', [1, 2, 3, 4], 'ментальные'),
      sourceRow('ЧИ БЛ БЭ ЧС', 'Статичные', '', [5, 6, 7, 8], 'витальные'),
    ]),
    sourceBlock(['LSI', 'SLE', 'IEE', 'EII'], ['Эквивалентность Аристократов'], [
      sourceRow('ЧИ БЛ БЭ ЧС', 'Статичные', '', [1, 2, 3, 4], 'ментальные'),
      sourceRow('БС ЧЭ ЧЛ БИ', 'Динамичные', '', [5, 6, 7, 8], 'витальные'),
    ]),
  ],
  'tetra-12': [
    sourceBlock(['ILE', 'SEI', 'IEE', 'SLI'], [], [
      sourceRow('ЧИ БС', 'дельта альфа иррациональные', '', [1, 5], 'оценочные вербальные акцептные'),
      sourceRow('ЧС БИ', 'бета гамма иррациональные', '', [3, 7], 'ситуативные лаборные акцептные'),
    ]),
    sourceBlock(['ESE', 'LII', 'LSE', 'EII'], [], [
      sourceRow('ЧИ БС', 'дельта альфа иррациональные', '', [2, 6], 'ситуативные вербальные продуктивные'),
      sourceRow('ЧС БИ', 'бета гамма иррациональные', '', [4, 8], 'оценочные лаборные продуктивные'),
    ]),
    sourceBlock(['EIE', 'LSI', 'LIE', 'ESI'], [], [
      sourceRow('ЧС БИ', 'бета гамма иррациональные', '', [2, 6], 'ситуативные вербальные продуктивные'),
      sourceRow('ЧИ БС', 'дельта альфа иррациональные', '', [4, 8], 'оценочные лаборные продуктивные'),
    ]),
    sourceBlock(['SLE', 'IEI', 'SEE', 'ILI'], [], [
      sourceRow('ЧС БИ', 'бета гамма иррациональные', '', [1, 5], 'оценочные вербальные акцептные'),
      sourceRow('ЧИ БС', 'дельта альфа иррациональные', '', [3, 7], 'ситуативные лаборные акцептные'),
    ]),
  ],
  'tetra-13': [
    sourceBlock(['ILE', 'LSI', 'ESI', 'IEE'], [], [
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', '', [1, 4], 'оценочные инертные ментальные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', '', [5, 8], 'оценочные контактные витальные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', '', [3, 2], 'ситуативные контактные ментальные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', '', [6, 7], 'ситуативные инертные витальные'),
    ]),
    sourceBlock(['SEI', 'EIE', 'LIE', 'SLI'], [], [
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', '', [1, 4], 'оценочные инертные ментальные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', '', [5, 8], 'оценочные контактные витальные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', '', [3, 2], 'ситуативные контактные ментальные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', '', [6, 7], 'ситуативные инертные витальные'),
    ], TETRACHOTOMY_SOURCE_GROUP_CORRECTIONS[1]),
    sourceBlock(['ESE', 'IEI', 'ILI', 'LSE'], [], [
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', '', [1, 4], 'оценочные инертные ментальные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', '', [5, 8], 'оценочные контактные витальные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', '', [3, 2], 'ситуативные контактные ментальные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', '', [6, 7], 'ситуативные инертные витальные'),
    ]),
    sourceBlock(['LII', 'SLE', 'SEE', 'EII'], [], [
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', '', [1, 4], 'оценочные инертные ментальные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', '', [5, 8], 'оценочные контактные витальные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', '', [3, 2], 'ситуативные контактные ментальные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', '', [6, 7], 'ситуативные инертные витальные'),
    ]),
  ],
  'tetra-18': [
    sourceBlock(['ILE', 'LII', 'IEE', 'EII'], [], [
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', 'Эго', [1, 2], 'сильные вербальные ментальные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', 'Ид', [7, 8], 'сильные лаборные витальные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', 'Суперэго', [3, 4], 'слабые лаборные ментальные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', 'Суперид', [5, 6], 'слабые вербальные витальные'),
    ]),
    sourceBlock(['SEI', 'ESE', 'SLI', 'LSE'], [], [
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', 'Эго', [1, 2], 'сильные вербальные ментальные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', 'Ид', [7, 8], 'сильные лаборные витальные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', 'Суперэго', [3, 4], 'слабые лаборные ментальные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', 'Суперид', [5, 6], 'слабые вербальные витальные'),
    ]),
    sourceBlock(['EIE', 'IEI', 'LIE', 'ILI'], [], [
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', 'Эго', [1, 2], 'сильные вербальные ментальные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', 'Ид', [7, 8], 'сильные лаборные витальные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', 'Суперэго', [3, 4], 'слабые лаборные ментальные'),
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', 'Суперид', [5, 6], 'слабые вербальные витальные'),
    ]),
    sourceBlock(['LSI', 'SLE', 'ESI', 'SEE'], [], [
      sourceRow('ЧС', 'Экстравертные Дельта Вовлеченные Гамма Явные Иррациональные Статичные', 'Эго', [1, 2], 'сильные вербальные ментальные'),
      sourceRow('БС', 'Интровертные Дельта Вовлеченные Альфа Явные Иррациональные Динамичные', 'Ид', [7, 8], 'сильные лаборные витальные'),
      sourceRow('ЧИ', 'Экстравертные Дельта Отвлеченные Альфа Неявные Иррациональные Статичные', 'Суперэго', [3, 4], 'слабые лаборные ментальные'),
      sourceRow('БИ', 'Интровертные Бета Отвлеченные Гамма Неявные Иррациональные Динамичные', 'Суперид', [5, 6], 'слабые вербальные витальные'),
    ]),
  ],
  'tetra-19': [
    sourceBlock(['ILE', 'IEI', 'ILI', 'IEE'], [], [
      sourceRow('ЧИ БИ', 'Неявные Отвлеченные Иррациональные', '', [1, 7], 'инертные сильные акцептные'),
      sourceRow('ЧС БС', 'Явные Вовлеченные Иррациональные', '', [3, 5], 'контактные слабые акцептные'),
    ]),
    sourceBlock(['SEI', 'SLE', 'SEE', 'SLI'], [], [
      sourceRow('ЧС БС', 'Явные Вовлеченные Иррациональные', '', [1, 7], 'инертные сильные акцептные'),
      sourceRow('ЧИ БИ', 'Неявные Отвлеченные Иррациональные', '', [3, 5], 'контактные слабые акцептные'),
    ]),
    sourceBlock(['ESE', 'LSI', 'ESI', 'LSE'], [], [
      sourceRow('ЧИ БИ', 'Неявные Отвлеченные Иррациональные', '', [4, 6], 'слабые инертные продуктивные'),
      sourceRow('ЧС БС', 'Явные Вовлеченные Иррациональные', '', [2, 8], 'сильные контактные продуктивные'),
    ]),
    sourceBlock(['LII', 'EIE', 'LIE', 'EII'], [], [
      sourceRow('ЧС БС', 'Явные Вовлеченные Иррациональные', '', [4, 6], 'слабые инертные продуктивные'),
      sourceRow('ЧИ БИ', 'Неявные Отвлеченные Иррациональные', '', [2, 8], 'сильные контактные продуктивные'),
    ]),
  ],
  'tetra-28': [
    sourceBlock(['ILE', 'SEI', 'SLE', 'IEI'], [], [
      sourceRow('ЧЛ БЭ', 'дельта гамма рациональные', '', [4, 8], 'оценочные лаборные продуктивные'),
      sourceRow('БЛ ЧЭ', 'бета альфа рациональные', '', [2, 6], 'ситуативные вербальные продуктивные'),
      sourceRow('ЧИ БС ЧС БИ', 'иррациональные', '', [1, 3, 5, 7], 'акцептные'),
    ]),
    sourceBlock(['ESE', 'LII', 'EIE', 'LSI'], [], [
      sourceRow('БЛ ЧЭ', 'бета альфа рациональные', '', [1, 5], 'оценочные вербальные акцептные'),
      sourceRow('ЧЛ БЭ', 'дельта гамма рациональные', '', [3, 7], 'ситуативные лаборные акцептные'),
      sourceRow('ЧИ БС ЧС БИ', 'иррациональные', '', [2, 4, 6, 8], 'продуктивные'),
    ]),
    sourceBlock(['LIE', 'ESI', 'LSE', 'EII'], [], [
      sourceRow('ЧЛ БЭ', 'дельта гамма рациональные', '', [1, 5], 'оценочные вербальные акцептные'),
      sourceRow('БЛ ЧЭ', 'бета альфа рациональные', '', [3, 7], 'ситуативные лаборные акцептные'),
      sourceRow('ЧИ БС ЧС БИ', 'иррациональные', '', [2, 4, 6, 8], 'продуктивные'),
    ]),
    sourceBlock(['SEE', 'ILI', 'IEE', 'SLI'], [], [
      sourceRow('БЛ ЧЭ', 'бета альфа рациональные', '', [4, 8], 'оценочные лаборные продуктивные'),
      sourceRow('ЧЛ БЭ', 'дельта гамма рациональные', '', [2, 6], 'ситуативные вербальные продуктивные'),
      sourceRow('ЧИ БС ЧС БИ', 'иррациональные', '', [1, 3, 5, 7], 'акцептные'),
    ]),
  ],
  'tetra-29': [
    sourceBlock(['ILE', 'SLE', 'ESI', 'EII'], [], [
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [1, 4], 'ментальные оценочные инертные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [5, 8], 'витальные оценочные контактные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные', '', [2, 3], 'ментальные ситуативные контактные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [6, 7], 'витальные ситуативные инертные'),
    ]),
    sourceBlock(['SEI', 'IEI', 'LIE', 'LSE'], [], [
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [1, 4], 'ментальные оценочные инертные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [5, 8], 'витальные оценочные контактные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [2, 3], 'ментальные ситуативные контактные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные', '', [6, 7], 'витальные ситуативные инертные'),
    ]),
    sourceBlock(['ESE', 'EIE', 'ILI', 'SLI'], [], [
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [1, 4], 'ментальные оценочные инертные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные', '', [5, 8], 'витальные оценочные контактные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [2, 3], 'ментальные ситуативные контактные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [6, 7], 'витальные ситуативные инертные'),
    ]),
    sourceBlock(['LII', 'LSI', 'SEE', 'IEE'], [], [
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Явные Рациональные Статичные', '', [1, 4], 'ментальные оценочные инертные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [5, 8], 'витальные оценочные контактные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [2, 3], 'ментальные ситуативные контактные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [6, 7], 'витальные ситуативные инертные'),
    ]),
  ],
  'tetra-32': [
    sourceBlock(['ILE', 'LII', 'LSI', 'SLE'], [], [
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Неявные Рациональные Статичные', '', [1, 2], 'сильные вербальные ментальные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [7, 8], 'сильные лаборные витальные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [5, 6], 'слабые вербальные витальные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [3, 4], 'слабые лаборные ментальные'),
    ]),
    sourceBlock(['SEI', 'ESE', 'EIE', 'IEI'], [], [
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [1, 2], 'сильные вербальные ментальные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [7, 8], 'сильные лаборные витальные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Неявные Рациональные Статичные', '', [5, 6], 'слабые вербальные витальные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [3, 4], 'слабые лаборные ментальные'),
    ]),
    sourceBlock(['LIE', 'ILI', 'SLI', 'LSE'], [], [
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [1, 2], 'сильные вербальные ментальные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Неявные Рациональные Статичные', '', [7, 8], 'сильные лаборные витальные'),
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [5, 6], 'слабые вербальные витальные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [3, 4], 'слабые лаборные ментальные'),
    ]),
    sourceBlock(['ESI', 'SEE', 'IEE', 'EII'], [], [
      sourceRow('БЭ', 'Интровертные Дельта Вовлеченные Гамма Неявные Рациональные Статичные', '', [1, 2], 'сильные вербальные ментальные'),
      sourceRow('ЧЭ', 'Экстравертные Бета Вовлеченные Альфа Неявные Рациональные Динамичные', '', [7, 8], 'сильные лаборные витальные'),
      sourceRow('ЧЛ', 'Экстравертные Дельта Отвлеченные Гамма Явные Рациональные Динамичные', '', [5, 6], 'слабые вербальные витальные'),
      sourceRow('БЛ', 'Интровертные Бета Отвлеченные Альфа Неявные Рациональные Статичные', '', [3, 4], 'слабые лаборные ментальные'),
    ]),
  ],
  'tetra-33': [
    sourceBlock(['ILE', 'SLE', 'ILI', 'SLI'], ['Реструкторы'], [
      sourceRow('БЛ ЧЛ', 'Отвлеченные Явные Рациональные', '', [2, 8], 'сильные контактные продуктивные'),
      sourceRow('ЧЭ БЭ', 'Вовлеченные Неявные Рациональные', '', [4, 6], 'слабые инертные продуктивные'),
    ]),
    sourceBlock(['SEI', 'IEI', 'SEE', 'IEE'], [], [
      sourceRow('ЧЭ БЭ', 'Вовлеченные Неявные Рациональные', '', [2, 8], 'сильные контактные продуктивные'),
      sourceRow('БЛ ЧЛ', 'Отвлеченные Явные Рациональные', '', [4, 6], 'слабые инертные продуктивные'),
    ]),
    sourceBlock(['ESE', 'EIE', 'ESI', 'EII'], [], [
      sourceRow('ЧЭ БЭ', 'Вовлеченные Неявные Рациональные', '', [1, 7], 'инертные сильные акцептные'),
      sourceRow('БЛ ЧЛ', 'Отвлеченные Явные Рациональные', '', [3, 5], 'контактные слабые акцептные'),
    ]),
    sourceBlock(['LII', 'LSI', 'LIE', 'LSE'], [], [
      sourceRow('БЛ ЧЛ', 'Отвлеченные Явные Рациональные', '', [1, 7], 'инертные сильные акцептные'),
      sourceRow('ЧЭ БЭ', 'Вовлеченные Неявные Рациональные', '', [3, 5], 'контактные слабые акцептные'),
    ]),
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

export function getTetrachotomyFormulaSourceBlocks(
  formula: TetrachotomyFormulaRecord,
): readonly TetrachotomySourceFormulaBlock[] {
  return formula.sourceBlocks ?? [];
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
