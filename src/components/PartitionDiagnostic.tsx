import React from 'react';
import { SplitSquareHorizontal } from 'lucide-react';
import type { PartitionExplorerViewModel } from '../data/selectors';

const KIND_LABELS = {
  dichotomy: 'Дихотомия',
  tetrachotomy: 'Тетрахотомия',
  octochotomy: 'Октохотомия',
} as const;

interface Props {
  view: PartitionExplorerViewModel;
}

export const PartitionDiagnostic: React.FC<Props> = ({ view }) => {
  const { partition } = view;

  if (partition.ok) {
    return null;
  }

  return (
    <section
      className="glass-panel rounded-[28px] p-5"
      data-partition-diagnostic={view.kind}
      data-partition-diagnostic-reason={partition.reason}
    >
      <div className="eyebrow flex items-center gap-2 text-[var(--color-shell-accent)]">
        <SplitSquareHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
        {KIND_LABELS[view.kind]}
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--color-app-fg)]">{partition.message}</p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--color-shell-muted)]">
        {partition.traits.map(trait => trait.name).join(' + ')}
      </p>
    </section>
  );
};
