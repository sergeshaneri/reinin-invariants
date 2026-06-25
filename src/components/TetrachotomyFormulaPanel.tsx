import React from 'react';
import { GitMerge, Layers3, SplitSquareHorizontal } from 'lucide-react';
import {
  REININ_TRAITS,
  type ReininTrait,
  type ReininTraitId,
} from '../data/socionics';
import {
  TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID,
  type PoleIndex,
} from '../data/memberships';
import type {
  PartitionClassViewModel,
  PartitionExplorerViewModel,
  TypeSummaryViewModel,
} from '../data/selectors';
import type { SocionicTypeId } from '../data/types';

const TARGET_TONES = [
  'map-tone-0 text-[var(--color-map-fg)]',
  'map-tone-1 text-[var(--color-map-fg)]',
] as const;

const getTypeCode = (type: TypeSummaryViewModel): string => type.aliases[0] ?? type.id;

const getTraitById = (traitId: ReininTraitId): ReininTrait | null => (
  REININ_TRAITS.find(trait => trait.id === traitId) ?? null
);

const sortedTypeKey = (typeIds: readonly SocionicTypeId[]): string => (
  [...typeIds].sort().join('|')
);

const getClassPoleIndex = (
  partitionClass: PartitionClassViewModel,
  traitId: ReininTraitId,
): PoleIndex | null => (
  partitionClass.poles.find(pole => pole.trait.id === traitId)?.poleIndex ?? null
);

const findClassByBasisPoles = (
  classes: readonly PartitionClassViewModel[],
  rowTraitId: ReininTraitId,
  rowPoleIndex: PoleIndex,
  columnTraitId: ReininTraitId,
  columnPoleIndex: PoleIndex,
): PartitionClassViewModel | null => (
  classes.find(partitionClass => (
    getClassPoleIndex(partitionClass, rowTraitId) === rowPoleIndex
    && getClassPoleIndex(partitionClass, columnTraitId) === columnPoleIndex
  )) ?? null
);

const getTargetPoleIndex = (
  targetTraitId: ReininTraitId,
  types: readonly TypeSummaryViewModel[],
): PoleIndex | null => {
  const firstTypeId = types[0]?.id;
  if (!firstTypeId) {
    return null;
  }

  const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[targetTraitId];
  const pole = membership.poles.find(candidate => candidate.typeIds.includes(firstTypeId));

  if (!pole) {
    return null;
  }

  return types.every(type => pole.typeIds.includes(type.id)) ? pole.poleIndex : null;
};

type SourceFormulaViewModel = NonNullable<PartitionExplorerViewModel['sourceFormula']>;

const findSourceColor = (
  sourceFormula: SourceFormulaViewModel,
  types: readonly TypeSummaryViewModel[],
): string | undefined => {
  const classTypeKey = sortedTypeKey(types.map(type => type.id));

  return sourceFormula.groups.find(group => (
    sortedTypeKey(group.typeIds) === classTypeKey
  ))?.sourceColor;
};

interface FormulaClassCell {
  partitionClass: PartitionClassViewModel;
  rowPoleIndex: PoleIndex;
  rowPoleName: string;
  columnPoleIndex: PoleIndex;
  columnPoleName: string;
  targetPoleIndex: PoleIndex | null;
  sourceColor?: string;
}

interface Props {
  view: PartitionExplorerViewModel;
  onSelectClass: (classKey: string) => void;
}

export const TetrachotomyFormulaPanel: React.FC<Props> = ({
  view,
  onSelectClass,
}) => {
  const { partition, selectedClassKey, sourceFormula } = view;

  if (!partition.ok || partition.kind !== 'tetrachotomy' || !sourceFormula) {
    return null;
  }

  const targetTrait = getTraitById(sourceFormula.targetTrait.id);
  const rowTrait = getTraitById(sourceFormula.basisTraits[0].id);
  const columnTrait = getTraitById(sourceFormula.basisTraits[1].id);

  if (!targetTrait || !rowTrait || !columnTrait) {
    return null;
  }

  const cells = rowTrait.poles.flatMap((rowPole, rowPoleIndex) => (
    columnTrait.poles.map((columnPole, columnPoleIndex): FormulaClassCell | null => {
      const rowIndex = rowPoleIndex as PoleIndex;
      const columnIndex = columnPoleIndex as PoleIndex;
      const partitionClass = findClassByBasisPoles(
        partition.classes,
        rowTrait.id,
        rowIndex,
        columnTrait.id,
        columnIndex,
      );

      if (!partitionClass) {
        return null;
      }

      return {
        partitionClass,
        rowPoleIndex: rowIndex,
        rowPoleName: rowPole.name,
        columnPoleIndex: columnIndex,
        columnPoleName: columnPole.name,
        targetPoleIndex: getTargetPoleIndex(targetTrait.id, partitionClass.types),
        sourceColor: findSourceColor(sourceFormula, partitionClass.types),
      };
    })
  )).filter((cell): cell is FormulaClassCell => cell !== null);

  return (
    <section
      className="glass-panel rounded-[28px] p-5"
      data-tetrachotomy-formula-panel={sourceFormula.id}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="eyebrow flex items-center gap-2">
            <GitMerge className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            Формула источника
          </div>
          <h2 className="mt-2 text-lg font-bold leading-tight text-[var(--color-app-fg)]">
            {sourceFormula.formulaText}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-[var(--color-shell-muted)]">
            <span className="rounded-full border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-2.5 py-1">
              Таблица {sourceFormula.sourceTableNumber}
            </span>
            {sourceFormula.relationText ? (
              <span className="rounded-full border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-2.5 py-1">
                {sourceFormula.relationText}
              </span>
            ) : null}
          </div>
        </div>
        <div className="glass-muted rounded-2xl px-3 py-2 text-right">
          <div className="eyebrow">
            Итог
          </div>
          <div className="mt-1 text-sm font-bold text-[var(--color-app-fg)]">
            {sourceFormula.targetTrait.name}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.35fr)]">
        <div className="glass-muted rounded-2xl p-4">
          <div className="eyebrow flex items-center gap-2">
            <SplitSquareHorizontal className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            Дихотомии формулы
          </div>

          <div className="mt-4 grid gap-2">
            <FormulaTraitCard
              kind="target"
              roleLabel="Результат"
              trait={targetTrait}
            />

            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
              <FormulaTraitCard
                kind="basis"
                roleLabel="Множитель A"
                trait={rowTrait}
                basisIndex={0}
              />
              <span className="justify-self-center font-mono text-sm font-black text-[var(--color-shell-subtle)]">
                ×
              </span>
              <FormulaTraitCard
                kind="basis"
                roleLabel="Множитель B"
                trait={columnTrait}
                basisIndex={1}
              />
            </div>
          </div>
        </div>

        <div className="glass-muted rounded-2xl p-4">
          <div className="eyebrow flex items-center gap-2">
            <Layers3 className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            Классы по формуле
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {cells.map(cell => {
              const isSelected = cell.partitionClass.key === selectedClassKey;
              const targetPoleName = cell.targetPoleIndex === null
                ? 'нет общего полюса'
                : targetTrait.poles[cell.targetPoleIndex].name;
              const targetTone = cell.targetPoleIndex === null
                ? 'map-tone-inactive'
                : TARGET_TONES[cell.targetPoleIndex];

              return (
                <button
                  key={cell.partitionClass.key}
                  type="button"
                  data-tetrachotomy-formula-cell={cell.partitionClass.key}
                  data-row-pole-index={cell.rowPoleIndex}
                  data-column-pole-index={cell.columnPoleIndex}
                  data-target-pole-index={cell.targetPoleIndex ?? ''}
                  data-source-color={cell.sourceColor ?? ''}
                  aria-pressed={isSelected}
                  aria-label={`${cell.rowPoleName} × ${cell.columnPoleName}: ${targetPoleName}`}
                  onClick={() => onSelectClass(cell.partitionClass.key)}
                  className={`rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] p-3 text-left transition-colors ${
                    isSelected
                      ? 'ring-2 ring-[var(--color-shell-accent)] ring-offset-2 ring-offset-[var(--color-app-bg)]'
                      : 'hover:border-[var(--color-shell-border-strong)] hover:text-[var(--color-shell-hover-fg)]'
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="min-w-0 text-[11px] font-semibold leading-snug text-[var(--color-shell-muted)]">
                      <span className="block truncate">{cell.rowPoleName}</span>
                      <span className="block truncate">{cell.columnPoleName}</span>
                    </span>
                    {cell.sourceColor ? (
                      <span
                        className="h-3 w-3 shrink-0 rounded-full border border-[rgb(255_255_255_/_0.7)] shadow-sm"
                        style={{ backgroundColor: `#${cell.sourceColor}` }}
                        title={`Цвет источника #${cell.sourceColor}`}
                      />
                    ) : null}
                  </span>

                  <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black leading-none ${targetTone}`}>
                    {targetPoleName}
                  </span>

                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {cell.partitionClass.types.map(type => (
                      <span
                        key={type.id}
                        className="rounded-md bg-[var(--color-shell-active-bg)] px-2 py-0.5 text-[10px] font-black text-[var(--color-shell-active-fg)]"
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
        </div>
      </div>
    </section>
  );
};

interface FormulaTraitCardProps {
  kind: 'target' | 'basis';
  roleLabel: string;
  trait: ReininTrait;
  basisIndex?: number;
}

const FormulaTraitCard: React.FC<FormulaTraitCardProps> = ({
  kind,
  roleLabel,
  trait,
  basisIndex,
}) => (
  <div
    className="rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] p-3"
    data-tetrachotomy-formula-target={kind === 'target' ? trait.id : undefined}
    data-tetrachotomy-formula-basis={kind === 'basis' ? trait.id : undefined}
    data-tetrachotomy-formula-basis-index={basisIndex}
  >
    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-shell-subtle)]">
      {roleLabel}
    </div>
    <div className="mt-1 text-[13px] font-bold leading-snug text-[var(--color-app-fg)]">
      {trait.name}
    </div>
    <div className="mt-2 flex flex-wrap gap-1.5">
      {trait.poles.map((pole, poleIndex) => {
        const tone = kind === 'target'
          ? TARGET_TONES[poleIndex as PoleIndex]
          : 'border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] text-[var(--color-shell-muted)]';

        return (
          <span
            key={pole.name}
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone}`}
          >
            {pole.name}
          </span>
        );
      })}
    </div>
  </div>
);
