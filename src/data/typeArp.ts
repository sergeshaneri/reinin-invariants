import { ASPECTS, FUNCTIONS, REININ_TRAITS, type AspectId, type ReininTraitId, type View } from './socionics';
import type { PoleIndex } from './memberships';
import {
  selectDichotomyTypesPanelView, selectTypeModelPreviews, selectTypeModelView, selectTypeTraitExample,
  type PartitionTypesPanelViewModel, type TypeModelAssignmentViewModel,
  type TypeModelPreviewAssignmentViewModel, type TypeModelPreviewViewModel, type TypeTraitExampleViewModel,
} from './selectors';
import type { SocionicTypeId } from './types';

export type TypeArpSemanticKind = 'fixed-mapping' | 'block-permutation' | 'cyclic-order';
export interface TypeArpFunctionBlock {
  blockIndex: number;
  functionIds: readonly number[];
  label: string;
}
export interface TypeArpGroup {
  groupIndex: number;
  /** Identical to the existing mapping index / map-tone-N, never a target block index. */
  highlightGroupIndex: number;
  aspectIds: readonly AspectId[];
  aspectLabel: string;
  actualFunctionIds: readonly number[];
  /** Fixed mappings only; block permutations have no fixed allowed target. */
  allowedFunctionIds: readonly number[] | null;
  allowedFunctionBlocks: readonly TypeArpFunctionBlock[];
  matchedFunctionBlock: TypeArpFunctionBlock | null;
  relatedCells: readonly TypeModelAssignmentViewModel[];
  relation: 'equality' | 'containment' | 'block-equality';
  satisfied: boolean;
  explanation: string;
}
export interface TypeArpDiagnostic {
  code: 'invalid-model' | 'invalid-view' | 'fixed-mapping-violation' | 'block-not-preserved'
    | 'block-not-bijective' | 'cycle-order-violation' | 'unsupported-cycle';
  message: string;
  groupIndex?: number;
}
export interface TypeArpStructuralCheck {
  status: 'passed' | 'failed' | 'unsupported';
  satisfied: boolean | null;
  diagnostics: readonly TypeArpDiagnostic[];
  /** Null for fixed mappings, otherwise verified independently before checking cycle order. */
  blockPreservation: boolean | null;
  cyclicOrder: boolean | null;
  cycle: TypeArpCycle | null;
}
export interface TypeArpCycle {
  explanation: string;
  /** Expected macroaspect traversal is the active View's mapping order. */
  expectedGroupOrder: readonly number[];
  /** Actual groups in tact order 1,2,3,4; not forced to start with intuition. */
  actualGroupOrder: readonly number[];
  /** Zero-based tact containing group 0; the same phase must work for every block. */
  phase: number | null;
  tacts: readonly TypeArpFunctionBlock[];
  rings: readonly { direction: 'cw' | 'ccw'; functionIds: readonly number[] }[];
}
export interface TypeArpAnalysis {
  semanticKind: TypeArpSemanticKind;
  groups: readonly TypeArpGroup[];
  structuralCheck: TypeArpStructuralCheck;
}
export interface TypeArpExampleViewModel extends TypeTraitExampleViewModel, TypeArpAnalysis {
  viewIndex: number;
  view: View;
  views: readonly View[];
  assignments: readonly TypeModelPreviewAssignmentViewModel[];
  /** The existing panel contract, plus identically colored concrete previews. */
  typesPanel: PartitionTypesPanelViewModel & { previews: readonly TypeModelPreviewViewModel[] };
  generalView: { mode: 'trait'; traitId: ReininTraitId; poleIndex: PoleIndex; viewIndex: number };
}

const sorted = (values: readonly number[]): number[] => [...values].sort((a, b) => a - b);
const sameSet = <T>(left: readonly T[], right: readonly T[]): boolean => (
  left.length === right.length && new Set(left).size === left.length
  && new Set(right).size === right.length && left.every(value => right.includes(value))
);
const aspectLabel = (ids: readonly AspectId[]): string => ids.map(id => (
  ASPECTS.find(aspect => aspect.id === id)?.name ?? id
)).join(' + ');
const functionSet = (ids: readonly number[]): string => `{${ids.join(', ')}}`;

/**
 * Evaluate actual aspect images against a source View, with no type ID or membership input.
 * This is also the negative-test seam: changing a model cannot turn registry membership
 * into a structural proof. Related cells retain the original Model A presentation order.
 */
export function analyzeTypeArpStructure(
  assignments: readonly TypeModelAssignmentViewModel[],
  view: View,
): TypeArpAnalysis {
  const isBlockPermutation = view.isBlockPermutation === true;
  const isCycle = view.decoratorIds?.includes('process-cycle') === true || view.connector === '~';
  const semanticKind: TypeArpSemanticKind = isCycle ? 'cyclic-order'
    : isBlockPermutation ? 'block-permutation' : 'fixed-mapping';
  const functionBlocks: TypeArpFunctionBlock[] = view.mappings.map((mapping, blockIndex) => ({
    blockIndex, functionIds: sorted(mapping.functions),
    label: mapping.functionLabel ?? `Функции ${functionSet(sorted(mapping.functions))}`,
  }));
  const diagnostics: TypeArpDiagnostic[] = [];
  if (!sameSet(assignments.map(cell => cell.aspectId), ASPECTS.map(aspect => aspect.id))
    || !sameSet(assignments.map(cell => cell.functionId), FUNCTIONS.map(fn => fn.id))) {
    diagnostics.push({ code: 'invalid-model', message: 'Модель не является биекцией восьми аспектов и функций.' });
  }
  const validView = view.mappings.length > 0 && view.mappings.every(mapping => (
    mapping.aspects.length > 0 && mapping.functions.length > 0
    && new Set(mapping.aspects).size === mapping.aspects.length
    && new Set(mapping.functions).size === mapping.functions.length
    && mapping.aspects.every(id => ASPECTS.some(aspect => aspect.id === id))
    && mapping.functions.every(id => FUNCTIONS.some(fn => fn.id === id))
  ));
  const partitionsValid = !isBlockPermutation || (
    sameSet(view.mappings.flatMap(mapping => mapping.aspects), ASPECTS.map(aspect => aspect.id))
    && sameSet(view.mappings.flatMap(mapping => mapping.functions), FUNCTIONS.map(fn => fn.id))
  );
  if (!validView || !partitionsValid) diagnostics.push({ code: 'invalid-view', message: 'Представление содержит неполные или неизвестные группы либо не задаёт разбиения на блоки.' });
  const groups: TypeArpGroup[] = view.mappings.map((mapping, groupIndex) => {
    const relatedCells = assignments.filter(cell => mapping.aspects.includes(cell.aspectId));
    const actualFunctionIds = sorted(relatedCells.map(cell => cell.functionId));
    const allowedFunctionIds = isBlockPermutation ? null : sorted(mapping.functions);
    const matchedFunctionBlock = isBlockPermutation
      ? functionBlocks.find(block => sameSet(actualFunctionIds, block.functionIds)) ?? null : null;
    const relation = isBlockPermutation ? 'block-equality'
      : mapping.aspects.length === mapping.functions.length ? 'equality' : 'containment';
    const satisfied = relatedCells.length === mapping.aspects.length && (
      isBlockPermutation ? matchedFunctionBlock !== null
        : actualFunctionIds.every(id => mapping.functions.includes(id))
          && (relation !== 'equality' || sameSet(actualFunctionIds, mapping.functions))
    );
    if (!satisfied) diagnostics.push({
      code: isBlockPermutation ? 'block-not-preserved' : 'fixed-mapping-violation', groupIndex,
      message: isBlockPermutation ? 'Фактический образ не совпадает с целым функциональным блоком.' : 'Фактический образ не соответствует допустимым функциям.',
    });
    const label = mapping.aspectLabel ?? aspectLabel(mapping.aspects);
    return {
      groupIndex, highlightGroupIndex: groupIndex, aspectIds: [...mapping.aspects], aspectLabel: label,
      actualFunctionIds, allowedFunctionIds,
      allowedFunctionBlocks: isBlockPermutation ? functionBlocks : [], matchedFunctionBlock,
      relatedCells, relation, satisfied,
      explanation: isBlockPermutation
        ? `${label}: фактически функции ${functionSet(actualFunctionIds)}${matchedFunctionBlock ? ` — ${matchedFunctionBlock.label}` : '; целый допустимый блок не найден'}.`
        : `${label}: фактически функции ${functionSet(actualFunctionIds)}; допустимые функции ${functionSet(allowedFunctionIds!)} (${relation === 'equality' ? 'равенство множеств' : 'принадлежность допустимой группе'}).`,
    };
  });
  const blockPreservation = isBlockPermutation ? (
    !diagnostics.some(diagnostic => diagnostic.code === 'invalid-model' || diagnostic.code === 'invalid-view')
    && groups.every(group => group.satisfied)
    && new Set(groups.map(group => group.matchedFunctionBlock?.blockIndex)).size === functionBlocks.length
  ) : null;
  if (isBlockPermutation && !blockPreservation && groups.every(group => group.satisfied)) {
    diagnostics.push({ code: 'block-not-bijective', message: 'Образы не задают биекцию всех зарегистрированных блоков.' });
  }
  let cycle: TypeArpCycle | null = null;
  let cyclicOrder: boolean | null = null;
  if (isCycle) {
    // Both existing dotted rings traverse 1→2→3→4 / 5→6→7→8.
    // Their paired tacts traverse 3→4→1→2, equivalently 1→2→3→4
    // with a free common phase. These are conventions, NOT model assignments.
    const tactFunctions = [[3, 5], [4, 6], [1, 7], [2, 8]];
    const macroaspects: AspectId[][] = [['Ne', 'Ni'], ['Te', 'Ti'], ['Se', 'Si'], ['Fe', 'Fi']];
    const supported = isBlockPermutation && functionBlocks.length === 4
      && tactFunctions.every(ids => functionBlocks.some(block => sameSet(ids, block.functionIds)))
      && macroaspects.every(ids => view.mappings.some(mapping => sameSet(ids, mapping.aspects)));
    if (!supported) {
      diagnostics.push({ code: 'unsupported-cycle', message: 'Недостаточно данных для обхода четырёх макроаспектов по зарегистрированным тактам модели А.' });
    } else {
      const tacts = tactFunctions.map(ids => functionBlocks.find(block => sameSet(ids, block.functionIds))!);
      const actualGroupOrder = tacts.map(tact => groups.findIndex(group => sameSet(group.actualFunctionIds, tact.functionIds)));
      const targetTacts = groups.map(group => tacts.findIndex(tact => sameSet(group.actualFunctionIds, tact.functionIds)));
      // Never choose a separate shift per macroaspect: one shift for the full cycle.
      const candidatePhase = targetTacts[0];
      cyclicOrder = blockPreservation === true && targetTacts.every((tact, index) => (
        tact === (candidatePhase + index) % 4
      ));
      const actualLabels = actualGroupOrder.map(index => groups[index]?.aspectLabel ?? 'блок не сохранён');
      cycle = {
        explanation: `Обход тактов 1 → 2 → 3 → 4: ${[...actualLabels, actualLabels[0]].join(' → ')}. ${cyclicOrder
          ? `Общая циклическая фаза: группа «${groups[0].aspectLabel}» начинается с такта ${candidatePhase + 1}.`
          : 'Зарегистрированный циклический порядок не подтверждён.'}`,
        expectedGroupOrder: groups.map(group => group.groupIndex), actualGroupOrder,
        phase: cyclicOrder ? candidatePhase : null, tacts,
        rings: [{ direction: 'cw', functionIds: [1, 2, 3, 4] }, { direction: 'ccw', functionIds: [5, 6, 7, 8] }],
      };
      if (blockPreservation && !cyclicOrder) {
        diagnostics.push({ code: 'cycle-order-violation', message: 'Целые блоки сохранены, но зарегистрированный циклический порядок не выполняется ни с одной общей фазой.' });
      }
    }
  }
  const unsupported = diagnostics.some(diagnostic => diagnostic.code === 'invalid-view' || diagnostic.code === 'unsupported-cycle');
  return {
    semanticKind, groups,
    structuralCheck: {
      status: unsupported ? 'unsupported' : diagnostics.length ? 'failed' : 'passed',
      satisfied: unsupported ? null : diagnostics.length === 0, diagnostics,
      blockPreservation, cyclicOrder, cycle,
    },
  };
}

export function selectTypeArpExample(
  typeId: SocionicTypeId,
  traitId: ReininTraitId,
  viewIndex: number = 0,
): TypeArpExampleViewModel {
  const example = selectTypeTraitExample(typeId, traitId);
  const trait = REININ_TRAITS.find(candidate => candidate.id === traitId)!;
  const views = trait.poles[example.pole.poleIndex].views;
  const normalizedIndex = Number.isInteger(viewIndex) && viewIndex >= 0 && viewIndex < views.length ? viewIndex : 0;
  const view = views[normalizedIndex];
  if (!view) throw new Error(`Missing ARP view for ${traitId} pole ${example.pole.poleIndex}`);
  const model = selectTypeModelView(typeId);
  const panel = selectDichotomyTypesPanelView(traitId, example.pole.poleIndex);
  const previews = selectTypeModelPreviews(panel.types.map(type => type.id), view);
  const selectedPreview = previews.find(preview => preview.type.id === typeId);
  if (!selectedPreview) throw new Error(`Missing selected type ${typeId} in ARP gallery`);
  return {
    ...example, ...analyzeTypeArpStructure(model.assignments, view),
    viewIndex: normalizedIndex, view, views, assignments: selectedPreview.assignments,
    typesPanel: { ...panel, previews },
    generalView: { mode: 'trait', traitId, poleIndex: example.pole.poleIndex, viewIndex: normalizedIndex },
  };
}
