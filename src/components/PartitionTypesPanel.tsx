import React from 'react';
import { UsersRound } from 'lucide-react';
import type { View } from '../data/socionics';
import type { PartitionTypesPanelViewModel } from '../data/selectors';
import type { SocionicTypeId } from '../data/types';
import type { AspectDisplayMode } from './AspectGlyph';
import { ModelAPreviewGrid } from './ModelAPreviewGrid';

const KIND_LABELS = {
  dichotomy: 'Дихотомия',
  tetrachotomy: 'Тетрахотомия',
  octochotomy: 'Октохотомия',
} as const;

interface Props {
  view: PartitionTypesPanelViewModel;
  activeView: View;
  aspectDisplayMode: AspectDisplayMode;
}

export const PartitionTypesPanel: React.FC<Props> = ({
  view,
  activeView,
  aspectDisplayMode,
}) => (
  <section
    className="rounded-[28px] border border-slate-200/60 bg-white/90 p-5 shadow-sm backdrop-blur-xl"
    aria-label={`Типы выбранного класса: ${view.title}`}
    data-partition-types-panel={view.kind}
    data-selected-class-key={view.classKey ?? ''}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          <UsersRound className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
          Типы полюса
        </div>
        <h2 className="mt-2 text-lg font-bold leading-tight text-slate-950">
          {view.title}
        </h2>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {KIND_LABELS[view.kind]}
        </div>
        <div className="mt-1 text-sm font-bold text-slate-800">
          {view.types.length} ТИМов
        </div>
      </div>
    </div>

    {view.poles.length > 1 ? (
      <div className="mt-4 flex flex-wrap gap-2">
        {view.poles.map(pole => (
          <span
            key={`${pole.trait.id}:${pole.poleIndex}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            {pole.poleName}
          </span>
        ))}
      </div>
    ) : null}

    <ModelAPreviewGrid
      typeIds={view.types.map(type => type.id as SocionicTypeId)}
      view={activeView}
      aspectDisplayMode={aspectDisplayMode}
    />
  </section>
);
