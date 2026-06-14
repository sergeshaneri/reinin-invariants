import React from 'react';
import { Boxes, GitBranch, Grid2X2, SplitSquareHorizontal } from 'lucide-react';
import type { AppMode } from '../appState';

interface ModeOption {
  id: AppMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'trait',
    label: 'Признак',
    description: 'Инварианты одного признака',
    icon: SplitSquareHorizontal,
  },
  {
    id: 'type',
    label: 'Тип',
    description: 'Модель А одного ТИМа',
    icon: Boxes,
  },
  {
    id: 'tetrachotomy',
    label: 'Тетрахотомия',
    description: 'Два признака, четыре класса',
    icon: Grid2X2,
  },
  {
    id: 'octochotomy',
    label: 'Октохотомия',
    description: 'Три признака, восемь классов',
    icon: GitBranch,
  },
];

interface Props {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<Props> = ({ mode, onSelectMode }) => (
  <section className="lg:col-span-12">
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Режим
      </h2>
      <div
        className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 md:grid-cols-4"
        role="tablist"
        aria-label="Режим просмотра"
      >
        {MODE_OPTIONS.map(({ id, label, description, icon: Icon }) => {
          const isActive = mode === id;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              title={description}
              onClick={() => onSelectMode(id)}
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold leading-tight transition-colors ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              <span className="break-words">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  </section>
);
