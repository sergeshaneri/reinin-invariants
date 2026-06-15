import React from 'react';
import { Grid2X2 } from 'lucide-react';
import { selectTypeModelView } from '../data/selectors';
import type { SocionicTypeId } from '../data/socionics';
import { AspectGlyph, type AspectDisplayMode } from '../components/AspectGlyph';

interface Props {
  typeId: SocionicTypeId;
  aspectDisplayMode: AspectDisplayMode;
}

const RING_LABELS: Record<number, string> = {
  1: 'Ментальное',
  5: 'Витальное',
};

const BLOCK_LABELS: Record<number, string> = {
  1: 'Эго',
  2: 'Эго',
  3: 'Суперэго',
  4: 'Суперэго',
  5: 'Суперид',
  6: 'Суперид',
  7: 'Ид',
  8: 'Ид',
};

const QUADRA_LABELS: Record<string, string> = {
  alpha: 'Альфа',
  beta: 'Бета',
  gamma: 'Гамма',
  delta: 'Дельта',
};

const getRingLabel = (functionId: number): string => (
  functionId <= 4 ? RING_LABELS[1] : RING_LABELS[5]
);

export const TypeModelDiagram: React.FC<Props> = ({ typeId, aspectDisplayMode }) => {
  const model = selectTypeModelView(typeId, 'ru');
  const visibleTypeCode = model.type.aliases.find(alias => /[А-ЯЁа-яё]/.test(alias)) ?? model.type.name;
  const aliases = model.type.aliases
    .filter(alias => /[А-ЯЁа-яё]/.test(alias))
    .filter(alias => alias !== visibleTypeCode)
    .join(' - ');
  const quadra = QUADRA_LABELS[model.type.quadraId] ?? model.type.quadraId;

  return (
    <section
      className="bg-white rounded-[28px] border border-slate-200/60 p-5 md:p-7"
      style={{ boxShadow: '0 20px 40px -20px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)' }}
      aria-labelledby="type-model-title"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Grid2X2 className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
            Модель А
          </p>
          <h2 id="type-model-title" className="text-2xl font-bold tracking-normal text-slate-950 md:text-3xl">
            {visibleTypeCode}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            {model.type.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-left md:min-w-56">
          <MetaPill label="Квадра" value={quadra} />
          <MetaPill label="Псевдонимы" value={aliases || visibleTypeCode} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 md:gap-3">
        {model.assignments.map((assignment) => {
          const tileClassName = 'min-h-40 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 md:min-h-36 md:p-4';
          const functionBadgeClassName = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white font-mono text-xl font-bold leading-none text-slate-950 shadow-sm';
          const aspectBadgeClassName = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700';

          return (
          <div
            key={assignment.functionId}
            className={tileClassName}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {getRingLabel(assignment.functionId)}
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-500">
                  {BLOCK_LABELS[assignment.functionId]}
                </div>
              </div>
              <div className={functionBadgeClassName}>
                {assignment.functionId}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={aspectBadgeClassName}>
                <AspectGlyph
                  aspectId={assignment.aspectId}
                  label={assignment.aspectName}
                  mode={aspectDisplayMode}
                  size="lg"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight text-slate-500">
                  {assignment.functionName}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">
                  {assignment.aspectFullName}
                </p>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
};

const MetaPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
      {label}
    </div>
    <div className="mt-1 truncate text-xs font-semibold text-slate-700" title={value}>
      {value}
    </div>
  </div>
);
