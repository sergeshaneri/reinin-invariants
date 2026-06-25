import React from 'react';
import { ArrowRight, Route } from 'lucide-react';
import { FUNCTIONS } from '../data/socionics';
import type {
  PartitionClassViewModel,
  PartitionExplorerViewModel,
} from '../data/selectors';
import type { SocionicTypeId } from '../data/types';
import { AspectGlyph, type AspectDisplayMode } from './AspectGlyph';

type SourceFormulaViewModel = NonNullable<PartitionExplorerViewModel['sourceFormula']>;
type SourceFormulaBlock = NonNullable<SourceFormulaViewModel['sourceBlocks']>[number];

const sortedTypeKey = (typeIds: readonly SocionicTypeId[]): string => (
  [...typeIds].sort().join('|')
);

const findSelectedSourceBlock = (
  sourceFormula: SourceFormulaViewModel,
  selectedClass: PartitionClassViewModel | null,
): SourceFormulaBlock | null => {
  if (!selectedClass || !sourceFormula.sourceBlocks) {
    return null;
  }

  const selectedKey = sortedTypeKey(selectedClass.types.map(type => type.id));

  return sourceFormula.sourceBlocks.find(block => (
    sortedTypeKey(block.typeIds) === selectedKey
  )) ?? null;
};

const getFunctionName = (functionId: number): string => (
  FUNCTIONS.find(candidate => candidate.id === functionId)?.name ?? `Функция ${functionId}`
);

interface Props {
  view: PartitionExplorerViewModel;
  aspectDisplayMode: AspectDisplayMode;
}

export const TetrachotomyAspectFunctionPanel: React.FC<Props> = ({
  view,
  aspectDisplayMode,
}) => {
  const { selectedClass, sourceFormula } = view;

  const sourceBlock = sourceFormula
    ? findSelectedSourceBlock(sourceFormula, selectedClass)
    : null;

  return (
    <section
      className="glass-panel rounded-[28px] p-5"
      data-tetrachotomy-model-a-slot
      data-tetrachotomy-aspect-function-panel={sourceFormula?.id ?? 'structural'}
      data-source-block-status={sourceBlock?.status ?? 'missing'}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="eyebrow flex items-center gap-2">
            <Route className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            Отображение аспектов в функции
          </div>
          <h2 className="mt-2 text-lg font-bold leading-tight text-[var(--color-app-fg)]">
            Общий инвариант выбранной тетрады в модели А
          </h2>
          {sourceBlock ? (
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-[var(--color-shell-muted)]">
              {sourceBlock.labels.map(label => (
                <span
                  key={label}
                  className="rounded-full border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-2.5 py-1"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="glass-muted rounded-2xl px-3 py-2 text-right">
          <div className="eyebrow">
            Источник
          </div>
          <div className="mt-1 text-sm font-bold text-[var(--color-app-fg)]">
            {sourceFormula?.sourceTableNumber ?? '—'}
          </div>
        </div>
      </div>

      {sourceBlock ? (
        <div className="mt-5 grid gap-3" data-tetrachotomy-source-block={sortedTypeKey(sourceBlock.typeIds)}>
          {sourceBlock.rows.map(row => (
            <div
              key={`${row.aspectText}-${row.functionBlockLabel}`}
              className="grid gap-3 rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] p-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.08fr)] lg:items-stretch"
              data-tetrachotomy-aspect-function-row={row.aspectText}
            >
              <div className="min-w-0 rounded-xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-3">
                <div className="eyebrow">
                  Аспект
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-active-bg)] text-[var(--color-shell-active-fg)]">
                    {row.aspectIds.map(aspectId => (
                      <AspectGlyph
                        key={aspectId}
                        aspectId={aspectId}
                        label={row.aspectText}
                        mode={aspectDisplayMode}
                        size="lg"
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-[var(--color-app-fg)]">
                      {row.aspectText}
                    </div>
                    <div className="mt-1 text-xs font-semibold leading-relaxed text-[var(--color-shell-muted)]">
                      {row.aspectFeaturesText}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center text-[var(--color-shell-accent)]">
                <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" strokeWidth={2.5} />
              </div>

              <div className="min-w-0 rounded-xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-3">
                <div className="eyebrow">
                  Функциональный блок
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-active-bg)] px-3 py-1 text-xs font-black text-[var(--color-shell-active-fg)]">
                    {row.functionBlockLabel}
                  </span>
                  {row.functionIds.map(functionId => (
                    <span
                      key={functionId}
                      className="rounded-full border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-2.5 py-1 text-xs font-bold text-[var(--color-app-fg)]"
                      title={getFunctionName(functionId)}
                    >
                      {functionId} · {getFunctionName(functionId)}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-xs font-semibold leading-relaxed text-[var(--color-shell-muted)]">
                  {row.functionFeaturesText}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="mt-5 rounded-2xl border border-dashed border-[var(--color-shell-border-strong)] bg-[var(--color-shell-surface-muted)] p-4 text-sm font-semibold leading-relaxed text-[var(--color-shell-muted)]"
          data-tetrachotomy-source-block-fallback
        >
          Для этой формулы source-разбор отображения аспектов в функции будет добавлен отдельно.
        </div>
      )}
    </section>
  );
};
