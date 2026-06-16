import React from 'react';
import { Grid3X3 } from 'lucide-react';
import type { PartitionExplorerViewModel } from '../data/selectors';
import { PartitionDiagnostic } from './PartitionDiagnostic';

const CLASS_TONES = [
  'bg-sky-100 text-sky-950 border-sky-200',
  'bg-emerald-100 text-emerald-950 border-emerald-200',
  'bg-amber-100 text-amber-950 border-amber-200',
  'bg-rose-100 text-rose-950 border-rose-200',
  'bg-violet-100 text-violet-950 border-violet-200',
  'bg-cyan-100 text-cyan-950 border-cyan-200',
  'bg-lime-100 text-lime-950 border-lime-200',
  'bg-fuchsia-100 text-fuchsia-950 border-fuchsia-200',
] as const;

const KIND_LABELS = {
  dichotomy: 'Дихотомия',
  tetrachotomy: 'Тетрахотомия',
  octochotomy: 'Октохотомия',
} as const;

const getTypeCode = (aliases: readonly string[], fallback: string): string => aliases[0] ?? fallback;

interface Props {
  view: PartitionExplorerViewModel;
  onSelectClass?: (classKey: string) => void;
}

export const TypePatternCard: React.FC<Props> = ({ view, onSelectClass }) => {
  const { partition, selectedClassKey, selectedClass } = view;

  if (!partition.ok) {
    return <PartitionDiagnostic view={view} />;
  }

  const toneByClassKey = new Map(
    partition.classes.map((partitionClass, index) => [
      partitionClass.key,
      CLASS_TONES[index % CLASS_TONES.length],
    ]),
  );

  return (
    <section
      className="rounded-[28px] border border-slate-200/60 bg-white/90 p-5 shadow-sm backdrop-blur-xl"
      aria-label={`${KIND_LABELS[partition.kind]}: 16 ТИМов`}
      data-partition-pattern={partition.kind}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Grid3X3 className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
            {KIND_LABELS[partition.kind]}
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

      <div className="mt-5 grid grid-cols-4 gap-2" role="grid" aria-label="H3 порядок 16 ТИМов">
        {partition.patternCells.map(cell => {
          const isSelected = cell.classKey === selectedClassKey;
          const tone = toneByClassKey.get(cell.classKey) ?? CLASS_TONES[0];
          const typeCode = getTypeCode(cell.type.aliases, cell.type.id);

          return (
            <button
              key={cell.type.id}
              type="button"
              role="gridcell"
              data-type-id={cell.type.id}
              data-class-key={cell.classKey}
              aria-pressed={isSelected}
              aria-label={`${typeCode}: ${cell.classLabel}`}
              title={`${cell.type.name}: ${cell.classLabel}`}
              onClick={() => onSelectClass?.(cell.classKey)}
              className={`min-h-14 rounded-2xl border px-2 py-2 text-center transition-colors ${tone} ${
                isSelected
                  ? 'ring-2 ring-slate-900 ring-offset-2'
                  : 'hover:border-slate-400'
              }`}
            >
              <span className="block text-[15px] font-black leading-none tracking-normal">{typeCode}</span>
              <span className="mt-1 block truncate text-[10px] font-semibold opacity-75">
                {cell.poleNames.map(name => name.slice(0, 3)).join(' / ')}
              </span>
            </button>
          );
        })}
      </div>

      {selectedClass ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Выбранный класс
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedClass.poles.map(pole => (
              <span
                key={`${pole.trait.id}:${pole.poleIndex}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {pole.poleName}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedClass.types.map(type => (
              <span
                key={type.id}
                className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white"
                title={type.name}
              >
                {getTypeCode(type.aliases, type.id)}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};
