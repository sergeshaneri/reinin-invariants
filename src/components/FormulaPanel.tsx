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
      className="bg-slate-950 text-slate-100 rounded-[32px] p-8 md:p-10 relative overflow-hidden border border-slate-900"
      style={{ boxShadow: '0 30px 60px -25px rgba(15, 23, 42, 0.4)' }}
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] -mr-36 -mt-36 pointer-events-none" />

      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-7 flex items-center gap-3">
        <span className="w-1 h-7 bg-indigo-400 rounded-full" />
        {heading}
      </h3>

      {isBlock ? <BlockView mappings={mappings} connector={connector} /> : <PairView mappings={mappings} connector={connector} />}

      {view.footnote && (
        <div className="mt-6 p-5 bg-indigo-500/[0.05] rounded-xl border border-indigo-500/10">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-indigo-400 font-mono mr-1">*</span>
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
      <div key={idx} className="group flex flex-wrap items-center gap-4 md:gap-6 bg-white/[0.03] hover:bg-white/[0.06] p-5 rounded-2xl border border-white/5 transition-colors">
        <div className="flex flex-col gap-1.5 min-w-0">
          {m.aspectLabel && (
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
              {m.aspectLabel}
            </span>
          )}
          <div className="flex items-center gap-3">
            <BlockIndex idx={idx} />
            <AspectChips aspects={m.aspects} />
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-600" strokeWidth={2} />

        <div className="flex flex-col gap-1.5">
          {m.functionLabel && (
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
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
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.18em] mb-2">
          Блоки аспектов
        </p>
        {mappings.map((m, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <BlockIndex idx={idx} />
            <div className="flex flex-col gap-1 min-w-0">
              {m.aspectLabel && (
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.14em]">
                  {m.aspectLabel}
                </span>
              )}
              <AspectChips aspects={m.aspects} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex md:flex-col items-center justify-center gap-2 py-2 md:py-0">
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-300">
          <Shuffle className="w-4 h-4" strokeWidth={2} />
          <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">перестановка блоками</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.18em] mb-2">
          Блоки функций
        </p>
        {mappings.map((m, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <BlockIndex idx={idx} />
            <div className="flex flex-col gap-1 min-w-0">
              {m.functionLabel && (
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.14em]">
                  {m.functionLabel}
                </span>
              )}
              <FunctionChips functions={m.functions} connector={connector} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <p className="mt-5 text-[12px] text-slate-400 leading-relaxed">
      4 блока аспектов переставляются в 4 блока функций без точной привязки друг к другу. Инвариант — лишь то, что блоки остаются нераздельными.
    </p>
  </div>
);

const BlockIndex: React.FC<{ idx: number }> = ({ idx }) => (
  <span className="w-7 h-7 shrink-0 rounded-full bg-indigo-500/15 flex items-center justify-center text-[11px] font-semibold text-indigo-300 border border-indigo-500/30 font-mono">
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
          className="px-3 py-1.5 bg-slate-800/80 rounded-lg font-mono text-indigo-300 font-semibold text-[13px] border border-slate-700/80"
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
        <span className="px-3 py-1.5 bg-slate-800/80 rounded-lg font-mono text-emerald-300 font-semibold text-[13px] border border-slate-700/80">
          {fId}
        </span>
        {connector && fIdx < functions.length - 1 && (
          <span className="text-slate-600 font-mono text-sm">{connector}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);
