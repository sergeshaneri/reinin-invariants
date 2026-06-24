import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shuffle } from 'lucide-react';
import { ASPECTS, ReininTrait, View } from '../data/socionics';

interface Props {
  trait: ReininTrait;
  view: View;
}

export const FormulaPanel: React.FC<Props> = ({ trait, view }) => {
  const mappings = view.mappings;
  const isBlock = view.isBlockPermutation === true;
  const connector = view.connector;
  const heading = isBlock
    ? 'Блочный инвариант'
    : trait.class === 3
      ? 'Алгебраические эквивалентности'
      : 'Алгебраическая формула';

  return (
    <motion.section
      key={`${trait.id}-${view.title}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel relative overflow-hidden rounded-[32px] p-8 md:p-10"
    >
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-7 flex items-center gap-3">
        <span className="h-7 w-1 rounded-full bg-[var(--color-shell-accent)]" />
        {heading}
      </h3>

      {isBlock ? <BlockView mappings={mappings} connector={connector} /> : <PairView mappings={mappings} connector={connector} />}

      {view.footnote && (
        <div className="mt-6 rounded-xl border border-[var(--color-shell-border)] bg-[var(--color-shell-accent-soft)] p-5">
          <p className="text-xs leading-relaxed text-[var(--color-shell-muted)]">
            <span className="mr-1 font-mono text-[var(--color-shell-accent)]">*</span>
            {view.footnote}
          </p>
        </div>
      )}
    </motion.section>
  );
};

// Классы 1, 2 — формат "блок аспектов → блок функций" (жёсткая пара).
const PairView: React.FC<{ mappings: View['mappings']; connector?: string }> = ({ mappings, connector }) => (
  <div className="grid gap-3">
    {mappings.map((m, idx) => (
      <div key={idx} className="group flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-5 transition-colors hover:border-[var(--color-shell-border-strong)] md:gap-6">
        <div className="flex flex-col gap-1.5 min-w-0">
          {m.aspectLabel && (
            <span className="eyebrow">
              {m.aspectLabel}
            </span>
          )}
          <div className="flex items-center gap-3">
            <BlockIndex idx={idx} />
            <AspectChips aspects={m.aspects} />
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-[var(--color-shell-subtle)]" strokeWidth={2} />

        <div className="flex flex-col gap-1.5">
          {m.functionLabel && (
            <span className="eyebrow">
              {m.functionLabel}
            </span>
          )}
          <FunctionChips functions={m.functions} connector={connector} />
        </div>
      </div>
    ))}
  </div>
);

// Класс 3 (block permutation) — два столбца без жёсткой пары + явная пометка про биекцию.
const BlockView: React.FC<{ mappings: View['mappings']; connector?: string }> = ({ mappings, connector }) => (
  <div>
    <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6 items-center">
      <div className="space-y-2.5">
        <p className="eyebrow mb-2">
          Блоки аспектов
        </p>
        {mappings.map((m, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-3">
            <BlockIndex idx={idx} />
            <div className="flex flex-col gap-1 min-w-0">
              {m.aspectLabel && (
                <span className="eyebrow">
                  {m.aspectLabel}
                </span>
              )}
              <AspectChips aspects={m.aspects} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex md:flex-col items-center justify-center gap-2 py-2 md:py-0">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-accent-soft)] px-3 py-2 text-[var(--color-shell-accent)]">
          <Shuffle className="w-4 h-4" strokeWidth={2} />
          <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">перестановка блоками</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="eyebrow mb-2">
          Блоки функций
        </p>
        {mappings.map((m, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-3">
            <BlockIndex idx={idx} />
            <div className="flex flex-col gap-1 min-w-0">
              {m.functionLabel && (
                <span className="eyebrow">
                  {m.functionLabel}
                </span>
              )}
              <FunctionChips functions={m.functions} connector={connector} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <p className="mt-5 text-[12px] leading-relaxed text-[var(--color-shell-muted)]">
      4 блока аспектов переставляются в 4 блока функций без точной привязки друг к другу. Инвариант: лишь то, что блоки остаются нераздельными.
    </p>
  </div>
);

const BlockIndex: React.FC<{ idx: number }> = ({ idx }) => (
  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-accent-soft)] font-mono text-[11px] font-semibold text-[var(--color-shell-accent)]">
    {idx + 1}
  </span>
);

const AspectChips: React.FC<{ aspects: View['mappings'][number]['aspects'] }> = ({ aspects }) => (
  <div className="flex gap-1.5 flex-wrap">
    {aspects.map(aId => {
      const a = ASPECTS.find(asp => asp.id === aId);
      return (
        <span
          key={aId}
          title={a?.fullName}
          className="rounded-lg border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-control)] px-3 py-1.5 font-mono text-[13px] font-semibold text-[var(--color-shell-accent)]"
        >
          {a?.name}
        </span>
      );
    })}
  </div>
);

const FunctionChips: React.FC<{ functions: number[]; connector?: string }> = ({ functions, connector }) => (
  <div className="flex gap-1.5 items-center flex-wrap">
    {functions.map((fId, fIdx) => (
      <React.Fragment key={fId}>
        <span className="rounded-lg border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-control)] px-3 py-1.5 font-mono text-[13px] font-semibold text-[var(--color-shell-hover-fg)]">
          {fId}
        </span>
        {connector && fIdx < functions.length - 1 && (
          <span className="font-mono text-sm text-[var(--color-shell-subtle)]">{connector}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);
