import React, { useMemo } from 'react';
import { GalleryHorizontalEnd, ListChecks, MousePointer2 } from 'lucide-react';
import {
  REININ_TRAITS,
  type ReininTraitId,
} from '../data/socionics';
import {
  selectOctochotomyCatalog,
  selectTetrachotomyCatalog,
  type PartitionCatalogEntryViewModel,
} from '../data/selectors';
import type { PartitionKind } from '../data/partitions';

const CLASS_TONES = [
  'border-sky-200 bg-sky-100 text-sky-950',
  'border-emerald-200 bg-emerald-100 text-emerald-950',
  'border-amber-200 bg-amber-100 text-amber-950',
  'border-rose-200 bg-rose-100 text-rose-950',
  'border-violet-200 bg-violet-100 text-violet-950',
  'border-cyan-200 bg-cyan-100 text-cyan-950',
  'border-lime-200 bg-lime-100 text-lime-950',
  'border-fuchsia-200 bg-fuchsia-100 text-fuchsia-950',
] as const;

const KIND_TITLES = {
  tetrachotomy: 'Тетрахотомии',
  octochotomy: 'Октохотомии',
} as const;

const getTypeCode = (aliases: readonly string[], fallback: string): string => aliases[0] ?? fallback;

const getTraitCount = (kind: Extract<PartitionKind, 'tetrachotomy' | 'octochotomy'>): number => (
  kind === 'tetrachotomy' ? 2 : 3
);

const getCatalog = (kind: Extract<PartitionKind, 'tetrachotomy' | 'octochotomy'>) => (
  kind === 'tetrachotomy' ? selectTetrachotomyCatalog() : selectOctochotomyCatalog()
);

const hasSameTraits = (
  left: readonly ReininTraitId[],
  right: readonly ReininTraitId[],
): boolean => (
  left.length === right.length
  && left.every(traitId => right.includes(traitId))
);

interface Props {
  kind: Extract<PartitionKind, 'tetrachotomy' | 'octochotomy'>;
  selectedTraitIds: readonly ReininTraitId[];
  onSelectTraitIds: (traitIds: readonly ReininTraitId[]) => void;
}

export const PartitionChooser: React.FC<Props> = ({
  kind,
  selectedTraitIds,
  onSelectTraitIds,
}) => {
  const catalog = useMemo(() => getCatalog(kind), [kind]);
  const selectedKey = selectedTraitIds.join('+');
  const selectedEntry = catalog.entries.find(entry => entry.key === selectedKey)
    ?? catalog.entries.find(entry => hasSameTraits(entry.traitIds, selectedTraitIds))
    ?? null;
  const activeEntryKey = selectedEntry?.key ?? selectedKey;
  const traitCount = getTraitCount(kind);
  const visibleEntries = catalog.entries.slice(0, kind === 'tetrachotomy' ? 24 : 30);

  const handleSequentialSelect = (slotIndex: number, traitId: ReininTraitId) => {
    const nextTraitIds = [...selectedTraitIds.slice(0, traitCount)] as ReininTraitId[];
    nextTraitIds[slotIndex] = traitId;

    if (new Set(nextTraitIds).size !== nextTraitIds.length) {
      return;
    }

    const catalogEntry = catalog.entries.find(entry => hasSameTraits(entry.traitIds, nextTraitIds));

    onSelectTraitIds(catalogEntry?.traitIds ?? nextTraitIds);
  };

  const renderEntryLabel = (entry: PartitionCatalogEntryViewModel) => (
    <span className="min-w-0">
      <span className="block truncate text-[13px] font-bold leading-snug">
        {entry.title}
      </span>
      <span className="mt-1 block text-[11px] font-semibold text-slate-400">
        {entry.classCount} x {entry.classSize}
      </span>
    </span>
  );

  return (
    <section
      className="rounded-[28px] border border-slate-200/60 bg-white/90 p-5 shadow-sm backdrop-blur-xl"
      data-partition-chooser={kind}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {KIND_TITLES[kind]}
        </h2>
        <span className="font-mono text-[11px] font-medium text-slate-400">{catalog.entries.length}</span>
      </div>

      <div className="mt-5 space-y-4">
        <section data-partition-entry-mode="sequential">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            <MousePointer2 className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
            По шагам
          </div>
          <div className="mt-3 space-y-3">
            {Array.from({ length: traitCount }, (_, slotIndex) => (
              <div key={slotIndex} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {slotIndex + 1}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {REININ_TRAITS.map(trait => {
                    const isSelected = selectedTraitIds[slotIndex] === trait.id;
                    const isDuplicate = selectedTraitIds.some((selectedTraitId, index) => (
                      index !== slotIndex && selectedTraitId === trait.id
                    ));

                    return (
                      <button
                        key={trait.id}
                        type="button"
                        aria-pressed={isSelected}
                        disabled={isDuplicate}
                        data-partition-sequential-trait={trait.id}
                        data-partition-sequential-slot={slotIndex}
                        onClick={() => handleSequentialSelect(slotIndex, trait.id)}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                          isSelected
                            ? 'border-slate-900 bg-slate-950 text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        } disabled:cursor-not-allowed disabled:opacity-35`}
                      >
                        {trait.name.split(' / ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section data-partition-entry-mode="catalog">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            <ListChecks className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
            Каталог
          </div>
          <div className="mt-3 max-h-[260px] space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
            {catalog.entries.map(entry => {
              const isSelected = entry.key === activeEntryKey;

              return (
                <button
                  key={entry.key}
                  type="button"
                  aria-current={isSelected ? 'true' : undefined}
                  data-partition-catalog-entry={entry.key}
                  onClick={() => onSelectTraitIds(entry.traitIds)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? 'border-slate-900 bg-slate-950 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {renderEntryLabel(entry)}
                </button>
              );
            })}
          </div>
        </section>

        <section data-partition-entry-mode="gallery">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            <GalleryHorizontalEnd className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
            Паттерны
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 pr-1 custom-scrollbar">
            {visibleEntries.map(entry => {
              const isSelected = entry.key === activeEntryKey;
              const classIndexByKey = new Map(
                entry.partition.classes.map((partitionClass, index) => [partitionClass.key, index]),
              );

              return (
                <button
                  key={entry.key}
                  type="button"
                  aria-current={isSelected ? 'true' : undefined}
                  aria-label={entry.title}
                  data-partition-gallery-entry={entry.key}
                  onClick={() => onSelectTraitIds(entry.traitIds)}
                  className={`w-[190px] flex-none rounded-2xl border p-3 text-left transition-colors ${
                    isSelected
                      ? 'border-slate-900 bg-slate-950 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {renderEntryLabel(entry)}
                  <span className="mt-3 grid grid-cols-4 gap-1" aria-hidden="true">
                    {entry.partition.patternCells.map(cell => {
                      const classIndex = classIndexByKey.get(cell.classKey) ?? 0;
                      const tone = CLASS_TONES[classIndex % CLASS_TONES.length];
                      const typeCode = getTypeCode(cell.type.aliases, cell.type.id);

                      return (
                        <span
                          key={cell.type.id}
                          className={`flex aspect-square items-center justify-center rounded-md border text-[9px] font-black leading-none ${tone}`}
                          title={`${typeCode}: ${cell.classLabel}`}
                        >
                          {typeCode}
                        </span>
                      );
                    })}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {selectedEntry ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
            {selectedEntry.title}
          </div>
        ) : null}
      </div>
    </section>
  );
};
