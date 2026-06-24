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
      className="shell-panel backdrop-blur-xl rounded-[28px] border p-6"
      style={{ boxShadow: '0 12px 30px -16px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)' }}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="w-full md:w-1/3">
          <h2 className="shell-heading text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
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
                    ? 'bg-[var(--color-shell-active-fg)] text-[var(--color-shell-active-bg)] border-[var(--color-shell-active-fg)]'
                    : 'bg-[var(--color-shell-active-bg)] text-[var(--color-shell-muted)] border-[var(--color-shell-border-strong)] hover:border-[var(--color-shell-accent)] hover:text-[var(--color-shell-accent)]'
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
            className="shell-panel-muted p-4 rounded-2xl border"
          >
            <p className="shell-heading text-[13px] leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
