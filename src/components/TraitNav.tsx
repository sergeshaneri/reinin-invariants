import React, { useMemo } from 'react';
import { Info, ChevronRight, Layers } from 'lucide-react';
import { REININ_TRAITS, TRAIT_GROUPS, TraitClass } from '../data/socionics';

interface Props {
  selectedTraitIndex: number;
  onSelectTrait: (index: number) => void;
  onShowHelp: (classId: TraitClass) => void;
}

export const TraitNav: React.FC<Props> = ({ selectedTraitIndex, onSelectTrait, onShowHelp }) => {
  const grouped = useMemo(
    () => TRAIT_GROUPS.map(group => ({
      ...group,
      traits: REININ_TRAITS
        .map((t, idx) => ({ trait: t, idx }))
        .filter(({ trait }) => trait.class === group.id),
    })),
    [],
  );

  return (
    <section
      className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-slate-200/60 p-5"
      style={{ boxShadow: '0 12px 30px -16px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)' }}
    >
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
          Признаки
        </h2>
        <span className="text-[11px] font-medium text-slate-400 font-mono">{REININ_TRAITS.length}</span>
      </div>
      <div className="space-y-5 max-h-[640px] overflow-y-auto pr-1 custom-scrollbar">
        {grouped.map((group) => (
          <div key={group.id} className="space-y-2">
            <button
              type="button"
              onClick={() => onShowHelp(group.id)}
              className="w-full flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{group.title}</span>
              <Info className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-colors" strokeWidth={2} />
            </button>
            <div className="space-y-0.5">
              {group.traits.map(({ trait, idx }) => {
                const isActive = selectedTraitIndex === idx;
                return (
                  <button
                    key={trait.id}
                    type="button"
                    onClick={() => onSelectTrait(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-start justify-between gap-2 group relative ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="relative z-10 flex items-start gap-2.5 min-w-0">
                      <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-indigo-300' : 'bg-slate-300'}`} />
                      <span className="text-[13px] font-medium leading-snug">{trait.name}</span>
                    </span>
                    <ChevronRight className={`mt-1 w-3 h-3 shrink-0 relative z-10 transition-transform ${isActive ? 'translate-x-0 opacity-90' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
