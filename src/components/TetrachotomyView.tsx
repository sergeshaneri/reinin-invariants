import React from 'react';
import { Layers3 } from 'lucide-react';
import { REININ_TRAITS, type View } from '../data/socionics';
import { selectPartitionTypesPanelView, type PartitionExplorerViewModel } from '../data/selectors';
import type { AspectDisplayMode } from './AspectGlyph';
import { PartitionCompositionView } from './PartitionCompositionView';
import { PartitionTypesPanel } from './PartitionTypesPanel';

const CLASS_TONES = [
  'map-tone-0 text-[var(--color-map-fg)]',
  'map-tone-1 text-[var(--color-map-fg)]',
  'map-tone-2 text-[var(--color-map-fg)]',
  'map-tone-3 text-[var(--color-map-fg)]',
] as const;

const getTypeCode = (aliases: readonly string[], fallback: string): string => aliases[0] ?? fallback;

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

  if (!partition.ok || partition.kind !== 'tetrachotomy' || !activeView) {
    return (
      <PartitionCompositionView
        view={view}
        onSelectClass={onSelectClass}
      />
    );
  }

  const typesPanelView = selectPartitionTypesPanelView(
    partition.traitIds,
    selectedClassKey,
  );

  return (
    <section
      className="space-y-5 md:space-y-6"
      data-tetrachotomy-detail
      data-selected-class-key={selectedClassKey ?? ''}
    >
      <PartitionCompositionView
        view={view}
        onSelectClass={onSelectClass}
      />

      <div className="glass-panel rounded-[28px] p-5">
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

      <PartitionTypesPanel
        view={typesPanelView}
        activeView={activeView}
        aspectDisplayMode={aspectDisplayMode}
      />
    </section>
  );
};
