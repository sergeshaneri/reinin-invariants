import { describe, expect, it } from 'vitest';
import {
  auditCurrentSourceBlocks,
  extractDirectTetrachotomySourceBlocks,
  getSourceModelAssignmentMismatches,
} from '../../scripts/audit-tetrachotomy-docx';
import {
  TETRACHOTOMY_FORMULAS,
  getComputedTetrachotomyClassTypeSets,
  getTetrachotomyFormulaById,
} from './tetrachotomies';
import { ASPECTS } from './socionics';
import { SOCIONIC_TYPES } from './types';

const ELIGIBLE_IDS = [
  'tetra-09', 'tetra-10', 'tetra-11', 'tetra-15', 'tetra-16', 'tetra-17',
  'tetra-24', 'tetra-25', 'tetra-30', 'tetra-31', 'tetra-34', 'tetra-35',
];
const setKey = (ids: readonly (string | number)[]): string => [...ids].sort().join('|');
const docxBlocks = extractDirectTetrachotomySourceBlocks();

 describe('literal order-dependent (2→4)×4 source transfers', () => {
  it.each(ELIGIBLE_IDS)('binds %s to its own ordered literal DOCX section without corrections', id => {
    const formula = getTetrachotomyFormulaById(id)!;
    const literal = docxBlocks.filter(block => block.formulaId === id);
    expect(literal).toHaveLength(4);
    expect(formula.sourceBlocks).toEqual(literal.map(block => ({
      typeIds: block.typeIds, labels: block.labels, rows: block.rows, status: 'extracted',
    })));
    expect(formula.sourceBlocks!.map(block => setKey(block.typeIds)).sort()).toEqual(
      getComputedTetrachotomyClassTypeSets(formula).map(setKey).sort(),
    );
    formula.sourceBlocks!.forEach(block => expect(block.sourceGroupCorrection).toBeUndefined());
    expect(auditCurrentSourceBlocks(docxBlocks)).toContain(`${id}: groups-ok; docx-ok; blocks=4`);
  });

  it.each(ELIGIBLE_IDS)('validates %s dyad incidences independently of literal transcription', id => {
    const formula = getTetrachotomyFormulaById(id)!;
    expect(formula.sourceBlocks).toHaveLength(4);
    formula.sourceBlocks!.forEach(block => {
      expect(block.typeIds).toHaveLength(4);
      expect(block.rows).toHaveLength(4);
      expect(setKey(block.rows.flatMap(row => row.aspectIds))).toBe(setKey(ASPECTS.map(aspect => aspect.id)));
      block.rows.forEach(row => {
        expect(row.aspectIds).toHaveLength(2);
        expect(new Set(row.aspectIds).size).toBe(2);
        expect(row.functionIds).toHaveLength(4);
        expect(new Set(row.functionIds).size).toBe(4);
      });
      block.typeIds.forEach(typeId => {
        const type = SOCIONIC_TYPES.find(candidate => candidate.id === typeId)!;
        const images = block.rows.map(row => {
          const image = row.aspectIds.map(aspectId => type.modelA.find(position => position.aspectId === aspectId)!.functionId);
          expect(new Set(image).size, `${id}:${typeId}:${row.aspectText}`).toBe(2);
          // Two positions are contained in a tetrad, not equal to its four positions.
          image.forEach(functionId => expect(row.functionIds, `${id}:${typeId}:${row.aspectText}`).toContain(functionId));
          return image;
        });
        expect(setKey(images.flat())).toBe(setKey([1, 2, 3, 4, 5, 6, 7, 8]));
      });
    });
    expect(getSourceModelAssignmentMismatches([formula])).toEqual([]);
  });

  it('rejects identical rows attributed to another section', () => {
    const reassigned = docxBlocks.map(block => block.formulaId === 'tetra-09'
      ? { ...block, formulaId: 'tetra-10' } : block);
    expect(auditCurrentSourceBlocks(reassigned)).toContain(
      'tetra-09: groups-ok; docx-mismatch missing=4 rows=0; blocks=4',
    );
  });

  it('keeps the approved primary tetra-31 LSI correction literal and mismatch-free', () => {
    const formula = getTetrachotomyFormulaById('tetra-31')!;
    const literal = docxBlocks.filter(block => block.formulaId === formula.id);
    expect(literal).toHaveLength(4);
    expect(literal[2].typeIds).toEqual(['ESE', 'LSI', 'ILI', 'IEE']);
    expect(formula.groups[2].typeIds).toEqual(literal[2].typeIds);
    expect(formula.sourceBlocks).toHaveLength(4);
    const candidate = { ...formula, sourceBlocks: literal.map(block => ({
      typeIds: block.typeIds, labels: block.labels, rows: block.rows, status: 'extracted' as const,
    })) };
    expect(getSourceModelAssignmentMismatches([candidate])).toEqual([]);
    expect(auditCurrentSourceBlocks(docxBlocks, [candidate])).toContain(
      'tetra-31: groups-ok; docx-ok; blocks=4',
    );
  });

  it('keeps the final inventory at 32 bound formulas and three explicit fallbacks', () => {
    expect(TETRACHOTOMY_FORMULAS.filter(formula => formula.sourceBlocks)).toHaveLength(32);
    expect(TETRACHOTOMY_FORMULAS.filter(formula => !formula.sourceBlocks).map(formula => formula.id)).toEqual([
      'tetra-05', 'tetra-26', 'tetra-27',
    ]);
    const blocks = ELIGIBLE_IDS.flatMap(id => getTetrachotomyFormulaById(id)!.sourceBlocks ?? []);
    expect(blocks).toHaveLength(48);
    expect(blocks.flatMap(block => block.rows)).toHaveLength(192);
  });
});
