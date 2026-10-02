import React, { useMemo, useState } from 'react';
import { ArrowRight, Route } from 'lucide-react';
import { ASPECTS, FUNCTIONS, MODEL_A_LAYOUT, type View } from '../data/socionics';
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

type Highlight = 'full' | 'dim' | 'unused';

interface Props {
  view: PartitionExplorerViewModel;
  aspectDisplayMode: AspectDisplayMode;
  baseView: View | null;
}

const SourceFeatures: React.FC<{ text: string; kind: 'aspect' | 'function' }> = ({ text, kind }) => (
  <div className="flex flex-wrap gap-1 text-xs leading-relaxed text-[var(--color-shell-muted)]">
    {text.trim().split(/\s+/u).filter(Boolean).map((feature, index) => (
      <span
        key={`${feature}-${index}`}
        className="source-feature rounded-md border px-1.5 py-0.5"
        data-source-feature={kind}
      >
        {feature}
      </span>
    ))}
  </div>
);

export const TetrachotomyAspectFunctionPanel: React.FC<Props> = ({
  view,
  aspectDisplayMode,
  baseView,
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
      return 'unused';
    }

    if (activeCell && activeCell.rowIndex !== rowIndex) {
      return 'dim';
    }

    return 'full';
  };

  const styleFor = (toneIndex: number | undefined, highlight: Highlight): string => {
    if (toneIndex === undefined) {
      return `${INACTIVE} opacity-45 scale-100`;
    }

    const tone = `${MAPPING_BG[toneIndex % MAPPING_BG.length]} text-[var(--color-map-fg)]`;

    return `${tone} ${highlight === 'unused' ? 'opacity-45 scale-100' : highlight === 'dim' ? 'opacity-25 scale-95' : 'opacity-100 scale-100'}`;
  };

  return (
    <section
      className="tetra-invariant-panel glass-panel rounded-[28px] p-5"
      data-source-aspect-display={aspectDisplayMode}
      data-tetrachotomy-model-a-slot
      data-tetrachotomy-aspect-function-panel={sourceFormula?.id ?? 'structural'}
      data-source-block-status={sourceBlock?.status ?? 'missing'}
    >
      <div className="tetra-panel-header flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="tetra-panel-title min-w-0">
          <div className="tetra-panel-eyebrow eyebrow flex items-center gap-2">
            <Route className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            Отображение аспектов в функции
          </div>
          <h2 className="tetra-panel-heading mt-2 text-lg font-bold leading-tight text-[var(--color-app-fg)]">
            Общий инвариант выбранной тетрады в модели А
          </h2>
          {sourceBlock && sourceBlock.labels.length > 0 ? (
            <div className="tetra-panel-labels mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-[var(--color-shell-muted)]">
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
        <div className="tetra-panel-source glass-muted shrink-0 rounded-2xl px-3 py-2 text-right">
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
          <div className="tetra-invariant-map">
            <div>
              <div className="mb-3 flex items-center justify-center gap-2">
                <div className="hairline h-px flex-1" />
                <h3 className="eyebrow text-center">Аспектон</h3>
                <div className="hairline h-px flex-1" />
              </div>
              <div className="tetra-aspect-grid grid grid-cols-4 gap-2">
                {ASPECTS.map(aspect => {
                  const rowIndex = aspectToRow.get(aspect.id);
                  const highlight = getHighlight(rowIndex);
                  const baseIndex = baseView?.mappings.findIndex(mapping => mapping.aspects.includes(aspect.id)) ?? -1;
                  // A partial base view leaves the complementary aspects outside its mappings.
                  // Give that unused group a separate muted tone, never a source-row index.
                  const toneIndex = rowIndex ?? (baseIndex >= 0 ? baseIndex : sourceBlock.rows.length);

                  return (
                    <button
                      key={aspect.id}
                      type="button"
                      title={`${aspect.name}: ${aspect.fullName}`}
                      aria-label={`${aspect.fullName}. ${sourceBlock.rows[rowIndex ?? -1]?.aspectFeaturesText ?? 'не входит в source-разбор'}`}
                      onMouseEnter={() => {
                        setActiveCell(rowIndex === undefined ? null : { kind: 'aspect', id: aspect.id, rowIndex });
                      }}
                      onFocus={() => {
                        setActiveCell(rowIndex === undefined ? null : { kind: 'aspect', id: aspect.id, rowIndex });
                      }}
                      onBlur={() => setActiveCell(null)}
                      className={`tetra-aspect-tile relative flex cursor-pointer items-center justify-center rounded-xl border-2 transition-[opacity,transform,background-color,border-color] duration-200 ${styleFor(toneIndex, highlight)}`}
                      data-tetrachotomy-source-aspect={aspect.name}
                      data-source-row-index={rowIndex ?? ''}
                    >
                      <span className="flex flex-col items-center gap-1.5">
                        <AspectGlyph
                          aspectId={aspect.id}
                          label={aspect.name}
                          mode={aspectDisplayMode}
                          size="xl"
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="tetra-map-direction flex items-center justify-center text-[var(--color-shell-accent)]" aria-hidden="true">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-control)]">
                <ArrowRight className="tetra-map-arrow h-4 w-4" strokeWidth={2.5} />
              </span>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-center gap-2">
                <div className="hairline h-px flex-1" />
                <h3 className="eyebrow text-center">Функцион</h3>
                <div className="hairline h-px flex-1" />
              </div>
              <div className="tetra-function-grid grid grid-cols-2 gap-2">
                {MODEL_A_LAYOUT.map(functionId => {
                  const rowIndex = functionToRow.get(functionId);
                  const functionName = getFunctionName(functionId);
                  const highlight = getHighlight(rowIndex);
                  const baseIndex = baseView?.mappings.findIndex(mapping => mapping.functions.includes(functionId)) ?? -1;
                  const toneIndex = rowIndex ?? (baseIndex >= 0 ? baseIndex : undefined);

                  return (
                    <button
                      key={functionId}
                      type="button"
                      title={`${functionId}: ${functionName}`}
                      aria-label={`${functionId} ${functionName}. ${sourceBlock.rows[rowIndex ?? -1]?.functionFeaturesText ?? 'не входит в source-разбор'}`}
                      onMouseEnter={() => {
                        setActiveCell(rowIndex === undefined ? null : { kind: 'function', id: functionId, rowIndex });
                      }}
                      onFocus={() => {
                        setActiveCell(rowIndex === undefined ? null : { kind: 'function', id: functionId, rowIndex });
                      }}
                      onBlur={() => setActiveCell(null)}
                      className={`tetra-function-tile relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition-[opacity,transform,background-color,border-color] duration-200 ${styleFor(toneIndex, highlight)}`}
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
            <p
              className="mb-1 text-xs leading-relaxed text-[var(--color-shell-muted)]"
              data-tetrachotomy-invariant-explanation
            >
              Каждая строка задаёт группу функций, в которую попадают указанные аспекты у всех типов выбранной тетрады.
            </p>
            {sourceBlock.rows.map((row, rowIndex) => (
              <div
                key={`${row.aspectText}-${row.functionBlockLabel}`}
                className="tetra-source-row relative grid rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-3 pl-4"
                data-tetrachotomy-aspect-function-row={row.aspectText}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-4 left-0 w-1 rounded-r ${MAPPING_BG[rowIndex % MAPPING_BG.length]}`}
                />
                <div className="min-w-0">
                  <h3 className="source-row-heading eyebrow mb-2">Аспекты</h3>
                  <div className="mb-2 flex flex-wrap items-start gap-3">
                    {row.aspectIds.map(aspectId => (
                      <AspectGlyph
                        key={aspectId}
                        aspectId={aspectId}
                        label={ASPECTS.find(aspect => aspect.id === aspectId)?.name ?? aspectId}
                        mode={aspectDisplayMode === 'symbol' ? 'symbol' : 'icon-symbol'}
                        size="sm"
                      />
                    ))}
                  </div>
                  <SourceFeatures text={row.aspectFeaturesText} kind="aspect" />
                </div>

                <div
                  className="source-row-direction flex justify-center text-[var(--color-shell-subtle)]"
                  aria-hidden="true"
                  data-source-row-direction
                >
                  <ArrowRight className="source-row-arrow h-4 w-4" strokeWidth={2.25} />
                </div>

                <div className="min-w-0">
                  <h3 className="source-row-heading eyebrow mb-2" aria-label="Функции модели А">
                    Функции<span className="source-row-model-caption"> модели А</span>
                  </h3>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {row.functionBlockLabel ? (
                      <span className="text-xs font-medium text-[var(--color-app-fg)]">
                        {row.functionBlockLabel}
                      </span>
                    ) : null}
                    {row.functionIds.map(functionId => (
                      <span
                        key={functionId}
                        className={`rounded-lg border px-2.5 py-1 font-mono text-sm font-medium text-[var(--color-map-fg)] ${MAPPING_BG[rowIndex % MAPPING_BG.length]}`}
                        title={getFunctionName(functionId)}
                        data-source-function-chip={functionId}
                      >
                        {functionId}
                      </span>
                    ))}
                  </div>
                  <SourceFeatures text={row.functionFeaturesText} kind="function" />
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
