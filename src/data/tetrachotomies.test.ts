import { describe, expect, it } from 'vitest';
import {
  auditCurrentSourceBlocks,
  extractDirectTetrachotomySourceBlocks,
  getSourceModelAssignmentMismatches,
} from '../../scripts/audit-tetrachotomy-docx';
import { rankTraitVectors } from './partitions';
import { ASPECTS, FUNCTIONS, REININ_TRAITS } from './socionics';
import {
  TETRACHOTOMY_FORMULAS,
  TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL,
  getComputedTetrachotomyClassTypeSets,
  getTetrachotomyFormulaById,
  getTetrachotomyFormulaSourceBlocks,
} from './tetrachotomies';
import { SOCIONIC_TYPES, SOCIONIC_TYPE_ORDER } from './types';

const sortedSetKey = (typeIds: readonly string[]): string => (
  [...typeIds].sort().join('|')
);

const groupSetKeys = (groups: readonly (readonly string[])[]): readonly string[] => (
  groups.map(sortedSetKey).sort()
);

const SIMPLE_SOURCE_BLOCK_FORMULA_IDS = [
  'tetra-01',
  'tetra-03',
  'tetra-04',
  'tetra-06',
  'tetra-07',
  'tetra-12',
  'tetra-13',
  'tetra-18',
  'tetra-19',
  'tetra-28',
  'tetra-29',
  'tetra-32',
  'tetra-33',
];

const SOURCE_BLOCK_FORMULA_IDS = [
  ...SIMPLE_SOURCE_BLOCK_FORMULA_IDS,
  'tetra-02', 'tetra-08', 'tetra-14', 'tetra-20', 'tetra-21', 'tetra-22', 'tetra-23',
  'tetra-09', 'tetra-10', 'tetra-11', 'tetra-15', 'tetra-16', 'tetra-17',
  'tetra-24', 'tetra-25', 'tetra-30', 'tetra-31', 'tetra-34', 'tetra-35',
].sort();

const AUTHOR_CONFIRMED_SOURCE_BLOCK_FORMULA_IDS = ['tetra-07', 'tetra-13'];

describe('tetrachotomy source formulas', () => {
  it('maps every source label to a registered Reinin trait', () => {
    const traitIds = new Set(REININ_TRAITS.map(trait => trait.id));

    Object.values(TETRACHOTOMY_TRAIT_BY_SOURCE_LABEL).forEach(traitId => {
      expect(traitIds.has(traitId)).toBe(true);
    });
  });

  it('loads the 35 extracted tetrachotomy source formulas with stable IDs', () => {
    expect(TETRACHOTOMY_FORMULAS).toHaveLength(35);
    expect(TETRACHOTOMY_FORMULAS.map(formula => formula.id)).toEqual(
      Array.from({ length: 35 }, (_unused, index) => (
        `tetra-${String(index + 1).padStart(2, '0')}`
      )),
    );
    expect(new Set(TETRACHOTOMY_FORMULAS.map(formula => formula.source.formulaText)).size).toBe(35);
  });

  it('preserves source metadata and 4x4 type groups for every formula', () => {
    const typeIds = new Set(SOCIONIC_TYPE_ORDER);

    TETRACHOTOMY_FORMULAS.forEach((formula, index) => {
      expect(formula.source.tetraNumber).toBe(index + 1);
      expect(formula.source.tableNumber).toBeGreaterThan(0);
      expect(formula.source.document).toContain('docs.google.com');
      expect(formula.source.formulaText).toContain('=');
      expect(formula.status).toBe('extracted');
      expect(formula.groups).toHaveLength(4);

      const flattenedTypes = formula.groups.flatMap(group => group.typeIds);
      expect(flattenedTypes).toHaveLength(16);
      expect(new Set(flattenedTypes).size).toBe(16);
      flattenedTypes.forEach(typeId => {
        expect(typeIds.has(typeId)).toBe(true);
      });
      formula.groups.forEach(group => {
        expect(group.typeIds).toHaveLength(4);
      });
    });
  });

  it('parses formula target and basis traits from source text', () => {
    expect(getTetrachotomyFormulaById('tetra-01')).toMatchObject({
      source: { formulaText: 'Верт = Бс/Пр Х Ит/Сн (1,а)' },
      targetTraitId: 'vertness',
      basisTraitIds: ['carefree', 'intuition'],
    });
    expect(getTetrachotomyFormulaById('tetra-35')).toMatchObject({
      source: { formulaText: 'Лг/Эт = ?/! Х Рс/Рш (35,a)' },
      targetTraitId: 'logic',
      basisTraitIds: ['asking', 'judicious'],
    });
  });

  it('keeps the first direct source aspect-function block as extracted DOCX rows', () => {
    const formula = getTetrachotomyFormulaById('tetra-01');

    expect(formula?.sourceBlocks).toHaveLength(4);
    expect(formula?.sourceBlocks?.map(block => block.labels)).toEqual([
      ['Рыцари', 'Уникальность'],
      ['Благосостояние'],
      ['Статус'],
      ['Целостность опыта'],
    ]);
    expect(formula?.sourceBlocks?.[0]).toMatchObject({
      typeIds: ['ILE', 'EIE', 'LIE', 'IEE'],
      labels: ['Рыцари', 'Уникальность'],
      status: 'extracted',
    });
    expect(formula?.sourceBlocks?.[0].rows).toEqual([
      expect.objectContaining({
        aspectIds: ['Ne'],
        aspectText: 'ЧИ',
        functionBlockLabel: 'мерность 4',
        functionIds: [1, 8],
      }),
      expect.objectContaining({
        aspectIds: ['Ni'],
        aspectText: 'БИ',
        functionBlockLabel: 'мерность 3',
        functionIds: [2, 7],
      }),
      expect.objectContaining({
        aspectIds: ['Se'],
        aspectText: 'ЧС',
        functionBlockLabel: 'мерность 2',
        functionIds: [3, 6],
      }),
      expect.objectContaining({
        aspectIds: ['Si'],
        aspectText: 'БС',
        functionBlockLabel: 'мерность 1',
        functionIds: [4, 5],
      }),
    ]);
    expect(formula?.sourceBlocks?.map(block => block.rows.map(row => row.aspectText))).toEqual([
      ['ЧИ', 'БИ', 'ЧС', 'БС'],
      ['БС', 'ЧС', 'БИ', 'ЧИ'],
      ['ЧС', 'БС', 'ЧИ', 'БИ'],
      ['БИ', 'ЧИ', 'БС', 'ЧС'],
    ]);
  });

  it('keeps another simple class-1/2 source formula as direct aspect-function rows', () => {
    const formula = getTetrachotomyFormulaById('tetra-03');

    expect(formula).toMatchObject({
      source: { formulaText: 'Верт = Ус/Уп Х Лг/Эт (3,а)' },
      targetTraitId: 'vertness',
      basisTraitIds: ['yielding', 'logic'],
    });
    expect(formula?.sourceBlocks).toHaveLength(4);
    expect(formula?.sourceBlocks?.map(block => block.labels)).toEqual([
      [],
      [],
      [],
      [],
    ]);
    expect(formula?.sourceBlocks?.map(block => block.typeIds)).toEqual([
      ['ILE', 'SLE', 'LIE', 'LSE'],
      ['SEI', 'IEI', 'ESI', 'EII'],
      ['ESE', 'EIE', 'SEE', 'IEE'],
      ['LII', 'LSI', 'ILI', 'SLI'],
    ]);
    expect(formula?.sourceBlocks?.[0].rows).toEqual([
      expect.objectContaining({
        aspectIds: ['Te'],
        aspectText: 'ЧЛ',
        functionBlockLabel: 'мерность 4',
        functionIds: [1, 8],
      }),
      expect.objectContaining({
        aspectIds: ['Ti'],
        aspectText: 'БЛ',
        functionBlockLabel: 'мерность 3',
        functionIds: [2, 7],
      }),
      expect.objectContaining({
        aspectIds: ['Fe'],
        aspectText: 'ЧЭ',
        functionBlockLabel: 'мерность 2',
        functionIds: [3, 6],
      }),
      expect.objectContaining({
        aspectIds: ['Fi'],
        aspectText: 'БЭ',
        functionBlockLabel: 'мерность 1',
        functionIds: [4, 5],
      }),
    ]);
    expect(formula?.sourceBlocks?.[3].rows.map(row => row.aspectText)).toEqual([
      'БЛ',
      'ЧЛ',
      'БЭ',
      'ЧЭ',
    ]);
  });

  it('covers every direct formula using only class-1/2 traits', () => {
    expect(
      TETRACHOTOMY_FORMULAS
        .filter(formula => formula.sourceBlocks)
        .map(formula => formula.id),
    ).toEqual(SOURCE_BLOCK_FORMULA_IDS);

    const simpleFormulaIds = TETRACHOTOMY_FORMULAS.filter(formula => (
      [formula.targetTraitId, ...formula.basisTraitIds].every(traitId => (
        REININ_TRAITS.find(trait => trait.id === traitId)!.class !== 3
      ))
    )).map(formula => formula.id);
    expect(SOURCE_BLOCK_FORMULA_IDS).toHaveLength(32);
    expect(simpleFormulaIds).toEqual(SIMPLE_SOURCE_BLOCK_FORMULA_IDS);
    expect(simpleFormulaIds).toHaveLength(13);
    expect(TETRACHOTOMY_FORMULAS.filter(formula => !formula.sourceBlocks)).toHaveLength(3);
  });

  it('preserves author-confirmed group corrections separately from literal DOCX groups', () => {
    const expectations = [
      { id: 'tetra-07', sourceTypeIds: ['SEI', 'IEE', 'ILI', 'SLI'], typeIds: ['SEI', 'IEI', 'ILI', 'SLI'] },
      { id: 'tetra-13', sourceTypeIds: ['SEI', 'EII', 'LIE', 'SLI'], typeIds: ['SEI', 'EIE', 'LIE', 'SLI'] },
    ];
    expectations.forEach(({ id, sourceTypeIds, typeIds }) => {
      expect(getTetrachotomyFormulaById(id)?.sourceBlocks).toHaveLength(4);
      expect(getTetrachotomyFormulaById(id)?.sourceBlocks).toContainEqual(expect.objectContaining({
        typeIds,
        sourceGroupCorrection: {
          formulaId: id, sourceTypeIds, typeIds, confirmedBy: 'author', confirmedOn: '2026-10-02',
        },
      }));
    });
  });

  it('checks every newly transferred aspect placement against all four Model A assignments', () => {
    AUTHOR_CONFIRMED_SOURCE_BLOCK_FORMULA_IDS.forEach(formulaId => {
      const formula = getTetrachotomyFormulaById(formulaId)!;
      expect(formula.sourceBlocks).toHaveLength(4);
      formula.sourceBlocks!.forEach(block => block.rows.forEach(row => {
        expect(row.functionIds).toHaveLength(2);
        expect([1, 2]).toContain(row.aspectIds.length);
        block.typeIds.forEach(typeId => {
          const type = SOCIONIC_TYPES.find(candidate => candidate.id === typeId)!;
          const image = row.aspectIds.map(aspectId => type.modelA.find(p => p.aspectId === aspectId)!.functionId);
          image.forEach(functionId => expect(row.functionIds, `${formulaId}:${typeId}:${row.aspectText}`).toContain(functionId));
          if (row.aspectIds.length === 2) expect([...image].sort()).toEqual([...row.functionIds].sort());
        });
      }));
    });
  });

  it('keeps DOCX audit extraction aligned with all transferred formulas', () => {
    const docxBlocks = extractDirectTetrachotomySourceBlocks();
    const docxFormulaIds = new Set(docxBlocks.map(block => block.formulaId));

    expect(docxBlocks).toHaveLength(140);
    SOURCE_BLOCK_FORMULA_IDS.forEach(formulaId => {
      expect(docxFormulaIds.has(formulaId)).toBe(true);
    });
  });

  it('keeps direct rows in their own DOCX sections despite paired-formula references', () => {
    const docxBlocks = extractDirectTetrachotomySourceBlocks();
    SOURCE_BLOCK_FORMULA_IDS.forEach(formulaId => {
      const formula = getTetrachotomyFormulaById(formulaId)!;
      expect(groupSetKeys(docxBlocks.filter(block => block.formulaId === formulaId).map(block => block.typeIds)), formulaId)
        .toEqual(groupSetKeys(formula.sourceBlocks!.map(block => block.sourceGroupCorrection?.sourceTypeIds ?? block.typeIds)));
    });
    expect(docxBlocks.filter(block => block.formulaId === 'tetra-13').map(block => block.typeIds)).toEqual([
      ['ILE', 'LSI', 'ESI', 'IEE'],
      ['SEI', 'EII', 'LIE', 'SLI'],
      ['ESE', 'IEI', 'ILI', 'LSE'],
      ['LII', 'SLE', 'SEE', 'EII'],
    ]);
    expect(docxBlocks.filter(block => block.formulaId === 'tetra-07')).toHaveLength(4);
  });

  it('rejects matching rows belonging to a different formula section', () => {
    const docxBlocks = extractDirectTetrachotomySourceBlocks().map(block => (
      block.formulaId === 'tetra-03' ? { ...block, formulaId: 'tetra-35' } : block
    ));
    expect(auditCurrentSourceBlocks(docxBlocks)).toContain(
      'tetra-03: groups-ok; docx-mismatch missing=4 rows=0; blocks=4',
    );
  });

  it('audits corrected groups against their literal DOCX origin without normalizing the source', () => {
    const docxBlocks = extractDirectTetrachotomySourceBlocks();
    const audit = auditCurrentSourceBlocks(docxBlocks);
    AUTHOR_CONFIRMED_SOURCE_BLOCK_FORMULA_IDS.forEach(id => {
      expect(audit).toContain(`${id}: groups-ok; docx-rows-ok; author-confirmed-groups=1; blocks=4`);
    });
    const normalizedSource = docxBlocks.map(block => (
      block.formulaId === 'tetra-07' && block.typeIds.includes('SEI')
        ? { ...block, typeIds: ['SEI', 'IEI', 'ILI', 'SLI'] as typeof block.typeIds }
        : block
    ));
    expect(auditCurrentSourceBlocks(normalizedSource)).toContain(
      'tetra-07: groups-ok; docx-mismatch missing=1 rows=0; blocks=4',
    );
  });

  it('keeps source blocks aligned with extract groups and registered domain IDs', () => {
    const aspectIds = new Set(ASPECTS.map(aspect => aspect.id));
    const aspectIdByName = new Map(ASPECTS.map(aspect => [aspect.name, aspect.id]));
    const functionIds = new Set(FUNCTIONS.map(fn => fn.id));
    const typeIds = new Set(SOCIONIC_TYPE_ORDER);

    SOURCE_BLOCK_FORMULA_IDS.forEach(formulaId => {
      const formula = getTetrachotomyFormulaById(formulaId);

      expect(formula?.sourceBlocks).toHaveLength(4);
      expect(groupSetKeys(formula?.sourceBlocks?.map(block => block.typeIds) ?? [])).toEqual(
        groupSetKeys(formula?.groups.map(group => group.typeIds) ?? []),
      );

      formula?.sourceBlocks?.forEach(block => {
        expect(block.status).toBe('extracted');
        expect(block.typeIds).toHaveLength(4);
        expect(block.rows.length).toBeGreaterThan(0);
        block.typeIds.forEach(typeId => {
          expect(typeIds.has(typeId)).toBe(true);
        });

        block.rows.forEach(row => {
          expect(row.aspectText.length).toBeGreaterThan(0);
          expect(row.aspectFeaturesText.length).toBeGreaterThan(0);
          expect(row.functionFeaturesText.length).toBeGreaterThan(0);
          expect(row.aspectIds).toHaveLength(row.aspectText.split(' ').length);
          expect(row.aspectIds).toEqual(
            row.aspectText.split(' ').map(aspectName => aspectIdByName.get(aspectName)),
          );
          expect(new Set(row.aspectIds).size).toBe(row.aspectIds.length);
          expect(new Set(row.functionIds).size).toBe(row.functionIds.length);
          row.aspectIds.forEach(aspectId => {
            expect(aspectIds.has(aspectId)).toBe(true);
          });
          row.functionIds.forEach(functionId => {
            expect(functionIds.has(functionId)).toBe(true);
          });
        });
      });
    });
  });

  it('requires every transferred source placement to agree with Model A after the approved tetra-28 correction', () => {
    expect(getSourceModelAssignmentMismatches()).toEqual([]);
  });

  it('selects exactly each declared tetra-28 group among all 16 Model A assignments', () => {
    const formula = getTetrachotomyFormulaById('tetra-28')!;
    formula.sourceBlocks!.forEach(block => {
      const matchingTypes = SOCIONIC_TYPES.filter(type => block.rows.every(row => {
        const image = row.aspectIds.map(aspectId => type.modelA.find(position => position.aspectId === aspectId)!.functionId);
        return sortedSetKey(image.map(String)) === sortedSetKey(row.functionIds.map(String));
      })).map(type => type.id);
      expect(sortedSetKey(matchingTypes)).toBe(sortedSetKey(block.typeIds));
    });
  });

  it('rejects unapproved corrections even when corrected groups still match the extract', () => {
    const original = getTetrachotomyFormulaById('tetra-07')!;
    const mutated = {
      ...original,
      sourceBlocks: original.sourceBlocks!.map(block => (
        block.sourceGroupCorrection ? {
          ...block,
          sourceGroupCorrection: { ...block.sourceGroupCorrection, confirmedOn: '2026-10-01' },
        } : block
      )),
    };
    expect(auditCurrentSourceBlocks(extractDirectTetrachotomySourceBlocks(), [mutated])).toContain(
      'tetra-07: groups-ok; docx-mismatch missing=1 rows=0; blocks=4',
    );
  });

  it('keeps source-block coverage explicit instead of silently adding partial rows', () => {
    const formulaIdsWithSourceBlocks = new Set(SOURCE_BLOCK_FORMULA_IDS);

    TETRACHOTOMY_FORMULAS.forEach(formula => {
      const sourceBlocks = getTetrachotomyFormulaSourceBlocks(formula);

      if (formulaIdsWithSourceBlocks.has(formula.id)) {
        expect(sourceBlocks).toHaveLength(4);
        return;
      }

      expect(sourceBlocks).toEqual([]);
      expect(formula.sourceBlocks).toBeUndefined();
    });
  });

  it('treats every source formula as a rank-2 tetrachotomy basis', () => {
    TETRACHOTOMY_FORMULAS.forEach(formula => {
      expect(formula.basisTraitIds).not.toContain(formula.targetTraitId);
      expect(new Set([formula.targetTraitId, ...formula.basisTraitIds]).size).toBe(3);
      expect(rankTraitVectors(formula.basisTraitIds)).toBe(2);
    });
  });

  it('matches source groups to computed partition classes regardless of class order', () => {
    TETRACHOTOMY_FORMULAS.forEach(formula => {
      const sourceGroups = formula.groups.map(group => group.typeIds);
      const computedGroups = getComputedTetrachotomyClassTypeSets(formula);

      expect(groupSetKeys(sourceGroups)).toEqual(groupSetKeys(computedGroups));
    });
  });
});
