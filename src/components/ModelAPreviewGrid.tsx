import React from 'react';
import { Grid2X2 } from 'lucide-react';
import type { View } from '../data/socionics';
import { selectTypeModelPreviews, selectTypeModelPreviewsForSourceRows } from '../data/selectors';
import type { PartitionExplorerViewModel } from '../data/selectors';
import type { SocionicTypeId } from '../data/types';
import { AspectGlyph, type AspectDisplayMode } from './AspectGlyph';
import { CyclePointers } from '../decorators/ProcessCycle';

type SourceFormulaViewModel = NonNullable<PartitionExplorerViewModel['sourceFormula']>;
type SourceFormulaBlock = NonNullable<SourceFormulaViewModel['sourceBlocks']>[number];

export interface ModelAPreviewGridProps {
  typeIds: readonly SocionicTypeId[];
  view: View;
  aspectDisplayMode: AspectDisplayMode;
  sourceBlock?: SourceFormulaBlock | null;
  selectedTypeId?: SocionicTypeId;
  onSelectType?: (typeId: SocionicTypeId) => void;
}

const getTypeCode = (aliases: readonly string[], fallback: string): string => aliases[0] ?? fallback;

const HIGHLIGHT_TONES = [
  'map-tone-0 text-[var(--color-map-fg)]',
  'map-tone-1 text-[var(--color-map-fg)]',
  'map-tone-2 text-[var(--color-map-fg)]',
  'map-tone-3 text-[var(--color-map-fg)]',
  'map-tone-4 text-[var(--color-map-fg)]',
  'map-tone-5 text-[var(--color-map-fg)]',
  'map-tone-6 text-[var(--color-map-fg)]',
  'map-tone-7 text-[var(--color-map-fg)]',
] as const;

const hasProcessCycleDecorator = (view: View): boolean => (
  view.decoratorIds?.includes('process-cycle') === true
);

const getFunctionGroupIndex = (view: View, functionId: number): number | null => {
  const index = view.mappings.findIndex(mapping => mapping.functions.includes(functionId));

  return index >= 0 ? index : null;
};

export const ModelAPreviewGrid: React.FC<ModelAPreviewGridProps> = ({
  typeIds,
  view,
  aspectDisplayMode,
  sourceBlock,
  selectedTypeId,
  onSelectType,
}) => {
  const previews = sourceBlock
    ? selectTypeModelPreviewsForSourceRows(typeIds, sourceBlock.rows)
    : selectTypeModelPreviews(typeIds, view);
  const showProcessCycle = hasProcessCycleDecorator(view);

  return (
    <div className="mt-5" data-model-preview-grid>
      <div className="eyebrow mb-3 flex items-center gap-2">
        <Grid2X2 className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
        Модель А
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {previews.map(preview => {
          const typeCode = getTypeCode(preview.type.aliases, preview.type.id);
          const secondaryAlias = preview.type.aliases.find(alias => alias !== typeCode);

          return (
            <article
              key={preview.type.id}
              className="relative rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-3"
              data-model-preview-type-id={preview.type.id}
              data-model-preview-selected={selectedTypeId === preview.type.id ? 'true' : undefined}
            >
              {onSelectType ? <button type="button" className="absolute inset-0 z-20 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-shell-accent)]"
                aria-label={`Выбрать тип ${typeCode}: ${preview.type.name}${selectedTypeId === preview.type.id ? '. Выбранный тип' : ''}`}
                aria-pressed={selectedTypeId === preview.type.id} onClick={() => onSelectType(preview.type.id)} /> : null}
              <div className="relative">
                {showProcessCycle ? <MiniProcessCycle /> : null}
                <div className="grid grid-cols-2 border border-[var(--color-app-fg)] bg-[var(--color-shell-control)]">
                  {preview.assignments.map((assignment, assignmentIndex) => {
                    const fallbackFunctionGroupIndex = selectedTypeId === undefined && !onSelectType && assignment.highlightGroupIndex === null
                      ? getFunctionGroupIndex(view, assignment.functionId)
                      : null;
                    const toneIndex = assignment.highlightGroupIndex ?? fallbackFunctionGroupIndex;
                    const isMuted = assignment.highlightIntensity === 'secondary' || assignment.highlightGroupIndex === null;

                    return (
                      <React.Fragment key={assignment.functionId}>
                        {showProcessCycle && assignmentIndex === 4 ? (
                          <div className="col-span-2 h-3 bg-[var(--color-shell-control)]" aria-hidden="true" />
                        ) : null}
                        <div
                          className={`flex aspect-square min-h-14 flex-col items-center justify-center border border-[var(--color-app-fg)] p-1.5 ${
                            toneIndex !== null
                              ? HIGHLIGHT_TONES[toneIndex % HIGHLIGHT_TONES.length]
                              : 'bg-[var(--color-shell-control)] text-[var(--color-app-fg)]'
                          } ${isMuted ? 'opacity-45' : 'opacity-100'}`}
                          data-model-preview-function-id={assignment.functionId}
                          data-model-preview-aspect-id={assignment.aspectId}
                          data-model-preview-highlighted={assignment.isHighlighted ? 'true' : 'false'}
                          data-model-preview-highlight-group={assignment.highlightGroupIndex ?? ''}
                          data-model-preview-function-group={fallbackFunctionGroupIndex ?? ''}
                          data-model-preview-highlight-intensity={assignment.highlightIntensity ?? ''}
                          title={`${assignment.functionId}: ${assignment.aspectFullName}`}
                        >
                          <AspectGlyph
                            aspectId={assignment.aspectId}
                            label={assignment.aspectName}
                            mode={aspectDisplayMode}
                            size="xl"
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
              <div className="mt-2 text-center">
                {selectedTypeId === preview.type.id ? <div className="mb-1 text-[10px] font-bold text-[var(--color-shell-accent)]">Выбранный тип</div> : null}
                <div className="text-[11px] font-black leading-tight text-[var(--color-app-fg)]">
                  {typeCode}
                </div>
                <div className="truncate text-[10px] font-semibold leading-tight text-[var(--color-shell-muted)]" title={preview.type.name}>
                  {secondaryAlias ?? preview.type.name}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

const MiniProcessCycle: React.FC = () => (
  <div
    className="pointer-events-none absolute -inset-x-2 -inset-y-1 z-10 text-violet-600 opacity-70"
    aria-hidden="true"
  >
    <MiniCycleRing direction="cw" className="absolute inset-x-0 -top-1 h-[calc((100%-0.75rem)/2+0.5rem)]" />
    <MiniCycleRing direction="ccw" className="absolute inset-x-0 -bottom-1 h-[calc((100%-0.75rem)/2+0.5rem)]" />
  </div>
);

const MiniCycleRing: React.FC<{ direction: 'cw' | 'ccw'; className: string }> = ({
  direction,
  className,
}) => (
  <div className={className}>
    <svg className="h-full w-full overflow-visible" aria-hidden="true">
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        strokeLinecap="round"
        className={`marching-ants-${direction}`}
      />
    </svg>
    <CyclePointers direction={direction} />
  </div>
);
