import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { TRAIT_GROUPS, TraitClass } from '../data/socionics';

interface Props {
  classId: TraitClass | null;
  onClose: () => void;
}

export const HelpModal: React.FC<Props> = ({ classId, onClose }) => {
  React.useEffect(() => {
    if (classId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [classId, onClose]);

  const group = classId !== null ? TRAIT_GROUPS.find(g => g.id === classId) : null;

  return (
    <AnimatePresence>
      {classId !== null && group && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-modal-title"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200/80"
            style={{ boxShadow: '0 30px 60px -20px rgba(15, 23, 42, 0.25)' }}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 id="help-modal-title" className="text-base font-semibold text-slate-900">
                {group.title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="w-8 h-8 inline-flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" strokeWidth={2} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                {group.help}
              </p>
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                <h4 className="text-[10px] font-semibold text-indigo-600 uppercase tracking-[0.18em] mb-1.5">Принцип</h4>
                <p className="text-xs text-indigo-900/70 leading-relaxed">
                  {group.description}
                </p>
              </div>
            </div>
            <div className="p-5 bg-slate-50/70 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Понятно
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
