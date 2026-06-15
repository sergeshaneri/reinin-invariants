import React, { useMemo } from 'react';
import { Grid2X2 } from 'lucide-react';
import { REININ_TRAITS } from '../data/socionics';
import { selectPartitionExplorerView } from '../data/selectors';

interface Props {
  selectedTraitIndex: number;
  onSelectTrait: (index: number) => void;
}

const POLE_TONES = [
  'border-sky-200 bg-sky-100 text-sky-950',
  'border-emerald-200 bg-emerald-100 text-emerald-950',
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
    <section className="rounded-[28px] border border-slate-200/60 bg-white/90 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          <Grid2X2 className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
          Паттерны дихотомий
        </h2>
        <span className="font-mono text-[11px] font-medium text-slate-400">{items.length}</span>
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
                  ? 'border-slate-900 bg-slate-950 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white'
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
                <span className="mt-3 block rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
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
