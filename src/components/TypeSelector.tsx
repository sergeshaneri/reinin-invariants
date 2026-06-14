import React from 'react';
import { Badge, Boxes } from 'lucide-react';
import {
  SOCIONIC_TYPES,
  type SocionicTypeId,
} from '../data/socionics';

interface Props {
  selectedTypeId: SocionicTypeId;
  onSelectType: (typeId: SocionicTypeId) => void;
}

export const TypeSelector: React.FC<Props> = ({ selectedTypeId, onSelectType }) => (
  <section
    className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-slate-200/60 p-5"
    style={{ boxShadow: '0 12px 30px -16px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)' }}
  >
    <div className="flex items-center justify-between mb-5 px-1">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 flex items-center gap-2">
        <Boxes className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
        TIM
      </h2>
      <span className="text-[11px] font-medium text-slate-400 font-mono">{SOCIONIC_TYPES.length}</span>
    </div>

    <div className="grid grid-cols-2 gap-2">
      {SOCIONIC_TYPES.map((type) => {
        const isActive = selectedTypeId === type.id;
        const socionicsAlias = type.aliases.socionics?.[0];
        const mbtiAlias = type.aliases.mbtiLike?.[0];
        const label = [type.id, socionicsAlias, mbtiAlias].filter(Boolean).join(' · ');

        return (
          <button
            key={type.id}
            type="button"
            aria-current={isActive ? 'true' : undefined}
            aria-label={label}
            title={type.names.ru}
            onClick={() => onSelectType(type.id)}
            className={`min-h-20 rounded-2xl border px-3 py-3 text-left transition-colors ${
              isActive
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50'
            }`}
          >
            <span className="flex items-start justify-between gap-2">
              <span className="min-w-0">
                <span className="block text-[15px] font-bold leading-none tracking-normal">{type.id}</span>
                <span className={`mt-1 block truncate text-[11px] font-medium ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {socionicsAlias ?? type.names.ru}
                </span>
              </span>
              <Badge className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-indigo-200' : 'text-slate-300'}`} strokeWidth={2} />
            </span>
            <span className={`mt-2 block text-[11px] leading-snug ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
              {type.names.en ?? mbtiAlias ?? type.quadraId}
            </span>
          </button>
        );
      })}
    </div>
  </section>
);
