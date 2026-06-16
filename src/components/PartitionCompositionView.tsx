import React from 'react';
import { GitMerge, SplitSquareHorizontal } from 'lucide-react';
import type { PoleIndex, ReininTraitId } from '../data/socionics';
import type {
  PartitionClassViewModel,
  PartitionExplorerViewModel,
  TypeSummaryViewModel,
} from '../data/selectors';
import { TypePatternCard } from './TypePatternCard';

const POLE_TONES = [
  'border-sky-200 bg-sky-50 text-sky-950',
  'border-rose-200 bg-rose-50 text-rose-950',
] as const;

const getTypeCode = (type: TypeSummaryViewModel): string => type.aliases[0] ?? type.id;

const getClassPoleIndex = (
  partitionClass: PartitionClassViewModel | null,
  traitId: ReininTraitId,
): PoleIndex | null => (
  partitionClass?.poles.find(pole => pole.trait.id === traitId)?.poleIndex ?? null
);

interface Props {
  view: PartitionExplorerViewModel;
  onSelectClass: (classKey: string) => void;
}

export const PartitionCompositionView: React.FC<Props> = ({
  view,
  onSelectClass,
}) => {
  const { partition, selectedClass } = view;

  if (!partition.ok || (partition.kind !== 'tetrachotomy' && partition.kind !== 'octochotomy')) {
    return (
      <TypePatternCard
        view={view}
        onSelectClass={onSelectClass}
      />
    );
  }

  const findIntersectionClass = (traitId: ReininTraitId, poleIndex: PoleIndex): PartitionClassViewModel | null => {
    const currentPoles = new Map(
      selectedClass?.poles.map(pole => [pole.trait.id, pole.poleIndex]) ?? [],
    );

    currentPoles.set(traitId, poleIndex);

    return partition.classes.find(partitionClass => (
      partitionClass.poles.every(pole => currentPoles.get(pole.trait.id) === pole.poleIndex)
    )) ?? null;
  };

  const getTypesForPole = (traitId: ReininTraitId, poleIndex: PoleIndex): readonly TypeSummaryViewModel[] => (
    partition.classes
      .filter(partitionClass => partitionClass.poles.some(pole => (
        pole.trait.id === traitId && pole.poleIndex === poleIndex
      )))
      .flatMap(partitionClass => partitionClass.types)
  );

  return (
    <section
      className="space-y-5 md:space-y-6"
      data-partition-composition={partition.kind}
    >
      <div className="rounded-[28px] border border-slate-200/60 bg-white/90 p-5 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <GitMerge className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
              Композиция
            </div>
            <h2 className="mt-2 text-lg font-bold leading-tight text-slate-950">
              {partition.traits.map(trait => trait.name).join(' + ')}
            </h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Пересечение
            </div>
            <div className="mt-1 text-sm font-bold text-slate-800">
              {selectedClass?.types.length ?? 0} типа
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partition.traits.map((trait, traitIndex) => {
            const traitPoles = partition.classes
              .flatMap(partitionClass => partitionClass.poles)
              .filter(pole => pole.trait.id === trait.id)
              .filter((pole, index, poles) => (
                poles.findIndex(candidate => candidate.poleIndex === pole.poleIndex) === index
              ))
              .sort((left, right) => left.poleIndex - right.poleIndex);
            const activePoleIndex = getClassPoleIndex(selectedClass, trait.id);

            return (
              <article
                key={trait.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                data-composition-component-index={traitIndex}
                data-composition-component-trait={trait.id}
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <SplitSquareHorizontal className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
                  Дихотомия
                </div>
                <h3 className="mt-2 text-sm font-bold leading-snug text-slate-950">
                  {trait.name}
                </h3>

                <div className="mt-4 grid gap-2">
                  {traitPoles.map(pole => {
                    const isSelected = activePoleIndex === pole.poleIndex;
                    const intersectionClass = findIntersectionClass(trait.id, pole.poleIndex);
                    const poleTypes = getTypesForPole(trait.id, pole.poleIndex);
                    const tone = POLE_TONES[pole.poleIndex % POLE_TONES.length];

                    return (
                      <button
                        key={`${trait.id}:${pole.poleIndex}`}
                        type="button"
                        aria-pressed={isSelected}
                        data-composition-pole={trait.id}
                        data-composition-pole-index={pole.poleIndex}
                        onClick={() => {
                          if (intersectionClass) {
                            onSelectClass(intersectionClass.key);
                          }
                        }}
                        className={`rounded-2xl border p-3 text-left transition-colors ${tone} ${
                          isSelected
                            ? 'ring-2 ring-slate-900 ring-offset-2'
                            : 'hover:border-slate-400'
                        }`}
                      >
                        <span className="block text-sm font-bold leading-snug">
                          {pole.poleName}
                        </span>
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {poleTypes.map(type => (
                            <span
                              key={type.id}
                              className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-black text-slate-800"
                              title={type.name}
                            >
                              {getTypeCode(type)}
                            </span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div data-composition-final="true">
        <TypePatternCard
          view={view}
          onSelectClass={onSelectClass}
        />
      </div>
    </section>
  );
};
