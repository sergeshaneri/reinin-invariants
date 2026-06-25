import React from 'react';
import { ChevronDown, Layers3 } from 'lucide-react';
import { REININ_TRAITS, type ReininTraitId, type View } from '../data/socionics';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID, type PoleIndex } from '../data/memberships';
import { selectPartitionTypesPanelView, type PartitionExplorerViewModel, type PartitionViewModel } from '../data/selectors';
import type { SocionicTypeId } from '../data/types';
import type { AspectDisplayMode } from './AspectGlyph';
import { PartitionCompositionView } from './PartitionCompositionView';
import { PartitionTypesPanel } from './PartitionTypesPanel';
import { TetrachotomyAspectFunctionPanel } from './TetrachotomyAspectFunctionPanel';
import { TetrachotomyFormulaPanel } from './TetrachotomyFormulaPanel';
import { TypePatternCard } from './TypePatternCard';

const CLASS_TONES = [
  'map-tone-0 text-[var(--color-map-fg)]',
  'map-tone-1 text-[var(--color-map-fg)]',
  'map-tone-2 text-[var(--color-map-fg)]',
  'map-tone-3 text-[var(--color-map-fg)]',
] as const;

const getTypeCode = (aliases: readonly string[], fallback: string): string => aliases[0] ?? fallback;

type SourceFormulaViewModel = NonNullable<PartitionExplorerViewModel['sourceFormula']>;
type SourceFormulaBlock = NonNullable<SourceFormulaViewModel['sourceBlocks']>[number];

const sortedTypeKey = (typeIds: readonly SocionicTypeId[]): string => (
  [...typeIds].sort().join('|')
);

const findSelectedSourceBlock = (
  sourceFormula: SourceFormulaViewModel | undefined,
  selectedClass: PartitionExplorerViewModel['selectedClass'],
): SourceFormulaBlock | null => {
  if (!sourceFormula?.sourceBlocks || !selectedClass) {
    return null;
  }

  const selectedKey = sortedTypeKey(selectedClass.types.map(type => type.id));

  return sourceFormula.sourceBlocks.find(block => (
    sortedTypeKey(block.typeIds) === selectedKey
  )) ?? null;
};

const getCommonTargetPole = (
  traitId: ReininTraitId | undefined,
  selectedClass: PartitionExplorerViewModel['selectedClass'],
): { traitId: ReininTraitId; poleIndex: PoleIndex; poleName: string } | null => {
  if (!traitId || !selectedClass) {
    return null;
  }

  const trait = REININ_TRAITS.find(candidate => candidate.id === traitId);
  const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[traitId];
  const firstTypeId = selectedClass.types[0]?.id;
  const pole = membership.poles.find(candidate => (
    firstTypeId ? candidate.typeIds.includes(firstTypeId) : false
  ));

  if (!trait || !pole || !selectedClass.types.every(type => pole.typeIds.includes(type.id))) {
    return null;
  }

  return {
    traitId,
    poleIndex: pole.poleIndex,
    poleName: trait.poles[pole.poleIndex].name,
  };
};

const getFirstClassPoleView = (view: PartitionExplorerViewModel): View | null => {
  const firstPole = view.selectedClass?.poles[0];
  if (!firstPole) {
    return null;
  }

  const trait = REININ_TRAITS.find(candidate => candidate.id === firstPole.trait.id);

  return trait?.poles[firstPole.poleIndex]?.views[0] ?? null;
};

interface Props {
  view: PartitionExplorerViewModel;
  aspectDisplayMode: AspectDisplayMode;
  onSelectClass: (classKey: string) => void;
}

export const TetrachotomyView: React.FC<Props> = ({
  view,
  aspectDisplayMode,
  onSelectClass,
}) => {
  const { partition, selectedClassKey } = view;
  const activeView = getFirstClassPoleView(view);
  const sourceBlock = findSelectedSourceBlock(view.sourceFormula, view.selectedClass);
  const sourceTargetPole = getCommonTargetPole(
    view.sourceFormula?.targetTrait.id,
    view.selectedClass,
  );

  if (!partition.ok || partition.kind !== 'tetrachotomy') {
    return (
      <PartitionCompositionView
        view={view}
        onSelectClass={onSelectClass}
      />
    );
  }

  const tetrachotomyPartition = partition as PartitionViewModel & { kind: 'tetrachotomy' };
  const typesPanelView = selectPartitionTypesPanelView(
    tetrachotomyPartition.traitIds,
    selectedClassKey,
  );

  return (
    <section
      className="space-y-5 md:space-y-6"
      data-tetrachotomy-detail
      data-selected-class-key={selectedClassKey ?? ''}
    >
      <TypePatternCard
        view={view}
        onSelectClass={onSelectClass}
      />

      <TetrachotomyAspectFunctionPanel
        view={view}
        aspectDisplayMode={aspectDisplayMode}
      />

      {activeView ? (
        <PartitionTypesPanel
          view={typesPanelView}
          activeView={activeView}
          aspectDisplayMode={aspectDisplayMode}
          sourceBlock={sourceBlock}
          extraPoles={sourceTargetPole ? [sourceTargetPole] : []}
        />
      ) : null}

      <details
        className="glass-panel rounded-[28px] p-0"
        data-tetrachotomy-extra-materials
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="eyebrow">
            Доп материалы
          </span>
          <ChevronDown className="h-4 w-4 text-[var(--color-shell-subtle)]" strokeWidth={2} />
        </summary>

        <div className="space-y-5 border-t border-[var(--color-shell-border)] p-5 md:space-y-6">
          <TetrachotomyFormulaPanel
            view={view}
            onSelectClass={onSelectClass}
          />

          <PartitionCompositionView
            view={view}
            onSelectClass={onSelectClass}
          />

          <TetrachotomyClassList
            partition={tetrachotomyPartition}
            selectedClassKey={selectedClassKey}
            onSelectClass={onSelectClass}
          />
        </div>
      </details>
    </section>
  );
};

interface TetrachotomyClassListProps {
  partition: PartitionViewModel & { kind: 'tetrachotomy' };
  selectedClassKey: string | null;
  onSelectClass: (classKey: string) => void;
}

const TetrachotomyClassList: React.FC<TetrachotomyClassListProps> = ({
  partition,
  selectedClassKey,
  onSelectClass,
}) => (
  <div className="glass-muted rounded-[24px] p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="eyebrow flex items-center gap-2">
          <Layers3 className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
          Классы тетрахотомии
        </div>
        <h2 className="mt-2 text-lg font-bold leading-tight text-[var(--color-app-fg)]">
          {partition.traits.map(trait => trait.name).join(' + ')}
        </h2>
      </div>
      <div className="glass-muted rounded-2xl px-3 py-2 text-right">
        <div className="eyebrow">
          Классы
        </div>
        <div className="mt-1 text-sm font-bold text-[var(--color-app-fg)]">
          {partition.classes.length} x {partition.classes[0]?.types.length ?? 0}
        </div>
      </div>
    </div>

    <div className="mt-5 grid gap-3 md:grid-cols-2">
      {partition.classes.map((partitionClass, classIndex) => {
        const isSelected = partitionClass.key === selectedClassKey;
        const tone = CLASS_TONES[classIndex % CLASS_TONES.length];

        return (
          <button
            key={partitionClass.key}
            type="button"
            data-tetrachotomy-class={partitionClass.key}
            aria-pressed={isSelected}
            onClick={() => onSelectClass(partitionClass.key)}
            className={`rounded-2xl border p-4 text-left transition-colors ${tone} ${
              isSelected
                ? 'ring-2 ring-[var(--color-shell-accent)] ring-offset-2 ring-offset-[var(--color-app-bg)]'
                : 'hover:border-[var(--color-shell-hover-fg)]'
            }`}
          >
            <span className="block text-sm font-bold leading-snug">
              {partitionClass.poles.map(pole => pole.poleName).join(' + ')}
            </span>
            <span className="mt-3 flex flex-wrap gap-1.5">
              {partitionClass.types.map(type => (
                <span
                  key={type.id}
                  className="rounded-md bg-[rgb(255_255_255_/_0.22)] px-2 py-0.5 text-[10px] font-black text-current"
                  title={type.name}
                >
                  {getTypeCode(type.aliases, type.id)}
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
