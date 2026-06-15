import React from 'react';
import { Grid2X2 } from 'lucide-react';
import type { View } from '../data/socionics';
import { selectTypeModelPreviews } from '../data/selectors';
import type { SocionicTypeId } from '../data/types';
import { AspectGlyph, type AspectDisplayMode } from './AspectGlyph';

interface Props {
  typeIds: readonly SocionicTypeId[];
  view: View;
  aspectDisplayMode: AspectDisplayMode;
}

const getTypeCode = (aliases: readonly string[], fallback: string): string => aliases[0] ?? fallback;

const HIGHLIGHT_TONES = [
  'bg-sky-100',
  'bg-emerald-100',
  'bg-amber-100',
  'bg-rose-100',
  'bg-violet-100',
  'bg-cyan-100',
  'bg-lime-100',
  'bg-fuchsia-100',
] as const;

const hasProcessCycleDecorator = (view: View): boolean => (
  view.decoratorIds?.includes('process-cycle') === true
);

export const ModelAPreviewGrid: React.FC<Props> = ({
  typeIds,
  view,
  aspectDisplayMode,
}) => {
  const previews = selectTypeModelPreviews(typeIds, view);
  const showProcessCycle = hasProcessCycleDecorator(view);

  return (
    <div className="mt-5" data-model-preview-grid>
      <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        <Grid2X2 className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
        Модель А
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {previews.map(preview => {
          const typeCode = getTypeCode(preview.type.aliases, preview.type.id);
          const secondaryAlias = preview.type.aliases.find(alias => alias !== typeCode);

          return (
            <article
              key={preview.type.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              data-model-preview-type-id={preview.type.id}
            >
              <div className="relative">
                {showProcessCycle ? <MiniProcessCycle /> : null}
                <div className="grid grid-cols-2 border border-slate-900 bg-white">
                  {preview.assignments.map((assignment, assignmentIndex) => (
                    <React.Fragment key={assignment.functionId}>
                      {showProcessCycle && assignmentIndex === 4 ? (
                        <div className="col-span-2 h-3 bg-white" aria-hidden="true" />
                      ) : null}
                      <div
                        className={`flex aspect-square min-h-10 flex-col items-center justify-center border border-slate-900 text-slate-950 ${
                          assignment.highlightGroupIndex !== null
                            ? HIGHLIGHT_TONES[assignment.highlightGroupIndex % HIGHLIGHT_TONES.length]
                            : 'bg-white'
                        }`}
                        data-model-preview-function-id={assignment.functionId}
                        data-model-preview-aspect-id={assignment.aspectId}
                        data-model-preview-highlighted={assignment.isHighlighted ? 'true' : 'false'}
                        data-model-preview-highlight-group={assignment.highlightGroupIndex ?? ''}
                        title={`${assignment.functionId}: ${assignment.aspectFullName}`}
                      >
                        <AspectGlyph
                          aspectId={assignment.aspectId}
                          label={assignment.aspectName}
                          mode={aspectDisplayMode}
                          size="sm"
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11px] font-black leading-tight text-slate-950">
                  {typeCode}
                </div>
                <div className="truncate text-[10px] font-semibold leading-tight text-slate-500" title={preview.type.name}>
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
    <svg
      className="absolute -right-0.5 -top-1.5 h-3 w-3"
      viewBox="0 0 12 12"
    >
      <polygon points="1,0 11,6 1,12" fill="currentColor" />
    </svg>

    <MiniCycleRing direction="ccw" className="absolute inset-x-0 -bottom-1 h-[calc((100%-0.75rem)/2+0.5rem)]" />
    <svg
      className="absolute -left-0.5 top-[calc(50%+0.1rem)] h-3 w-3"
      viewBox="0 0 12 12"
    >
      <polygon points="11,0 1,6 11,12" fill="currentColor" />
    </svg>
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
  </div>
);
