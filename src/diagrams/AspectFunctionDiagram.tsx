import { Fragment, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shuffle } from 'lucide-react';
import {
  ASPECTS, FUNCTIONS, MODEL_A_LAYOUT,
  AspectId, Aspect, SocionicFunction,
  deriveGroupFeatures, formatGroupLabel, formatAspectFeatures,
  deriveGroupFunctionFeatures, formatFunctionGroupLabel, formatFunctionFeatures,
} from '../data/socionics';
import type { DiagramComponent } from './types';
import { DECORATORS } from '../decorators/registry';
import { AspectIcon } from '../components/AspectIcon';

const MAPPING_BG = [
  'map-tone-0',
  'map-tone-1',
  'map-tone-2',
  'map-tone-3',
  'map-tone-4',
  'map-tone-5',
  'map-tone-6',
  'map-tone-7',
];
const INACTIVE = 'map-tone-inactive';

const aspectById = new Map<AspectId, Aspect>(ASPECTS.map(a => [a.id, a]));
const functionById = new Map<number, SocionicFunction>(FUNCTIONS.map(f => [f.id, f]));

// Состояние подсветки одной клетки.
type Highlight = 'full' | 'dim' | 'hidden';

const PULSE_INTERVAL_MS = 1800;

export const AspectFunctionDiagram: DiagramComponent = ({
  trait, pole, view,
  activeCell,
  onAspectHover,
  onFunctionHover,
  onAspectClick,
  onFunctionClick,
}) => {
  const mappings = view.mappings;
  const isBlock = view.isBlockPermutation === true;
  const activeAspect = activeCell?.kind === 'aspect' ? activeCell.id : null;
  const activeFunction = activeCell?.kind === 'function' ? activeCell.id : null;

  const { aspectToIdx, functionToIdx, aspectGroupLabels, functionGroupLabels } = useMemo(() => {
    const a = new Map<AspectId, number>();
    const f = new Map<number, number>();
    const aspectLabels: string[] = [];
    const functionLabels: string[] = [];

    mappings.forEach((m, idx) => {
      m.aspects.forEach(id => a.set(id, idx));
      m.functions.forEach(id => f.set(id, idx));

      const aspects = m.aspects.map(id => aspectById.get(id)!).filter(Boolean);
      aspectLabels.push(formatGroupLabel(deriveGroupFeatures(aspects)));

      const fns = m.functions.map(id => functionById.get(id)!).filter(Boolean);
      functionLabels.push(formatFunctionGroupLabel(deriveGroupFunctionFeatures(fns)));
    });

    return { aspectToIdx: a, functionToIdx: f, aspectGroupLabels: aspectLabels, functionGroupLabels: functionLabels };
  }, [mappings]);

  // Pulse-перебор блоков: запускается, только если view блочный и есть hover/pin.
  const [pulseIdx, setPulseIdx] = useState<number | null>(null);
  useEffect(() => {
    if (!isBlock) { setPulseIdx(null); return; }
    const hasHover = activeCell !== null;
    if (!hasHover) { setPulseIdx(null); return; }
    setPulseIdx(0);
    const id = setInterval(() => {
      setPulseIdx(prev => (prev === null ? 0 : (prev + 1) % mappings.length));
    }, PULSE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isBlock, activeCell, mappings.length]);

  // Подсветка плитки аспекта.
  const aspectHighlight = (id: AspectId): Highlight => {
    const mIdx = aspectToIdx.get(id);
    if (mIdx === undefined) return 'hidden';

    if (isBlock) {
      if (activeAspect !== null) {
        const hoverMIdx = aspectToIdx.get(activeAspect);
        return mIdx === hoverMIdx ? 'full' : 'dim';
      }
      if (activeFunction !== null) {
        // Перебор: pulse-блок аспектов "примеряется" к hover-функции.
        return mIdx === pulseIdx ? 'full' : 'dim';
      }
      return 'full';
    }

    // Класс 1/2: жёсткая пара.
    if (activeFunction !== null) {
      const hoverMIdx = functionToIdx.get(activeFunction);
      return mIdx === hoverMIdx ? 'full' : 'dim';
    }
    return 'full';
  };

  // Подсветка плитки функции.
  const functionHighlight = (id: number): Highlight => {
    const mIdx = functionToIdx.get(id);
    if (mIdx === undefined) return 'hidden';

    if (isBlock) {
      if (activeFunction !== null) {
        const hoverMIdx = functionToIdx.get(activeFunction);
        return mIdx === hoverMIdx ? 'full' : 'dim';
      }
      if (activeAspect !== null) {
        return mIdx === pulseIdx ? 'full' : 'dim';
      }
      return 'full';
    }

    if (activeAspect !== null) {
      const hoverMIdx = aspectToIdx.get(activeAspect);
      return mIdx === hoverMIdx ? 'full' : 'dim';
    }
    return 'full';
  };

  const styleFor = (id: number | undefined, highlight: Highlight) => {
    if (highlight === 'hidden' || id === undefined) {
      return { color: INACTIVE, opacity: 'opacity-100', scale: 'scale-100' };
    }
    const base = `${MAPPING_BG[id % MAPPING_BG.length]} text-[var(--color-map-fg)]`;
    return {
      color: base,
      opacity: highlight === 'dim' ? 'opacity-25' : 'opacity-100',
      scale: highlight === 'dim' ? 'scale-95' : 'scale-100',
    };
  };

  const decoratorIds = view.decoratorIds ?? [];
  // Декораторы, которым нужен расширенный зазор между ментальным и витальным кольцами
  // (контуру нужно куда выйти с равным отступом от рядов 2 и 3).
  const needsRingsGap = decoratorIds.includes('process-cycle');

  return (
    <div
      className="glass-panel rounded-[32px] p-8 md:p-10 relative"
    >
      {isBlock && (
        <div className="mb-7 flex items-start gap-2.5 rounded-2xl border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-accent-soft)] p-3.5 text-[12px] leading-relaxed text-[var(--color-shell-muted)]">
          <Shuffle className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-shell-accent)]" strokeWidth={2} />
          <span>
            <span className="font-semibold">Блочный инвариант.</span> При наведении на аспект блоки функций перебираются по очереди: блок выбранного аспекта может оказаться в любом из блоков функций, но&nbsp;<span className="font-medium">блоки остаются нераздельными</span>. 4 блока аспектов переставляются в 4 блока функций без точной привязки друг к другу.
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-stretch justify-between gap-10 md:gap-16">
        {/* Аспектон */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="hairline h-px flex-1" />
            <h3 className="eyebrow text-center">Аспектон</h3>
            <div className="hairline h-px flex-1" />
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {ASPECTS.map((aspect) => {
              const hl = aspectHighlight(aspect.id);
              const idx = aspectToIdx.get(aspect.id);
              const s = styleFor(idx, hl);
              return (
                <motion.button
                  key={aspect.id}
                  type="button"
                  title={`${aspect.name}: ${aspect.fullName}\n${formatAspectFeatures(aspect)}`}
                  aria-label={`${aspect.fullName} (${aspect.name}). ${formatAspectFeatures(aspect)}`}
                  onMouseEnter={() => onAspectHover(aspect.id)}
                  onMouseLeave={() => onAspectHover(null)}
                  onClick={() => onAspectClick(aspect.id)}
                  className={`
                    relative h-20 rounded-xl border-2 flex items-center justify-center cursor-pointer
                    transition-[opacity,transform,background-color,border-color] duration-200
                    ${s.color} ${s.opacity} ${s.scale}
                    ${activeAspect === aspect.id ? 'ring-4 ring-[var(--color-shell-accent-soft)] z-10' : ''}
                  `}
                >
                  <span className="flex flex-col items-center gap-1.5">
                    <AspectIcon aspectId={aspect.id} size="sm" />
                    <span className="text-sm font-bold leading-none">{aspect.name}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Соединение: стрелка вниз на мобиле, вправо на десктопе */}
        <div className="flex flex-row md:flex-col items-center justify-center shrink-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-control)] text-[var(--color-shell-muted)]"
            aria-hidden="true"
          >
            <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" strokeWidth={2} />
          </div>
        </div>

        {/* Функцион */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="hairline h-px flex-1" />
            <h3 className="eyebrow text-center">Функцион</h3>
            <div className="hairline h-px flex-1" />
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-3 relative">
            {MODEL_A_LAYOUT.map((fId, mapIdx) => {
              const func = FUNCTIONS.find(f => f.id === fId)!;
              const hl = functionHighlight(func.id);
              const idx = functionToIdx.get(func.id);
              const s = styleFor(idx, hl);
              return (
                <Fragment key={func.id}>
                  {/* Спейсер между ментальным (1–4) и витальным (5–8) кольцами —
                      нужен только когда активен циклический декоратор, иначе сетка остаётся компактной. */}
                  {mapIdx === 4 && needsRingsGap && (
                    <div className="col-span-2 h-6 md:h-8" aria-hidden="true" />
                  )}
                  <motion.button
                    type="button"
                    title={`${func.id}: ${func.name}\n${formatFunctionFeatures(func)}`}
                    aria-label={`${func.id} ${func.name}. ${formatFunctionFeatures(func)}`}
                    onMouseEnter={() => onFunctionHover(func.id)}
                    onMouseLeave={() => onFunctionHover(null)}
                    onClick={() => onFunctionClick(func.id)}
                    className={`
                      relative h-16 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer
                      transition-[opacity,transform,background-color,border-color] duration-200
                      ${s.color} ${s.opacity} ${s.scale}
                      ${activeFunction === func.id ? 'ring-4 ring-[var(--color-shell-accent-soft)] z-10' : ''}
                    `}
                  >
                    <span className="text-xl font-bold leading-none font-mono">{func.id}</span>
                    <span className="text-[10px] font-medium mt-1 opacity-80 tracking-wide">{func.name}</span>
                  </motion.button>
                </Fragment>
              );
            })}

            {decoratorIds.map(id => {
              const Decorator = DECORATORS[id];
              if (!Decorator) return null;
              return <Decorator key={id} trait={trait} pole={pole} view={view} />;
            })}
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div className="mt-7 grid gap-6 border-t border-[var(--color-shell-border)] pt-5 md:grid-cols-2">
        <LegendColumn title="Группы аспектов" labels={aspectGroupLabels} />
        <LegendColumn title="Группы функций" labels={functionGroupLabels} />
      </div>
    </div>
  );
};

const LegendColumn: React.FC<{ title: string; labels: string[] }> = ({ title, labels }) => (
  <div>
    <p className="eyebrow mb-3">
      {title}
    </p>
    <ul className="space-y-1.5">
      {labels.map((label, idx) => (
        <li key={idx} className="flex items-center gap-2.5 text-[13px] text-[var(--color-shell-muted)]">
          <span
            aria-hidden="true"
            className={`w-3.5 h-3.5 rounded shrink-0 ${MAPPING_BG[idx % MAPPING_BG.length]}`}
          />
          <span className="leading-tight">
            {label || <span className="text-[var(--color-shell-subtle)] italic">нет общих признаков</span>}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
