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
    className="shell-panel backdrop-blur-xl rounded-[28px] border p-5"
    style={{ boxShadow: '0 12px 30px -16px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)' }}
  >
    <div className="flex items-center justify-between mb-5 px-1">
      <h2 className="shell-heading text-[11px] font-semibold uppercase tracking-[0.18em] flex items-center gap-2">
        <Boxes className="shell-accent w-3.5 h-3.5" strokeWidth={2} />
        ТИМ
      </h2>
      <span className="shell-subtle text-[11px] font-medium font-mono">{SOCIONIC_TYPES.length}</span>
    </div>

    <div className="grid grid-cols-2 gap-2">
      {SOCIONIC_TYPES.map((type) => {
        const isActive = selectedTypeId === type.id;
        const visibleCode = type.aliases.socionics?.[0] ?? type.names.ru;
        const historicalAlias = type.aliases.socionics?.[1];
        const aliasLine = historicalAlias || type.names.ru;
        const label = [visibleCode, aliasLine, type.names.ru].filter(Boolean).join(' - ');

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
                ? 'border-[var(--color-shell-active-fg)] bg-[var(--color-shell-active-fg)] text-[var(--color-shell-active-bg)] shadow-sm'
                : 'border-[var(--color-shell-border-strong)] bg-[var(--color-shell-active-bg)] text-[var(--color-app-fg)] hover:border-[var(--color-shell-accent)] hover:bg-[var(--color-shell-accent-soft)]'
            }`}
          >
            <span className="flex items-start justify-between gap-2">
              <span className="min-w-0">
                <span className="block text-[15px] font-bold leading-none tracking-normal">{visibleCode}</span>
                <span className={`mt-1 block truncate text-[11px] font-medium ${isActive ? 'opacity-80' : 'shell-heading'}`}>
                  {aliasLine}
                </span>
              </span>
              <Badge className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'opacity-80' : 'shell-subtle'}`} strokeWidth={2} />
            </span>
            <span className={`mt-2 block text-[11px] leading-snug ${isActive ? 'opacity-80' : 'shell-heading'}`}>
              {type.names.ru}
            </span>
          </button>
        );
      })}
    </div>
  </section>
);
