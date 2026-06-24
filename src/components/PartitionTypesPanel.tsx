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
    className="glass-panel rounded-[28px] p-5"
    aria-label={`Типы выбранного класса: ${view.title}`}
    data-partition-types-panel={view.kind}
    data-selected-class-key={view.classKey ?? ''}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="eyebrow flex items-center gap-2">
          <UsersRound className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
          Типы полюса
        </div>
        <h2 className="mt-2 text-lg font-bold leading-tight text-[var(--color-app-fg)]">
          {view.title}
        </h2>
      </div>
      <div className="glass-muted rounded-2xl px-3 py-2 text-right">
        <div className="eyebrow">
          {KIND_LABELS[view.kind]}
        </div>
        <div className="mt-1 text-sm font-bold text-[var(--color-app-fg)]">
          {view.types.length} ТИМов
        </div>
      </div>
    </div>

    {view.poles.length > 1 ? (
      <div className="mt-4 flex flex-wrap gap-2">
        {view.poles.map(pole => (
          <span
            key={`${pole.trait.id}:${pole.poleIndex}`}
            className="rounded-full border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-3 py-1 text-xs font-semibold text-[var(--color-shell-muted)]"
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
