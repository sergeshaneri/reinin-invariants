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
  'map-tone-0 text-[var(--color-map-fg)]',
  'map-tone-1 text-[var(--color-map-fg)]',
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
      <div className="glass-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="eyebrow flex items-center gap-2">
              <GitMerge className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
              Композиция
            </div>
            <h2 className="mt-2 text-lg font-bold leading-tight text-[var(--color-app-fg)]">
              {partition.traits.map(trait => trait.name).join(' + ')}
            </h2>
          </div>
          <div className="glass-muted rounded-2xl px-3 py-2 text-right">
            <div className="eyebrow">
              Пересечение
            </div>
            <div className="mt-1 text-sm font-bold text-[var(--color-app-fg)]">
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
                className="glass-muted rounded-2xl p-4"
                data-composition-component-index={traitIndex}
                data-composition-component-trait={trait.id}
              >
                <div className="eyebrow flex items-center gap-2">
                  <SplitSquareHorizontal className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
                  Дихотомия
                </div>
                <h3 className="mt-2 text-sm font-bold leading-snug text-[var(--color-app-fg)]">
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
                            ? 'ring-2 ring-[var(--color-shell-accent)] ring-offset-2 ring-offset-[var(--color-app-bg)]'
                            : 'hover:border-[var(--color-shell-hover-fg)]'
                        }`}
                      >
                        <span className="block text-sm font-bold leading-snug">
                          {pole.poleName}
                        </span>
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {poleTypes.map(type => (
                            <span
                              key={type.id}
                              className="rounded-md bg-[rgb(255_255_255_/_0.22)] px-2 py-0.5 text-[10px] font-black text-current"
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
