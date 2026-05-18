import { memo, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { DecoratorComponent } from './types';

// Циклический контур поверх Функциона — два rounded-rect-а вокруг
// ментального (1→2→3→4) и витального (5→6→7→8) колец.
// Bendpoints:
//  • SVG БЕЗ viewBox → юниты = CSS пиксели → углы скруглены идеально круглыми.
//  • Контур выходит за пределы сетки функций через -inset-3/-inset-4 родителя.
//  • Marching ants через CSS keyframes; пауза по document.hidden / reduced-motion.
//  • Указатели направления — отдельные SVG-треугольники в углах.

const STROKE = '#7c3aed';     // violet-600
const STROKE_WIDTH = 3;
const DASH = '8 6';
const RX = 14;

const Ring: React.FC<{ direction: 'cw' | 'ccw'; paused: boolean }> = ({ direction, paused }) => {
  const cls = `marching-ants-${direction}${paused ? ' paused' : ''}`;
  return (
    <svg className="w-full h-full overflow-visible block" aria-hidden="true">
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={RX}
        fill="none"
        stroke={STROKE}
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={DASH}
        strokeLinecap="round"
        className={cls}
      />
    </svg>
  );
};

const Pointer: React.FC<{ direction: 'right' | 'left'; side: 'right' | 'left' }> = ({ direction, side }) => {
  const points = direction === 'right' ? '0,0 12,6 0,12' : '12,0 0,6 12,12';
  const sideClass = side === 'right' ? 'right-7' : 'left-7';
  return (
    <svg
      className={`absolute ${sideClass} -top-[7px] w-3 h-3 block`}
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <polygon points={points} fill={STROKE} />
    </svg>
  );
};

const ProcessCycleImpl: DecoratorComponent = () => {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(typeof document === 'undefined' ? false : document.hidden);

  useEffect(() => {
    const onChange = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  const pausedFlag = paused || reduceMotion === true;

  // Расчёт высоты кольца:
  //   half (50%) − X, где X = decorator-inset + grid-gap/2 − желаемый отступ от ряда.
  //   На mobile  (-inset-3 = 12, gap-2 = 8, spacer h-6 = 24):  X = 8.
  //   На desktop (-inset-4 = 16, gap-3 = 12, spacer h-8 = 32): X = 12.
  // В итоге контур имеет равный 12 px отступ от каждой стороны сетки функций.
  return (
    <div className="absolute -inset-3 md:-inset-4 pointer-events-none">
      {/* Ментальное кольцо: верхняя половина, направление по часовой */}
      <div className="absolute inset-x-0 top-0 h-[calc(50%-8px)] md:h-[calc(50%-12px)]">
        <Ring direction="cw" paused={pausedFlag} />
        <Pointer direction="right" side="right" />
      </div>

      {/* Витальное кольцо: нижняя половина, направление против часовой */}
      <div className="absolute inset-x-0 bottom-0 h-[calc(50%-8px)] md:h-[calc(50%-12px)]">
        <Ring direction="ccw" paused={pausedFlag} />
        <Pointer direction="left" side="left" />
      </div>
    </div>
  );
};

export const ProcessCycle = memo(ProcessCycleImpl);
