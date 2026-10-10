import React from 'react';
import type { TypeArpExampleViewModel } from '../data/typeArp';
import { AspectGlyph, type AspectDisplayMode } from './AspectGlyph';

export interface TypeArpExplanationProps {
  example: TypeArpExampleViewModel;
  aspectDisplayMode: AspectDisplayMode;
  activeGroupIndex?: number | null;
  /** Committed selection; omitted preserves the legacy controlled API. */
  pinnedGroupIndex?: number | null;
  onGroupHover?: (groupIndex: number | null) => void;
  onGroupFocus?: (groupIndex: number | null) => void;
  onGroupSelect?: (groupIndex: number) => void;
}

const verdict = (value: boolean | null) => value === null ? 'не проверено' : value ? 'подтверждено' : 'не подтверждено';

export const TypeArpExplanation: React.FC<TypeArpExplanationProps> = ({
  example, aspectDisplayMode, activeGroupIndex = null, pinnedGroupIndex = activeGroupIndex, onGroupHover, onGroupFocus = onGroupHover, onGroupSelect,
}) => {
  const check = example.structuralCheck;
  const typeCode = example.type.aliases.find(alias => /[А-ЯЁа-яё]/.test(alias)) ?? example.type.name;
  return (
    <section className="glass-panel rounded-[28px] p-5" aria-label={`Как это устроено у ${typeCode}`} data-type-arp-explanation>
      <h2 className="text-lg font-bold text-[var(--color-app-fg)]">Как это устроено у {typeCode}</h2>
      <p className="mt-2 text-sm text-[var(--color-shell-muted)]">Цвет обозначает группу аспектов. Ниже — её фактическое размещение в модели выбранного типа.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {example.groups.map(group => (
          <button key={group.groupIndex} type="button"
            className={`rounded-2xl border p-3 text-left map-tone-${group.highlightGroupIndex} text-[var(--color-map-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-shell-accent)]`}
            data-arp-group-index={group.groupIndex} data-arp-active={activeGroupIndex === group.groupIndex ? 'true' : undefined}
            aria-pressed={pinnedGroupIndex === group.groupIndex}
            onMouseEnter={() => onGroupHover?.(group.groupIndex)} onMouseLeave={() => onGroupHover?.(null)}
            onFocus={() => onGroupFocus?.(group.groupIndex)} onBlur={() => onGroupFocus?.(null)}
            onClick={() => onGroupSelect?.(group.groupIndex)}>
            <span className="block text-sm font-bold">Группа {group.groupIndex + 1}: {group.aspectLabel}</span>
            <span className="my-2 flex flex-wrap gap-3">
              {group.relatedCells.map(cell => (
                <span key={cell.functionId} className="flex items-center gap-1" title={`${cell.aspectFullName}: ${cell.functionName}`}>
                  <AspectGlyph aspectId={cell.aspectId} label={cell.aspectName} mode={aspectDisplayMode} />
                  <span className="text-xs">→ {cell.functionId} ({cell.functionName})</span>
                </span>
              ))}
            </span>
            <span className="block text-sm leading-relaxed">{group.explanation}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm leading-relaxed text-[var(--color-shell-muted)]" data-arp-structural-status={check.status}>
        <p>{check.status === 'passed' ? 'Структурное условие подтверждено вычислением по назначениям модели.'
          : check.status === 'failed' ? 'Структурное условие не подтверждено.' : 'Недостаточно данных для структурной проверки.'}</p>
        {example.semanticKind !== 'fixed-mapping' ? <p>Сохранение блоков: {verdict(check.blockPreservation)}.</p> : null}
        {example.semanticKind === 'cyclic-order' ? <p>Циклический порядок: {verdict(check.cyclicOrder)}.</p> : null}
        {check.cycle ? <>
          <p className="mt-2">{check.cycle.explanation}</p>
          <ul>{check.cycle.tacts.map(tact => <li key={tact.blockIndex}>{tact.label}: функции {`{${tact.functionIds.join(', ')}}`}</li>)}</ul>
        </> : null}
        {check.diagnostics.length > 0 ? <ul className="mt-2 list-disc pl-5">{check.diagnostics.map((diagnostic, index) => (
          <li key={index}>{diagnostic.groupIndex === undefined ? '' : `Группа ${diagnostic.groupIndex + 1}: `}{diagnostic.message}</li>
        ))}</ul> : null}
      </div>
    </section>
  );
};
