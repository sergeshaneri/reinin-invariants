import React, { useMemo, useState } from 'react';
import { ArrowRight, Route } from 'lucide-react';
import { ASPECTS, FUNCTIONS, MODEL_A_LAYOUT } from '../data/socionics';
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

const MAPPING_BG = [
  'map-tone-0',
  'map-tone-1',
  'map-tone-2',
  'map-tone-3',
  'map-tone-4',
  'map-tone-5',
  'map-tone-6',
  'map-tone-7',
] as const;

const INACTIVE = 'map-tone-inactive';

type ActiveSourceCell =
  | { kind: 'aspect'; id: string; rowIndex: number }
  | { kind: 'function'; id: number; rowIndex: number }
  | null;

type Highlight = 'full' | 'dim' | 'hidden';

interface Props {
  view: PartitionExplorerViewModel;
  aspectDisplayMode: AspectDisplayMode;
}

export const TetrachotomyAspectFunctionPanel: React.FC<Props> = ({
  view,
  aspectDisplayMode,
}) => {
  const { selectedClass, sourceFormula } = view;
  const [activeCell, setActiveCell] = useState<ActiveSourceCell>(null);

  const sourceBlock = sourceFormula
    ? findSelectedSourceBlock(sourceFormula, selectedClass)
    : null;

  const { aspectToRow, functionToRow } = useMemo(() => {
    const aspects = new Map<string, number>();
    const functions = new Map<number, number>();

    sourceBlock?.rows.forEach((row, rowIndex) => {
      row.aspectIds.forEach(aspectId => aspects.set(aspectId, rowIndex));
      row.functionIds.forEach(functionId => functions.set(functionId, rowIndex));
    });

    return {
      aspectToRow: aspects,
      functionToRow: functions,
    };
  }, [sourceBlock]);

  const getHighlight = (rowIndex: number | undefined): Highlight => {
    if (rowIndex === undefined) {
      return 'hidden';
    }

    if (activeCell && activeCell.rowIndex !== rowIndex) {
      return 'dim';
    }

    return 'full';
  };

  const styleFor = (rowIndex: number | undefined, highlight: Highlight): string => {
    if (highlight === 'hidden' || rowIndex === undefined) {
      return `${INACTIVE} opacity-100 scale-100`;
    }

    const tone = `${MAPPING_BG[rowIndex % MAPPING_BG.length]} text-[var(--color-map-fg)]`;

    return `${tone} ${highlight === 'dim' ? 'opacity-25 scale-95' : 'opacity-100 scale-100'}`;
  };

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
        <div
          className="mt-5"
          data-tetrachotomy-source-block={sortedTypeKey(sourceBlock.typeIds)}
          onMouseLeave={() => setActiveCell(null)}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.72fr)] lg:items-start">
            <div>
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="hairline h-px flex-1" />
                <h3 className="eyebrow text-center">Аспектон</h3>
                <div className="hairline h-px flex-1" />
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {ASPECTS.map(aspect => {
                  const rowIndex = aspectToRow.get(aspect.id);
                  const highlight = getHighlight(rowIndex);

                  return (
                    <button
                      key={aspect.id}
                      type="button"
                      title={`${aspect.name}: ${aspect.fullName}`}
                      aria-label={`${aspect.fullName}. ${sourceBlock.rows[rowIndex ?? -1]?.aspectFeaturesText ?? 'не входит в source-разбор'}`}
                      onMouseEnter={() => {
                        if (rowIndex !== undefined) {
                          setActiveCell({ kind: 'aspect', id: aspect.id, rowIndex });
                        }
                      }}
                      onFocus={() => {
                        if (rowIndex !== undefined) {
                          setActiveCell({ kind: 'aspect', id: aspect.id, rowIndex });
                        }
                      }}
                      onBlur={() => setActiveCell(null)}
                      className={`relative flex h-20 cursor-pointer items-center justify-center rounded-xl border-2 transition-[opacity,transform,background-color,border-color] duration-200 ${styleFor(rowIndex, highlight)}`}
                      data-tetrachotomy-source-aspect={aspect.name}
                      data-source-row-index={rowIndex ?? ''}
                    >
                      <span className="flex flex-col items-center gap-1.5">
                        <AspectGlyph
                          aspectId={aspect.id}
                          label={aspect.name}
                          mode={aspectDisplayMode}
                          size="sm"
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center text-[var(--color-shell-accent)] lg:min-h-[132px]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-control)]">
                <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" strokeWidth={2.5} />
              </span>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="hairline h-px flex-1" />
                <h3 className="eyebrow text-center">Функцион</h3>
                <div className="hairline h-px flex-1" />
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {MODEL_A_LAYOUT.map(functionId => {
                  const rowIndex = functionToRow.get(functionId);
                  const functionName = getFunctionName(functionId);
                  const highlight = getHighlight(rowIndex);

                  return (
                    <button
                      key={functionId}
                      type="button"
                      title={`${functionId}: ${functionName}`}
                      aria-label={`${functionId} ${functionName}. ${sourceBlock.rows[rowIndex ?? -1]?.functionFeaturesText ?? 'не входит в source-разбор'}`}
                      onMouseEnter={() => {
                        if (rowIndex !== undefined) {
                          setActiveCell({ kind: 'function', id: functionId, rowIndex });
                        }
                      }}
                      onFocus={() => {
                        if (rowIndex !== undefined) {
                          setActiveCell({ kind: 'function', id: functionId, rowIndex });
                        }
                      }}
                      onBlur={() => setActiveCell(null)}
                      className={`relative flex h-16 cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition-[opacity,transform,background-color,border-color] duration-200 ${styleFor(rowIndex, highlight)}`}
                      data-tetrachotomy-source-function={functionId}
                      data-source-row-index={rowIndex ?? ''}
                    >
                      <span className="font-mono text-xl font-bold leading-none">{functionId}</span>
                      <span className="mt-1 text-[10px] font-medium leading-none opacity-80">{functionName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-t border-[var(--color-shell-border)] pt-5">
            {sourceBlock.rows.map((row, rowIndex) => (
              <div
                key={`${row.aspectText}-${row.functionBlockLabel}`}
                className="grid gap-3 rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center"
                data-tetrachotomy-aspect-function-row={row.aspectText}
              >
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 shrink-0 rounded ${MAPPING_BG[rowIndex % MAPPING_BG.length]}`}
                    />
                    <div className="flex flex-wrap items-center gap-1.5">
                      {row.aspectIds.map(aspectId => (
                        <AspectGlyph
                          key={aspectId}
                          aspectId={aspectId}
                          label={row.aspectText}
                          mode={aspectDisplayMode}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-semibold leading-relaxed text-[var(--color-shell-muted)]">
                    {row.aspectFeaturesText}
                  </div>
                </div>

                <div className="hidden text-[var(--color-shell-subtle)] lg:block">
                  <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-active-bg)] px-3 py-1 text-xs font-black text-[var(--color-shell-active-fg)]">
                      {row.functionBlockLabel}
                    </span>
                    {row.functionIds.map(functionId => (
                      <span
                        key={functionId}
                        className="rounded-lg border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--color-app-fg)]"
                        title={getFunctionName(functionId)}
                      >
                        {functionId}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-semibold leading-relaxed text-[var(--color-shell-muted)]">
                    {row.functionFeaturesText}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
