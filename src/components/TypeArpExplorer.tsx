import React, { useState } from 'react';
import type { TypeArpState } from '../appState';
import { REININ_TRAITS, type ReininTraitId, type SocionicTypeId } from '../data/socionics';
import { selectTypeArpExample, type TypeArpExampleViewModel } from '../data/typeArp';
import { resolveActiveArpGroup, togglePinnedArpGroup, type TypeArpAction } from '../typeArpState';
import { TypeModelDiagram } from '../diagrams/TypeModelDiagram';
import type { AspectDisplayMode } from './AspectGlyph';
import { FormulaPanel } from './FormulaPanel';
import { PartitionTypesPanel } from './PartitionTypesPanel';
import { TypeArpExplanation } from './TypeArpExplanation';
import { ViewSelector } from './ViewSelector';

export interface TypeArpExplorerProps {
  typeId: SocionicTypeId;
  state: TypeArpState | undefined;
  fallbackTraitId: ReininTraitId;
  aspectDisplayMode: AspectDisplayMode;
  onAction: (action: TypeArpAction) => void;
  onSelectType: (typeId: SocionicTypeId) => void;
  onOpenGeneral: () => void;
}

export const TypeArpExplorer: React.FC<TypeArpExplorerProps> = (props) => {
  const { typeId, state, fallbackTraitId, aspectDisplayMode, onAction } = props;
  const example = state?.isOpen ? selectTypeArpExample(typeId, state.traitId, state.viewIndex) : null;
  return (
    <section className="space-y-5 md:space-y-6" data-type-arp-explorer>
      <button type="button" className="shell-control min-h-10 rounded-xl border px-4 py-2 text-sm"
        aria-expanded={Boolean(example)} aria-controls="type-arp-analysis"
        onClick={() => onAction(example ? { kind: 'close' } : { kind: 'open', fallbackTraitId })}>
        {example ? 'Скрыть АРП' : 'Посмотреть АРП на примере этого типа'}
      </button>
      {example ? (
        <OpenTypeArp {...props} example={example} />
      ) : <>
        <TypeModelDiagram typeId={typeId} aspectDisplayMode={aspectDisplayMode} />
        <div id="type-arp-analysis" hidden />
      </>}
    </section>
  );
};

const OpenTypeArp: React.FC<TypeArpExplorerProps & { example: TypeArpExampleViewModel }> = ({
  typeId, example, aspectDisplayMode, onAction, onSelectType, onOpenGeneral,
}) => {
  const trait = REININ_TRAITS.find(candidate => candidate.id === example.trait.id)!;
  return (
    <div id="type-arp-analysis" className="space-y-5 md:space-y-6" data-type-arp-pole-index={example.pole.poleIndex}>
      <div className="shell-panel space-y-3 rounded-2xl border p-4">
        <h2 className="font-bold">АРП на примере типа: {example.type.name}</h2>
        <label className="flex min-w-0 flex-col gap-2">
          <span className="eyebrow">Признак АРП</span>
          <select className="shell-control min-h-10 w-full rounded-xl border px-3 py-2 text-sm"
            data-type-arp-trait-select value={example.trait.id}
            onChange={event => {
              const selected = REININ_TRAITS.find(candidate => candidate.id === event.target.value);
              if (selected) onAction({ kind: 'trait', traitId: selected.id });
            }}>
            {REININ_TRAITS.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
          </select>
        </label>
        <p className="text-sm"><strong>{example.pole.name}</strong> — Показано для выбранного типа</p>
      </div>
      {example.views.length > 1 ? <ViewSelector views={[...example.views]} activeViewIndex={example.viewIndex}
        onSelect={viewIndex => onAction({ kind: 'view', viewIndex })} /> : null}
      <TypeArpModel key={`${typeId}:${example.trait.id}:${example.viewIndex}`}
        example={example} aspectDisplayMode={aspectDisplayMode} />
      <details className="glass-panel rounded-[28px]" data-type-arp-general-condition>
        <summary className="cursor-pointer px-5 py-4 text-sm">Общее структурное условие АРП</summary>
        <div className="space-y-4 border-t border-[var(--color-shell-border)] p-5">
          <FormulaPanel trait={trait} view={example.view} aspectDisplayMode={aspectDisplayMode} />
          <p className="text-sm leading-relaxed text-[var(--color-shell-muted)]">{example.view.description ?? example.pole.description}</p>
        </div>
      </details>
      <PartitionTypesPanel view={example.typesPanel} activeView={example.view} aspectDisplayMode={aspectDisplayMode}
        selectedTypeId={typeId} onSelectType={onSelectType} />
      <button type="button" className="shell-control min-h-10 rounded-xl border px-4 py-2 text-sm" onClick={onOpenGeneral}>
        Открыть общее представление АРП
      </button>
    </div>
  );
};

/** Reset local hover/pin synchronously, without remounting focused selectors. */
const TypeArpModel: React.FC<{ example: TypeArpExampleViewModel; aspectDisplayMode: AspectDisplayMode }> = ({
  example, aspectDisplayMode,
}) => {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [focusedGroup, setFocusedGroup] = useState<number | null>(null);
  const [pinnedGroup, setPinnedGroup] = useState<number | null>(null);
  const activeGroup = resolveActiveArpGroup(focusedGroup ?? hoveredGroup, pinnedGroup);
  const selectGroup = (groupIndex: number) => setPinnedGroup(current => togglePinnedArpGroup(current, groupIndex));
  return <>
    <TypeModelDiagram typeId={example.type.id} aspectDisplayMode={aspectDisplayMode} arpExample={example}
      activeArpGroupIndex={activeGroup} pinnedArpGroupIndex={pinnedGroup} onArpGroupHover={setHoveredGroup} onArpGroupFocus={setFocusedGroup} onArpGroupSelect={selectGroup} />
    <TypeArpExplanation example={example} aspectDisplayMode={aspectDisplayMode}
      activeGroupIndex={activeGroup} pinnedGroupIndex={pinnedGroup} onGroupHover={setHoveredGroup} onGroupFocus={setFocusedGroup} onGroupSelect={selectGroup} />
  </>;
};
