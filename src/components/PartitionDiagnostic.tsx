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
      className="rounded-[28px] border border-rose-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl"
      data-partition-diagnostic={view.kind}
      data-partition-diagnostic-reason={partition.reason}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-500">
        <SplitSquareHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
        {KIND_LABELS[view.kind]}
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900">{partition.message}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        {partition.traits.map(trait => trait.name).join(' + ')}
      </p>
    </section>
  );
};
