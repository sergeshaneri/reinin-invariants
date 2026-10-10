import { describe, expect, it } from 'vitest';
import { ASPECTS, MODEL_A_LAYOUT, REININ_TRAITS, type AspectId, type View } from './socionics';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from './memberships';
import { SOCIONIC_TYPE_ORDER, SOCIONIC_TYPES_BY_ID } from './types';
import { selectTypeModelView } from './selectors';
import { analyzeTypeArpStructure, selectTypeArpExample } from './typeArp';

const sortIds = (ids: readonly number[]) => [...ids].sort((a, b) => a - b);
const equalSet = <T>(left: readonly T[], right: readonly T[]) => (
  left.length === right.length && left.every(value => right.includes(value))
);
const cases = SOCIONIC_TYPE_ORDER.flatMap(typeId => REININ_TRAITS.flatMap(trait => {
  const poles = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[trait.id].poles.filter(pole => pole.typeIds.includes(typeId));
  if (poles.length !== 1) throw new Error(`Non-unique membership ${typeId}/${trait.id}`);
  const poleIndex = poles[0].poleIndex;
  return trait.poles[poleIndex].views.map((view, viewIndex) => ({
    typeId, trait, poleIndex, view, viewIndex, label: `${typeId}/${trait.id}/${poleIndex}/${viewIndex}`,
  }));
}));

// Oracle uses modelA and source View directly, not another selector's analysis.
const image = (typeId: typeof SOCIONIC_TYPE_ORDER[number], ids: readonly AspectId[]) => sortIds(
  SOCIONIC_TYPES_BY_ID[typeId].modelA.filter(cell => ids.includes(cell.aspectId)).map(cell => cell.functionId),
);

describe('exhaustive registered type/trait/view contract', () => {
  it('covers every registered available view and does not mutate any registry', () => {
    const before = JSON.stringify([SOCIONIC_TYPES_BY_ID, REININ_TRAITS, TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID]);
    expect(cases).toHaveLength(320);
    expect(new Set(cases.map(entry => entry.label)).size).toBe(cases.length);
    cases.forEach(({ typeId, trait, viewIndex }) => selectTypeArpExample(typeId, trait.id, viewIndex));
    expect(JSON.stringify([SOCIONIC_TYPES_BY_ID, REININ_TRAITS, TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID])).toBe(before);
  });

  it.each(cases)('$label: assignments, images, tones, gallery and independent structural proof', ({ typeId, trait, poleIndex, view, viewIndex }) => {
    const example = selectTypeArpExample(typeId, trait.id, viewIndex);
    expect(example).toEqual(selectTypeArpExample(typeId, trait.id, viewIndex));
    expect(example.type.id).toBe(typeId);
    expect(example.trait.id).toBe(trait.id);
    expect(example.pole).toEqual({ poleIndex, name: trait.poles[poleIndex].name, description: trait.poles[poleIndex].description });
    expect(example.viewIndex).toBe(viewIndex);
    expect(example.views).toBe(trait.poles[poleIndex].views);
    expect(example.view).toBe(view);
    expect(example.generalView).toEqual({ mode: 'trait', traitId: trait.id, poleIndex, viewIndex });
    expect(example.assignments.map(cell => cell.functionId)).toEqual(MODEL_A_LAYOUT);
    expect(example.assignments).toHaveLength(8);
    expect(new Set(example.assignments.map(cell => cell.aspectId))).toEqual(new Set(ASPECTS.map(aspect => aspect.id)));
    for (const cell of example.assignments) {
      expect(SOCIONIC_TYPES_BY_ID[typeId].modelA.find(raw => raw.functionId === cell.functionId)?.aspectId).toBe(cell.aspectId);
      const groupIndex = view.mappings.findIndex(mapping => mapping.aspects.includes(cell.aspectId)
        && (view.isBlockPermutation || mapping.functions.includes(cell.functionId)));
      expect(cell.highlightGroupIndex).toBe(groupIndex < 0 ? null : groupIndex);
      expect(cell.isHighlighted).toBe(groupIndex >= 0);
    }
    expect(example.groups).toHaveLength(view.mappings.length);
    for (const [index, mapping] of view.mappings.entries()) {
      const group = example.groups[index];
      const actual = image(typeId, mapping.aspects);
      expect(group.aspectIds).toEqual(mapping.aspects);
      expect(group.actualFunctionIds).toEqual(actual);
      expect(group.groupIndex).toBe(index);
      expect(group.highlightGroupIndex).toBe(index);
      expect(sortIds(group.relatedCells.map(cell => cell.functionId))).toEqual(actual);
      expect(group.explanation).toContain(`{${actual.join(', ')}}`);
      expect(group.satisfied).toBe(true);
      group.relatedCells.forEach(cell => expect(example.assignments.find(candidate => candidate.functionId === cell.functionId)?.highlightGroupIndex).toBe(index));
      if (view.isBlockPermutation) {
        const target = view.mappings.findIndex(candidate => equalSet(candidate.functions, actual));
        expect(target).toBeGreaterThanOrEqual(0);
        expect(group.matchedFunctionBlock).toMatchObject({ blockIndex: target, functionIds: sortIds(view.mappings[target].functions) });
        expect(group.allowedFunctionIds).toBeNull();
        expect(group.allowedFunctionBlocks.map(block => block.functionIds)).toEqual(view.mappings.map(candidate => sortIds(candidate.functions)));
        expect(group.relation).toBe('block-equality');
      } else {
        expect(actual.every(id => mapping.functions.includes(id))).toBe(true);
        expect(group.allowedFunctionIds).toEqual(sortIds(mapping.functions));
        expect(group.relation).toBe(mapping.aspects.length === mapping.functions.length ? 'equality' : 'containment');
        if (group.relation === 'equality') expect(actual).toEqual(sortIds(mapping.functions));
      }
    }
    expect(example.structuralCheck).toMatchObject({ status: 'passed', satisfied: true, diagnostics: [] });
    expect(example.semanticKind).toBe(trait.id === 'process' ? 'cyclic-order' : view.isBlockPermutation ? 'block-permutation' : 'fixed-mapping');
    const expectedTypes = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[trait.id].poles[poleIndex].typeIds;
    expect(example.typesPanel.types.map(type => type.id)).toEqual(expectedTypes);
    expect(example.typesPanel.previews.map(preview => preview.type.id)).toEqual(expectedTypes);
    expect(new Set(example.typesPanel.types.map(type => type.id)).size).toBe(expectedTypes.length);
    expect(example.typesPanel.previews.find(preview => preview.type.id === typeId)?.assignments).toEqual(example.assignments);
    for (const preview of example.typesPanel.previews) {
      for (const cell of preview.assignments) {
        expect(SOCIONIC_TYPES_BY_ID[preview.type.id].modelA.find(raw => raw.functionId === cell.functionId)?.aspectId).toBe(cell.aspectId);
        const index = view.mappings.findIndex(mapping => mapping.aspects.includes(cell.aspectId)
          && (view.isBlockPermutation || mapping.functions.includes(cell.functionId)));
        expect(cell.highlightGroupIndex).toBe(index < 0 ? null : index);
      }
    }
    if (trait.id === 'process') {
      const tacts = [[3, 5], [4, 6], [1, 7], [2, 8]];
      const targets = view.mappings.map(mapping => tacts.findIndex(tact => equalSet(tact, image(typeId, mapping.aspects))));
      expect(targets.every((target, index) => target === (targets[0] + index) % 4)).toBe(true);
      expect(example.structuralCheck.cycle?.phase).toBe(targets[0]);
      expect(example.structuralCheck.cyclicOrder).toBe(true);
      expect(example.assignments.every(cell => cell.isHighlighted)).toBe(true);
      expect(new Set(example.assignments.map(cell => cell.highlightGroupIndex)).size).toBe(4);
    }
  });

  it.each(SOCIONIC_TYPE_ORDER)('%s: rejects every opposite-pole View independently of membership', typeId => {
    for (const trait of REININ_TRAITS) {
      const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[trait.id];
      const selected = membership.poles.find(pole => pole.typeIds.includes(typeId))!.poleIndex;
      for (const view of trait.poles[selected === 0 ? 1 : 0].views) {
        const check = analyzeTypeArpStructure(selectTypeModelView(typeId).assignments, view).structuralCheck;
        expect(check.status, `${typeId}/${trait.id}`).toBe('failed');
        expect(check.satisfied).toBe(false);
        expect(check.diagnostics.length).toBeGreaterThan(0);
      }
    }
  });

  it.each(SOCIONIC_TYPE_ORDER)('%s: normalizes every trait view index including non-integers', typeId => {
    for (const trait of REININ_TRAITS) {
      const example = selectTypeArpExample(typeId, trait.id);
      for (const invalid of [-1, 0.5, Number.NaN, Infinity, -Infinity, example.views.length, 999]) {
        expect(selectTypeArpExample(typeId, trait.id, invalid).viewIndex).toBe(0);
      }
      example.views.forEach((_, index) => expect(selectTypeArpExample(typeId, trait.id, index).viewIndex).toBe(index));
    }
  });
});

const permutations = (values: readonly number[]): number[][] => values.length === 0 ? [[]]
  : values.flatMap((value, index) => permutations(values.filter((_, candidate) => candidate !== index)).map(rest => [value, ...rest]));

describe('independent structural edge cases', () => {
  it('keeps singleton-to-pair as containment rather than equality', () => {
    const view: View = { title: '', mappings: [{ aspects: ['Ne'], functions: [1, 2] }] };
    const analysis = analyzeTypeArpStructure(selectTypeModelView('ILE').assignments, view);
    expect(analysis.groups[0]).toMatchObject({ actualFunctionIds: [1], allowedFunctionIds: [1, 2], relation: 'containment', satisfied: true });
    expect(analysis.groups[0].explanation).toContain('принадлежность');
    expect(analysis.groups[0].explanation).not.toContain('равенство');
    expect(analysis.structuralCheck.status).toBe('passed');
    view.mappings[0].functions = [2, 3];
    expect(analyzeTypeArpStructure(selectTypeModelView('ILE').assignments, view).structuralCheck.status).toBe('failed');
  });

  it('accepts exactly four common phases per direction out of all 24 whole-block permutations', () => {
    const macros: AspectId[][] = [['Ne', 'Ni'], ['Te', 'Ti'], ['Se', 'Si'], ['Fe', 'Fi']];
    const tacts = [[3, 5], [4, 6], [1, 7], [2, 8]];
    const views = REININ_TRAITS.find(trait => trait.id === 'process')!.poles.map(pole => pole.views[0]);
    const accepted = [0, 0];
    const phases = [new Set<number>(), new Set<number>()];
    const arrangements = permutations([0, 1, 2, 3]);
    expect(arrangements).toHaveLength(24);
    for (const targets of arrangements) {
      const assignments = selectTypeModelView('ILE').assignments.map(cell => {
        const macro = macros.findIndex(ids => ids.includes(cell.aspectId));
        return { ...cell, functionId: tacts[targets[macro]][macros[macro].indexOf(cell.aspectId)] };
      });
      for (const [poleIndex, view] of views.entries()) {
        const check = analyzeTypeArpStructure(assignments, view).structuralCheck;
        const direction = poleIndex === 0 ? 1 : -1;
        const expected = targets.every((target, index) => target === (targets[0] + direction * index + 4) % 4);
        expect(check.blockPreservation).toBe(true);
        expect(check.cyclicOrder).toBe(expected);
        expect(check.status).toBe(expected ? 'passed' : 'failed');
        if (expected) {
          accepted[poleIndex] += 1;
          phases[poleIndex].add(check.cycle!.phase!);
        } else expect(check.cycle?.phase).toBeNull();
      }
    }
    expect(accepted).toEqual([4, 4]);
    expect(phases.map(set => [...set].sort())).toEqual([[0, 1, 2, 3], [0, 1, 2, 3]]);
  });

  it('rejects split macroaspect blocks before claiming a cycle', () => {
    const view = REININ_TRAITS.find(trait => trait.id === 'process')!.poles[0].views[0];
    const assignments = selectTypeModelView('ILE').assignments.map(cell => ({ ...cell,
      aspectId: cell.aspectId === 'Ne' ? 'Se' as const : cell.aspectId === 'Se' ? 'Ne' as const : cell.aspectId,
    }));
    const check = analyzeTypeArpStructure(assignments, view).structuralCheck;
    expect(check).toMatchObject({ status: 'failed', blockPreservation: false, cyclicOrder: false, satisfied: false });
    expect(check.diagnostics.map(item => item.code)).toContain('block-not-preserved');
    expect(check.cycle?.phase).toBeNull();
  });

  it('rejects malformed models even if the displayed subset still satisfies its mapping', () => {
    const view: View = { title: '', mappings: [{ aspects: ['Ne'], functions: [1, 2] }] };
    const cells = selectTypeModelView('ILE').assignments;
    const invalidModels = [cells.slice(0, 7), [...cells, cells[0]], cells.map((cell, index) => index === 1 ? { ...cell, aspectId: cells[0].aspectId } : cell),
      cells.map((cell, index) => index === 1 ? { ...cell, functionId: cells[0].functionId } : cell),
      cells.map((cell, index) => index === 1 ? { ...cell, functionId: 99 } : cell)];
    for (const assignments of invalidModels) {
      const check = analyzeTypeArpStructure(assignments, view).structuralCheck;
      expect(check).toMatchObject({ status: 'failed', satisfied: false });
      expect(check.diagnostics.map(item => item.code)).toContain('invalid-model');
    }
  });

  it('reports unsupported conditions rather than substituting membership as proof', () => {
    const cells = selectTypeModelView('ILE').assignments;
    const invalidViews: View[] = [
      { title: '', mappings: [] },
      { title: '', mappings: [{ aspects: ['Ne', 'Ne'], functions: [1, 2] }] },
      { title: '', mappings: [{ aspects: ['Ne'], functions: [99] }] },
      { title: '', isBlockPermutation: true, mappings: [{ aspects: ['Ne'], functions: [1] }] },
      { title: '', connector: '~', mappings: [{ aspects: ['Ne'], functions: [1] }] },
    ];
    for (const view of invalidViews) {
      expect(analyzeTypeArpStructure(cells, view).structuralCheck).toMatchObject({ status: 'unsupported', satisfied: null });
    }
  });
});


describe('type ARP concrete analysis', () => {
  it('computes fixed set images without changing canonical assignments', () => {
    const example = selectTypeArpExample('ILE', 'vertness', 0);
    expect(example.semanticKind).toBe('fixed-mapping');
    expect(example.pole.poleIndex).toBe(0);
    expect(example.view).toBe(REININ_TRAITS.find(trait => trait.id === 'vertness')!.poles[0].views[0]);
    expect(example.assignments.map(({ functionId, aspectId }) => ({ functionId, aspectId })).sort((a, b) => a.functionId - b.functionId))
      .toEqual(SOCIONIC_TYPES_BY_ID.ILE.modelA);
    expect(example.groups[0]).toMatchObject({
      groupIndex: 0, highlightGroupIndex: 0,
      aspectIds: ['Ne', 'Fe', 'Te', 'Se'],
      actualFunctionIds: [1, 3, 6, 8], allowedFunctionIds: [1, 3, 6, 8], relation: 'equality', satisfied: true,
    });
    expect(example.structuralCheck).toMatchObject({ status: 'passed', satisfied: true, diagnostics: [] });
  });

  it('matches actual target blocks, not mapping row indices', () => {
    const example = selectTypeArpExample('SEI', 'democracy', 0);
    expect(example.semanticKind).toBe('block-permutation');
    expect(example.groups.map(group => group.matchedFunctionBlock?.blockIndex)).toEqual([2, 3, 0, 1]);
    expect(example.groups[0]).toMatchObject({
      highlightGroupIndex: 0, actualFunctionIds: [5, 6], allowedFunctionIds: null,
      relation: 'block-equality', satisfied: true,
    });
    expect(example.groups[0].allowedFunctionBlocks).toHaveLength(4);
    expect(example.structuralCheck).toMatchObject({ status: 'passed', blockPreservation: true, cyclicOrder: null });
  });

  it('checks a common free cyclic phase with the registered tact and ring directions', () => {
    const example = selectTypeArpExample('ILE', 'process', 0);
    expect(example.semanticKind).toBe('cyclic-order');
    expect(example.structuralCheck).toMatchObject({
      status: 'passed', blockPreservation: true, cyclicOrder: true,
      cycle: {
        phase: 2, expectedGroupOrder: [0, 1, 2, 3], actualGroupOrder: [2, 3, 0, 1],
        explanation: 'Обход тактов 1 → 2 → 3 → 4: Сенсорика → Этика → Интуиция → Логика → Сенсорика. Общая циклическая фаза: группа «Интуиция» начинается с такта 3.',
        tacts: [
          { label: '1-й такт', functionIds: [3, 5] }, { label: '2-й такт', functionIds: [4, 6] },
          { label: '3-й такт', functionIds: [1, 7] }, { label: '4-й такт', functionIds: [2, 8] },
        ],
        rings: [{ direction: 'cw', functionIds: [1, 2, 3, 4] }, { direction: 'ccw', functionIds: [5, 6, 7, 8] }],
      },
    });
  });

  it('rejects wrong cyclic direction even when all four whole blocks are preserved', () => {
    const assignments = selectTypeModelView('ILE').assignments;
    const resultView = REININ_TRAITS.find(trait => trait.id === 'process')!.poles[1].views[0];
    const analysis = analyzeTypeArpStructure(assignments, resultView);
    expect(analysis.structuralCheck).toMatchObject({ status: 'failed', satisfied: false, blockPreservation: true, cyclicOrder: false });
    expect(analysis.structuralCheck.diagnostics.map(item => item.code)).toContain('cycle-order-violation');
  });
});
