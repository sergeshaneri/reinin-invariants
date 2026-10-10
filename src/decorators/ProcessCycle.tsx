import { memo, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { DecoratorComponent } from './types';

// Циклический контур поверх Функциона — два rounded-rect-а вокруг
// ментального (1→2→3→4) и витального (5→6→7→8) колец.
// Bendpoints:
//  • SVG БЕЗ viewBox → юниты = CSS пиксели → углы скруглены идеально круглыми.
//  • Контур выходит за пределы сетки функций через -inset-3/-inset-4 родителя.
//  • Marching ants через CSS keyframes; пауза по document.hidden / reduced-motion.
//  • Указатели направления — по одному SVG-треугольнику в середине каждой стороны.

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

export const CyclePointers: React.FC<{ direction: 'cw' | 'ccw' }> = ({ direction }) => (
  <>
    {([
      { side: 'top', left: '50%', top: '0%', angle: 0 },
      { side: 'right', left: '100%', top: '50%', angle: 90 },
      { side: 'bottom', left: '50%', top: '100%', angle: 180 },
      { side: 'left', left: '0%', top: '50%', angle: 270 },
    ] as const).map(({ side, left, top, angle }) => (
      <svg
        key={side}
        className="absolute w-3 h-3 block"
        style={{ left, top, transform: `translate(-50%, -50%) rotate(${angle + (direction === 'ccw' ? 180 : 0)}deg)` }}
        viewBox="0 0 12 12"
        aria-hidden="true"
        data-cycle-pointer-side={side}
        data-cycle-pointer-direction={direction}
      >
        <polygon points="0,0 12,6 0,12" fill={STROKE} />
      </svg>
    ))}
  </>
);

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
        <CyclePointers direction="cw" />
      </div>

      {/* Витальное кольцо: нижняя половина, направление против часовой */}
      <div className="absolute inset-x-0 bottom-0 h-[calc(50%-8px)] md:h-[calc(50%-12px)]">
        <Ring direction="ccw" paused={pausedFlag} />
        <CyclePointers direction="ccw" />
      </div>
    </div>
  );
};

export const ProcessCycle = memo(ProcessCycleImpl);
