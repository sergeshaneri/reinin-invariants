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
  'map-tone-0 text-[var(--color-map-fg)]',
  'map-tone-1 text-[var(--color-map-fg)]',
  'map-tone-2 text-[var(--color-map-fg)]',
  'map-tone-3 text-[var(--color-map-fg)]',
  'map-tone-4 text-[var(--color-map-fg)]',
  'map-tone-5 text-[var(--color-map-fg)]',
  'map-tone-6 text-[var(--color-map-fg)]',
  'map-tone-7 text-[var(--color-map-fg)]',
] as const;

const KIND_TITLES = {
  tetrachotomy: 'Тетрахотомии',
  octochotomy: 'Октохотомии',
} as const;

const CATALOG_LABELS = {
  tetrachotomy: 'Источник',
  octochotomy: 'Каталог',
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
      <span className="mt-1 block text-[11px] font-semibold opacity-70">
        {entry.sourceFormula
          ? `${entry.sourceFormula.targetTrait.name} · ${entry.classCount} x ${entry.classSize}`
          : `${entry.classCount} x ${entry.classSize}`}
      </span>
    </span>
  );

  return (
    <section
      className="glass-panel rounded-[28px] p-5"
      data-partition-chooser={kind}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="eyebrow">
          {KIND_TITLES[kind]}
        </h2>
        <span
          className="font-mono text-[11px] font-medium text-[var(--color-shell-subtle)]"
          data-partition-catalog-count={kind}
        >
          {catalog.entries.length}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <section data-partition-entry-mode="sequential">
          <div className="eyebrow flex items-center gap-2">
            <MousePointer2 className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            По шагам
          </div>
          <div className="mt-3 space-y-3">
            {Array.from({ length: traitCount }, (_, slotIndex) => (
              <div key={slotIndex} className="glass-muted rounded-2xl p-3">
                <div className="eyebrow">
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
                            ? 'border-[var(--color-shell-active-bg)] bg-[var(--color-shell-active-bg)] text-[var(--color-shell-active-fg)]'
                            : 'border-[var(--color-shell-border)] bg-[var(--color-shell-control)] text-[var(--color-shell-muted)] hover:border-[var(--color-shell-border-strong)] hover:text-[var(--color-shell-hover-fg)]'
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
          <div className="eyebrow flex items-center gap-2">
            <ListChecks className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            {CATALOG_LABELS[kind]}
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
                      ? 'border-[var(--color-shell-active-bg)] bg-[var(--color-shell-active-bg)] text-[var(--color-shell-active-fg)]'
                      : 'border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] text-[var(--color-app-fg)] hover:border-[var(--color-shell-border-strong)]'
                  }`}
                >
                  {renderEntryLabel(entry)}
                </button>
              );
            })}
          </div>
        </section>

        <section data-partition-entry-mode="gallery">
          <div className="eyebrow flex items-center gap-2">
            <GalleryHorizontalEnd className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
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
                      ? 'border-[var(--color-shell-active-bg)] bg-[var(--color-shell-active-bg)] text-[var(--color-shell-active-fg)]'
                      : 'border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] text-[var(--color-app-fg)] hover:border-[var(--color-shell-border-strong)]'
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
          <div className="glass-muted rounded-2xl px-3 py-2 text-xs font-semibold text-[var(--color-shell-muted)]">
            <span className="block text-[10px] uppercase tracking-[0.18em] opacity-70">
              {selectedEntry.sourceFormula ? 'Формула источника' : 'Выбрано'}
            </span>
            <span className="mt-1 block text-[var(--color-app-fg)]">
              {selectedEntry.title}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
};
