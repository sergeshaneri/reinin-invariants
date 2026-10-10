import React from 'react';
import { Grid2X2 } from 'lucide-react';
import { selectTypeModelView } from '../data/selectors';
import type { SocionicTypeId } from '../data/socionics';
import type { TypeArpExampleViewModel } from '../data/typeArp';
import { AspectGlyph, type AspectDisplayMode } from '../components/AspectGlyph';
import { CyclePointers } from '../decorators/ProcessCycle';

export interface TypeModelDiagramProps {
  typeId: SocionicTypeId;
  aspectDisplayMode: AspectDisplayMode;
  arpExample?: TypeArpExampleViewModel;
  activeArpGroupIndex?: number | null;
  /** Committed selection; omitted preserves the legacy controlled API. */
  pinnedArpGroupIndex?: number | null;
  onArpGroupHover?: (groupIndex: number | null) => void;
  onArpGroupFocus?: (groupIndex: number | null) => void;
  onArpGroupSelect?: (groupIndex: number) => void;
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

export const TypeModelDiagram: React.FC<TypeModelDiagramProps> = ({ typeId, aspectDisplayMode, arpExample, activeArpGroupIndex = null, pinnedArpGroupIndex = activeArpGroupIndex, onArpGroupHover, onArpGroupFocus = onArpGroupHover, onArpGroupSelect }) => {
  const model = selectTypeModelView(typeId, 'ru');
  // A stale example must never replace the selected type's real assignments.
  const example = arpExample?.type.id === typeId ? arpExample : undefined;
  const cycle = example?.structuralCheck.cycle;
  const visibleTypeCode = model.type.aliases.find(alias => /[А-ЯЁа-яё]/.test(alias)) ?? model.type.name;
  const aliases = model.type.aliases
    .filter(alias => /[А-ЯЁа-яё]/.test(alias))
    .filter(alias => alias !== visibleTypeCode)
    .join(' - ');
  const quadra = QUADRA_LABELS[model.type.quadraId] ?? model.type.quadraId;

  return (
    <section
      className="glass-panel rounded-[28px] p-5 md:p-7"
      aria-labelledby="type-model-title"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="eyebrow mb-2 flex items-center gap-2">
            <Grid2X2 className="h-3.5 w-3.5 text-[var(--color-shell-accent)]" strokeWidth={2} />
            Модель А
          </p>
          <h2 id="type-model-title" className="text-2xl font-bold tracking-normal text-[var(--color-app-fg)] md:text-3xl">
            {visibleTypeCode}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--color-shell-muted)]">
            {model.type.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-left md:min-w-56">
          <MetaPill label="Квадра" value={quadra} />
          <MetaPill label="Псевдонимы" value={aliases || visibleTypeCode} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 md:gap-3">
        {model.assignments.map((assignment, assignmentIndex) => {
          const coloredAssignment = example?.assignments.find(cell => cell.functionId === assignment.functionId);
          const groupIndex = coloredAssignment?.highlightGroupIndex ?? null;
          const tileClassName = `relative min-h-40 rounded-2xl border border-[var(--color-shell-border)] ${groupIndex === null ? 'bg-[var(--color-shell-surface-muted)]' : `map-tone-${groupIndex} text-[var(--color-map-fg)]`} p-3 md:min-h-36 md:p-4`;
          const functionBadgeClassName = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-shell-border)] bg-[var(--color-shell-control)] font-mono text-xl font-bold leading-none text-[var(--color-app-fg)]';
          const aspectBadgeClassName = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-accent-soft)] text-[var(--color-shell-accent)]';

          return (
          <div
            key={assignment.functionId}
            className={tileClassName}
            style={cycle ? { gridColumn: assignmentIndex % 2 + 1, gridRow: Math.floor(assignmentIndex / 2) + (assignmentIndex >= 4 ? 2 : 1) } : undefined}
            data-type-model-function-id={assignment.functionId}
            data-type-model-aspect-id={assignment.aspectId}
            data-arp-group-index={groupIndex ?? ''}
            data-arp-active={groupIndex !== null && activeArpGroupIndex === groupIndex ? 'true' : undefined}
          >
            {groupIndex !== null ? (
              <button type="button" className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-shell-accent)]"
                aria-label={`${assignment.functionId}: ${assignment.functionName}, ${assignment.aspectFullName}. Группа ${groupIndex + 1}`}
                aria-pressed={pinnedArpGroupIndex === groupIndex}
                onMouseEnter={() => onArpGroupHover?.(groupIndex)} onMouseLeave={() => onArpGroupHover?.(null)}
                onFocus={() => onArpGroupFocus?.(groupIndex)} onBlur={() => onArpGroupFocus?.(null)}
                onClick={() => onArpGroupSelect?.(groupIndex)} />
            ) : null}
            {groupIndex !== null ? <span className="text-xs font-bold">Группа {groupIndex + 1}</span> : null}
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <div className="eyebrow">
                  {getRingLabel(assignment.functionId)}
                </div>
                <div className="mt-1 text-xs font-semibold text-[var(--color-shell-muted)]">
                  {BLOCK_LABELS[assignment.functionId]}
                </div>
              </div>
              <div className={functionBadgeClassName}>
                {assignment.functionId}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className={aspectBadgeClassName}>
                <AspectGlyph
                  aspectId={assignment.aspectId}
                  label={assignment.aspectName}
                  mode={aspectDisplayMode}
                  size="lg"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight text-[var(--color-shell-muted)]">
                  {assignment.functionName}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-[var(--color-app-fg)]">
                  {assignment.aspectFullName}
                </p>
              </div>
            </div>
          </div>
          );
        })}
        {cycle ? <div className="col-span-2 h-8 md:h-10" style={{ gridRow: 3 }} data-type-model-ring-gap aria-hidden="true" /> : null}
        {cycle?.rings.map((ring, index) => (
          <div key={index} className="pointer-events-none relative z-20" style={{ gridColumn: '1 / 3', gridRow: index === 0 ? '1 / 3' : '4 / 6' }} data-type-model-cycle-ring={ring.direction} aria-hidden="true">
            {/* Grid tracks bound each ring independently, even with wrapped labels. */}
            <div className="absolute -inset-2">
              <svg className="block h-full w-full overflow-visible" aria-hidden="true">
                <rect x="0" y="0" width="100%" height="100%" rx="16" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="6 5" />
              </svg>
              <CyclePointers direction={ring.direction} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const MetaPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] px-3 py-2">
    <div className="eyebrow">
      {label}
    </div>
    <div className="mt-1 truncate text-xs font-semibold text-[var(--color-shell-muted)]" title={value}>
      {value}
    </div>
  </div>
);
