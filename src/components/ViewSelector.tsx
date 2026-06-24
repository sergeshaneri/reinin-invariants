import React from 'react';
import { motion } from 'motion/react';
import { View } from '../data/socionics';

interface Props {
  views: View[];
  activeViewIndex: number;
  onSelect: (idx: number) => void;
}

export const ViewSelector: React.FC<Props> = ({ views, activeViewIndex, onSelect }) => {
  if (views.length <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="shell-panel flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 py-3 backdrop-blur-sm rounded-2xl border"
    >
      <h4 className="shell-heading text-[11px] font-semibold uppercase tracking-[0.16em] shrink-0">
        Выбор инварианта
      </h4>
      <div className="shell-control flex flex-wrap gap-1 p-1 rounded-xl" role="tablist" aria-label="Выбор инварианта">
        {views.map((view, idx) => (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={activeViewIndex === idx}
            onClick={() => onSelect(idx)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-colors ${
              activeViewIndex === idx
                ? 'shell-tab-active shadow-sm'
                : 'shell-tab'
            }`}
          >
            {view.title}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
