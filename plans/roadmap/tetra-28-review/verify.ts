import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  TETRACHOTOMY_FORMULAS,
  getComputedTetrachotomyClassTypeSets,
  getTetrachotomyFormulaById,
} from '../../../src/data/tetrachotomies';
import { SOCIONIC_TYPES, SOCIONIC_TYPE_ORDER } from '../../../src/data/types';
import {
  extractDirectTetrachotomySourceBlocks,
  getSourceModelAssignmentMismatches,
} from '../../../scripts/audit-tetrachotomy-docx';

// Verify the author-approved working source and app data; never write either.
const formula = getTetrachotomyFormulaById('tetra-28');
assert(formula?.sourceBlocks);
const sourceBlocks = formula.sourceBlocks;
const snapshot = JSON.stringify(TETRACHOTOMY_FORMULAS);
const key = (ids: readonly string[]) => [...ids].sort().join('|');
const numericOrder = (ids: readonly number[]) => [...ids].sort((a, b) => a - b);
const archiveBlob = execFileSync('git', [
  'rev-parse', '70acb99:harness/theory/tetrachotomy-source.docx',
], { encoding: 'utf8' }).trim();
assert.match(archiveBlob, /^[0-9a-f]{40}$/);

assert.equal(sourceBlocks.length, 4);
assert.deepEqual(sourceBlocks.map(block => key(block.typeIds)).sort(), getComputedTetrachotomyClassTypeSets(formula).map(key).sort());
assert.deepEqual(sourceBlocks.flatMap(block => block.typeIds).sort(), [...SOCIONIC_TYPE_ORDER].sort());
const docxBlocks = extractDirectTetrachotomySourceBlocks().filter(block => block.formulaId === formula.id);
assert.equal(docxBlocks.length, 4);
sourceBlocks.forEach(block => {
  const source = docxBlocks.find(candidate => key(candidate.typeIds) === key(block.typeIds));
  assert(source);
  assert.deepEqual(block.rows, source.rows);
  assert.deepEqual(block.labels, source.labels);
});

for (const expected of [
  { typeIds: ['ESE', 'LII', 'EIE', 'LSI'], aspectTexts: ['БЛ ЧЭ', 'ЧЛ БЭ'], features: ['бета альфа рациональные', 'дельта гамма рациональные'] },
  { typeIds: ['LIE', 'ESI', 'LSE', 'EII'], aspectTexts: ['ЧЛ БЭ', 'БЛ ЧЭ'], features: ['дельта гамма рациональные', 'бета альфа рациональные'] },
]) {
  const block = sourceBlocks.find(candidate => key(candidate.typeIds) === key(expected.typeIds));
  assert(block);
  assert.deepEqual(block.rows.slice(0, 2).map(row => row.aspectText), expected.aspectTexts);
  assert.deepEqual(block.rows.slice(0, 2).map(row => row.aspectFeaturesText), expected.features);
  assert.deepEqual(block.rows.slice(0, 2).map(row => row.functionIds), [[1, 5], [3, 7]]);
  assert.deepEqual(block.rows.slice(0, 2).map(row => row.functionFeaturesText), ['оценочные вербальные акцептные', 'ситуативные лаборные акцептные']);
}
assert.deepEqual(getSourceModelAssignmentMismatches(), []);

let checkedImages = 0;
let classificationDecisions = 0;
sourceBlocks.forEach(block => {
  const matchingTypeIds = SOCIONIC_TYPES.filter(type => {
    classificationDecisions += 1;
    return block.rows.every(row => {
      const placements = row.aspectIds.map(aspectId => type.modelA.find(position => position.aspectId === aspectId));
      if (placements.some(position => !position)) return false;
      return key(placements.map(position => String(position!.functionId))) === key(row.functionIds.map(String));
    });
  }).map(type => type.id);
  assert.deepEqual([...matchingTypeIds].sort(), [...block.typeIds].sort());
  block.rows.forEach(row => block.typeIds.forEach(typeId => {
    const type = SOCIONIC_TYPES.find(candidate => candidate.id === typeId);
    assert(type);
    const image = row.aspectIds.map(aspectId => {
      const assignment = type.modelA.find(position => position.aspectId === aspectId);
      assert(assignment);
      return assignment.functionId;
    });
    assert.deepEqual(numericOrder(image), numericOrder(row.functionIds));
    checkedImages += 1;
  }));
});
assert.equal(checkedImages, 48);
assert.equal(JSON.stringify(TETRACHOTOMY_FORMULAS), snapshot);
console.log(JSON.stringify({
  status: 'applied-author-approved-correction',
  originalArchiveCommit: '70acb99', originalArchiveBlob: archiveBlob,
  currentDocxGroups: docxBlocks.length,
  currentDocxRows: docxBlocks.flatMap(block => block.rows).length,
  currentCatalogPlacementMismatches: getSourceModelAssignmentMismatches().length,
  checkedTypes: new Set(sourceBlocks.flatMap(block => block.typeIds)).size,
  checkedGroupImages: checkedImages, classificationDecisions,
  verificationDoesNotMutateData: true,
}, null, 2));
