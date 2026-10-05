import { describe, expect, it } from 'vitest';
import {
  auditCurrentSourceBlocks,
  extractDirectTetrachotomySourceBlocks,
  getSourceModelAssignmentMismatches,
} from '../../scripts/audit-tetrachotomy-docx';
import {
  TETRACHOTOMY_FORMULAS,
  getComputedTetrachotomyClassTypeSets,
} from './tetrachotomies';
import { SOCIONIC_TYPES } from './types';

const CRACY_FORMULA_IDS = [
  'tetra-02', 'tetra-08', 'tetra-14', 'tetra-20', 'tetra-21', 'tetra-22', 'tetra-23',
];
const cracyFormulas = TETRACHOTOMY_FORMULAS.filter(formula => (
  [formula.targetTraitId, ...formula.basisTraitIds].includes('democracy')
));
const setKey = (ids: readonly (string | number)[]): string => [...ids].sort().join('|');

 describe('literal cracy tetrachotomy source transfers', () => {
  it('binds all seven complete formulas to their own ordered literal DOCX groups and 56 rows', () => {
    const docxBlocks = extractDirectTetrachotomySourceBlocks();
    expect(cracyFormulas.map(formula => formula.id)).toEqual(CRACY_FORMULA_IDS);
    cracyFormulas.forEach(formula => {
      const literalBlocks = docxBlocks.filter(block => block.formulaId === formula.id);
      expect(literalBlocks, formula.id).toHaveLength(4);
      expect(formula.sourceBlocks, formula.id).toEqual(literalBlocks.map(block => ({
        typeIds: block.typeIds,
        labels: block.labels,
        rows: block.rows,
        status: 'extracted',
      })));
      expect(formula.groups).toHaveLength(4);
      expect(formula.source.formulaText).toContain('=');
      formula.sourceBlocks!.forEach((block, index) => {
        expect(setKey(block.typeIds)).toBe(setKey(formula.groups[index].typeIds));
        expect(block.sourceGroupCorrection).toBeUndefined();
        expect(block.rows).toHaveLength(2);
        block.rows.forEach(row => {
          expect(row.aspectIds).toHaveLength(4);
          expect(row.functionIds).toHaveLength(4);
          block.typeIds.forEach(typeId => {
            const type = SOCIONIC_TYPES.find(candidate => candidate.id === typeId)!;
            const image = row.aspectIds.map(aspectId => (
              type.modelA.find(position => position.aspectId === aspectId)!.functionId
            ));
            expect(setKey(image), `${formula.id}:${typeId}:${row.aspectText}`).toBe(setKey(row.functionIds));
          });
        });
      });
    });
    const blocks = cracyFormulas.flatMap(formula => formula.sourceBlocks ?? []);
    expect(blocks).toHaveLength(28);
    expect(blocks.flatMap(block => block.rows)).toHaveLength(56);
    expect(getSourceModelAssignmentMismatches()).toEqual([]);
    CRACY_FORMULA_IDS.forEach(id => {
      expect(auditCurrentSourceBlocks(docxBlocks)).toContain(`${id}: groups-ok; docx-ok; blocks=4`);
    });
  });

  it('rejects otherwise identical cracy rows attributed to a different formula section', () => {
    const misattributed = extractDirectTetrachotomySourceBlocks().map(block => (
      block.formulaId === 'tetra-02' ? { ...block, formulaId: 'tetra-08' } : block
    ));
    expect(auditCurrentSourceBlocks(misattributed)).toContain(
      'tetra-02: groups-ok; docx-mismatch missing=4 rows=0; blocks=4',
    );
  });

  it('matches every registered source-block group to the computed partition classes', () => {
    const formulas = TETRACHOTOMY_FORMULAS.filter(formula => formula.sourceBlocks);
    expect(formulas).toHaveLength(32);
    formulas.forEach(formula => {
      expect(formula.sourceBlocks!.map(block => setKey(block.typeIds)).sort(), formula.id).toEqual(
        getComputedTetrachotomyClassTypeSets(formula).map(setKey).sort(),
      );
    });
  });
});
