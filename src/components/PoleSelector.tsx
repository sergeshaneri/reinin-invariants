import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { ReininTrait, View, formatBlockEquivalenceDescription } from '../data/socionics';

interface Props {
  trait: ReininTrait;
  selectedPoleIndex: number;
  activeView: View;
  onSelectPole: (idx: number) => void;
}

export const PoleSelector: React.FC<Props> = ({ trait, selectedPoleIndex, activeView, onSelectPole }) => {
  const currentPole = trait.poles[selectedPoleIndex];
  // Цепочка: ручной view.description → автогенерация (для блочных) → pole.description.
  const description =
    activeView.description
    ?? (activeView.isBlockPermutation ? formatBlockEquivalenceDescription(activeView.mappings) : null)
    ?? currentPole.description;

  return (
    <section
      className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-slate-200/60 p-6"
      style={{ boxShadow: '0 12px 30px -16px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)' }}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="w-full md:w-1/3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3 flex items-center gap-2">
            <RefreshCw className="w-3 h-3 text-emerald-500" strokeWidth={2} />
            Полюс
          </h2>
          <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="Полюса дихотомии">
            {trait.poles.map((pole, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={selectedPoleIndex === idx}
                onClick={() => onSelectPole(idx)}
                className={`px-3 py-2 rounded-xl transition-colors text-[12px] font-semibold leading-tight border break-words hyphens-auto ${
                  selectedPoleIndex === idx
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {pole.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <motion.div
            key={`${trait.id}-${selectedPoleIndex}-${activeView.title}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <p className="text-[13px] text-slate-600 leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
