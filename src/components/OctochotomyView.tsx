import React from 'react';
import { Layers3 } from 'lucide-react';
import { REININ_TRAITS, type View } from '../data/socionics';
import { selectPartitionTypesPanelView, type PartitionExplorerViewModel } from '../data/selectors';
import type { AspectDisplayMode } from './AspectGlyph';
import { PartitionCompositionView } from './PartitionCompositionView';
import { PartitionTypesPanel } from './PartitionTypesPanel';

const CLASS_TONES = [
  'border-sky-200 bg-sky-50 text-sky-950',
  'border-emerald-200 bg-emerald-50 text-emerald-950',
  'border-amber-200 bg-amber-50 text-amber-950',
  'border-rose-200 bg-rose-50 text-rose-950',
  'border-violet-200 bg-violet-50 text-violet-950',
  'border-cyan-200 bg-cyan-50 text-cyan-950',
  'border-lime-200 bg-lime-50 text-lime-950',
  'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-950',
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

export const OctochotomyView: React.FC<Props> = ({
  view,
  aspectDisplayMode,
  onSelectClass,
}) => {
  const { partition, selectedClassKey } = view;
  const activeView = getFirstClassPoleView(view);

  if (!partition.ok || partition.kind !== 'octochotomy' || !activeView) {
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
      data-octochotomy-detail
      data-selected-class-key={selectedClassKey ?? ''}
    >
      <PartitionCompositionView
        view={view}
        onSelectClass={onSelectClass}
      />

      <div className="rounded-[28px] border border-slate-200/60 bg-white/90 p-5 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Layers3 className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
              Классы октохотомии
            </div>
            <h2 className="mt-2 text-lg font-bold leading-tight text-slate-950">
              {partition.traits.map(trait => trait.name).join(' + ')}
            </h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Классы
            </div>
            <div className="mt-1 text-sm font-bold text-slate-800">
              {partition.classes.length} x {partition.classes[0]?.types.length ?? 0}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {partition.classes.map((partitionClass, classIndex) => {
            const isSelected = partitionClass.key === selectedClassKey;
            const tone = CLASS_TONES[classIndex % CLASS_TONES.length];

            return (
              <button
                key={partitionClass.key}
                type="button"
                data-octochotomy-class={partitionClass.key}
                aria-pressed={isSelected}
                onClick={() => onSelectClass(partitionClass.key)}
                className={`rounded-2xl border p-4 text-left transition-colors ${tone} ${
                  isSelected
                    ? 'ring-2 ring-slate-900 ring-offset-2'
                    : 'hover:border-slate-400'
                }`}
              >
                <span className="block text-sm font-bold leading-snug">
                  {partitionClass.poles.map(pole => pole.poleName).join(' + ')}
                </span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {partitionClass.types.map(type => (
                    <span
                      key={type.id}
                      className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-black text-slate-800"
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
