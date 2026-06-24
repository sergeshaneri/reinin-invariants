import React, { useMemo } from 'react';
import { Grid2X2 } from 'lucide-react';
import { REININ_TRAITS } from '../data/socionics';
import { selectPartitionExplorerView } from '../data/selectors';

interface Props {
  selectedTraitIndex: number;
  onSelectTrait: (index: number) => void;
}

const POLE_TONES = [
  'map-tone-0 text-[var(--color-map-fg)]',
  'map-tone-1 text-[var(--color-map-fg)]',
] as const;

const getTypeCode = (aliases: readonly string[], fallback: string): string => aliases[0] ?? fallback;

export const DichotomyGallery: React.FC<Props> = ({ selectedTraitIndex, onSelectTrait }) => {
  const items = useMemo(
    () => REININ_TRAITS.map((trait, index) => ({
      trait,
      index,
      view: selectPartitionExplorerView([trait.id]),
    })),
    [],
  );

  return (
    <section className="glass-panel rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="eyebrow flex items-center gap-2">
          <Grid2X2 className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
          Паттерны дихотомий
        </h2>
        <span className="font-mono text-[11px] font-medium text-[var(--color-shell-subtle)]">{items.length}</span>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 pr-1 custom-scrollbar" aria-label="Галерея дихотомий">
        {items.map(({ trait, index, view }) => {
          const isActive = selectedTraitIndex === index;
          const partition = view.partition;

          return (
            <button
              key={trait.id}
              type="button"
              aria-current={isActive ? 'true' : undefined}
              aria-label={trait.name}
              data-dichotomy-card={trait.id}
              onClick={() => onSelectTrait(index)}
              className={`w-[220px] flex-none rounded-2xl border p-3 text-left transition-colors ${
                isActive
                  ? 'border-[var(--color-shell-active-bg)] bg-[var(--color-shell-active-bg)] text-[var(--color-shell-active-fg)] shadow-sm'
                  : 'border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] text-[var(--color-app-fg)] hover:border-[var(--color-shell-border-strong)]'
              }`}
            >
              <span className="block min-h-10 text-[13px] font-bold leading-snug">
                {trait.name}
              </span>

              {partition.ok ? (
                <>
                  <span className="mt-3 grid grid-cols-4 gap-1" aria-hidden="true">
                    {partition.patternCells.map(cell => {
                      const classIndex = partition.classes.findIndex(partitionClass => (
                        partitionClass.key === cell.classKey
                      ));
                      const tone = POLE_TONES[classIndex >= 0 ? classIndex % POLE_TONES.length : 0];
                      const typeCode = getTypeCode(cell.type.aliases, cell.type.id);

                      return (
                        <span
                          key={cell.type.id}
                          className={`flex aspect-square items-center justify-center rounded-md border text-[9px] font-black leading-none ${
                            isActive ? `${tone} ring-1 ring-white/60` : tone
                          }`}
                          title={`${typeCode}: ${cell.classLabel}`}
                        >
                          {typeCode}
                        </span>
                      );
                    })}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {partition.classes.map((partitionClass, classIndex) => (
                      <span
                        key={partitionClass.key}
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight ${
                          isActive
                            ? `${POLE_TONES[classIndex % POLE_TONES.length]} ring-1 ring-white/60`
                            : POLE_TONES[classIndex % POLE_TONES.length]
                        }`}
                      >
                        {partitionClass.poles[0]?.poleName}
                      </span>
                    ))}
                  </span>
                </>
              ) : (
                <span className="mt-3 block rounded-xl border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-accent-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-shell-accent)]">
                  {partition.message}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
