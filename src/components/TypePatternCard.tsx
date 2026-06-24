import React from 'react';
import { Grid3X3 } from 'lucide-react';
import type { PartitionExplorerViewModel } from '../data/selectors';
import { PartitionDiagnostic } from './PartitionDiagnostic';

const CLASS_TONES = [
  'map-tone-0 text-[var(--color-map-fg)]',
  'map-tone-1 text-[var(--color-map-fg)]',
  'map-tone-2 text-[var(--color-map-fg)]',
  'map-tone-3 text-[var(--color-map-fg)]',
  'map-tone-4 text-[var(--color-map-fg)]',
  'map-tone-5 text-[var(--color-map-fg)]',
  'map-tone-6 text-[var(--color-map-fg)]',
  'map-tone-7 text-[var(--color-map-fg)]',
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
      className="glass-panel rounded-[28px] p-5"
      aria-label={`${KIND_LABELS[partition.kind]}: 16 ТИМов`}
      data-partition-pattern={partition.kind}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="eyebrow flex items-center gap-2">
            <Grid3X3 className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            {KIND_LABELS[partition.kind]}
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
                  ? 'ring-2 ring-[var(--color-shell-accent)] ring-offset-2 ring-offset-[var(--color-app-bg)]'
                  : 'hover:border-[var(--color-shell-hover-fg)]'
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
        <div className="glass-muted mt-5 rounded-2xl p-4">
          <div className="eyebrow">
            Выбранный класс
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedClass.poles.map(pole => (
              <span
                key={`${pole.trait.id}:${pole.poleIndex}`}
                className="rounded-full border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-3 py-1 text-xs font-semibold text-[var(--color-shell-muted)]"
              >
                {pole.poleName}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedClass.types.map(type => (
              <span
                key={type.id}
                className="rounded-lg bg-[var(--color-shell-active-bg)] px-2.5 py-1 text-xs font-bold text-[var(--color-shell-active-fg)]"
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
