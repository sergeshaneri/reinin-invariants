import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../appState';

interface Props {
  theme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

const OPTIONS: readonly {
  id: ThemeMode;
  label: string;
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { id: 'light', label: 'Светлая', title: 'Включить светлую тему', icon: Sun },
  { id: 'dark', label: 'Темная', title: 'Включить темную тему', icon: Moon },
];

export const ThemeToggle: React.FC<Props> = ({ theme, onSelectTheme }) => (
  <section className="min-w-0">
    <div className="shell-panel flex flex-col gap-3 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur-sm">
      <h2 className="shell-heading text-[11px] font-semibold uppercase tracking-[0.18em]">
        Тема
      </h2>
      <div
        className="shell-control flex flex-wrap gap-1 rounded-xl p-1"
        role="tablist"
        aria-label="Тема интерфейса"
      >
        {OPTIONS.map(({ id, label, title, icon: Icon }) => {
          const isActive = theme === id;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              title={title}
              onClick={() => onSelectTheme(id)}
              className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[12px] font-semibold leading-tight transition-colors ${
                isActive
                  ? 'shell-tab-active shadow-sm'
                  : 'shell-tab'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  </section>
);
