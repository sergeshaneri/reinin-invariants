import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shuffle } from 'lucide-react';
import { ASPECTS, ReininTrait, View } from '../data/socionics';
import { AspectGlyph, type AspectDisplayMode } from './AspectGlyph';

interface Props {
  trait: ReininTrait;
  view: View;
  aspectDisplayMode?: AspectDisplayMode;
}

export const FormulaPanel: React.FC<Props> = ({ trait, view, aspectDisplayMode = 'symbol' }) => {
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
      className={isBlock ? 'block-surface block-formula-panel' : 'glass-panel relative overflow-hidden rounded-[32px] p-8 md:p-10'}
      data-block-formula={isBlock ? view.title : undefined}
    >
      <h3 className={isBlock ? 'block-panel-title' : 'text-xl md:text-2xl font-semibold tracking-tight mb-7 flex items-center gap-3'}>
        {!isBlock && <span className="h-7 w-1 rounded-full bg-[var(--color-shell-accent)]" />}
        {heading}
      </h3>

      {isBlock ? <BlockView mappings={mappings} aspectDisplayMode={aspectDisplayMode} /> : <PairView mappings={mappings} connector={connector} aspectDisplayMode={aspectDisplayMode} />}

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
const PairView: React.FC<{ mappings: View['mappings']; connector?: string; aspectDisplayMode: AspectDisplayMode }> = ({ mappings, connector, aspectDisplayMode }) => (
  <div className="grid gap-3">
    {mappings.map((m, idx) => (
      <div key={idx} className="group flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-shell-border)] bg-[var(--color-shell-surface-muted)] p-5 transition-colors hover:border-[var(--color-shell-border-strong)] md:gap-6">
        <div className="flex flex-col gap-1.5 min-w-0">
          {m.aspectLabel && (
            <span className="eyebrow">
              {m.aspectLabel}
            </span>
          )}
          <AspectChips aspects={m.aspects} aspectDisplayMode={aspectDisplayMode} />
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
const BlockView: React.FC<{ mappings: View['mappings']; aspectDisplayMode: AspectDisplayMode }> = ({ mappings, aspectDisplayMode }) => (
  <div>
    <div className="block-permutation">
      <div className="min-w-0">
        <p className="block-label">Блоки аспектов</p>
        <div className="block-collection">
          {mappings.map((mapping, index) => (
            <div key={index} className="block-tile block-text-tile" data-formula-aspect-block={mapping.aspects.join(',')}>
              {mapping.aspectLabel && <span className="block-tile-label">{mapping.aspectLabel}</span>}
              <div className="block-members">
                {mapping.aspects.map(aspectId => {
                  const aspect = ASPECTS.find(candidate => candidate.id === aspectId);
                  return <span key={aspectId} className="block-aspect-name" title={aspect?.fullName} aria-label={`${aspect?.fullName} (${aspect?.name})`}>
                    <AspectGlyph aspectId={aspectId} label={aspect?.name ?? aspectId} mode={aspectDisplayMode} size="sm" />
                  </span>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="block-permutation-note">
        <Shuffle className="h-6 w-6 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        <span>Перестановка целых блоков</span>
      </div>

      <div className="min-w-0">
        <p className="block-label">Блоки функций</p>
        <div className="block-collection">
          {mappings.map((mapping, index) => (
            <div key={index} className="block-tile block-text-tile" data-formula-function-block={mapping.functions.join(',')}>
              {mapping.functionLabel && <span className="block-tile-label">{mapping.functionLabel}</span>}
              <div className="block-members">
                {mapping.functions.map(functionId => <span key={functionId} className="block-number">{functionId}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <p className="block-explanation">
      Каждый блок аспектов целиком занимает один из блоков функций. Соответствие между блоками может различаться между типами; состав каждого блока сохраняется.
    </p>
  </div>
);

const AspectChips: React.FC<{ aspects: View['mappings'][number]['aspects']; aspectDisplayMode: AspectDisplayMode }> = ({ aspects, aspectDisplayMode }) => (
  <div className="flex gap-1.5 flex-wrap">
    {aspects.map(aId => {
      const a = ASPECTS.find(asp => asp.id === aId);
      return (
        <span
          key={aId}
          title={a?.fullName}
          aria-label={`${a?.fullName} (${a?.name})`}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--color-shell-border-strong)] bg-[var(--color-shell-control)] px-3 py-1.5 font-mono text-[13px] font-semibold text-[var(--color-shell-accent)]"
        >
          <AspectGlyph aspectId={aId} label={a?.name ?? aId} mode={aspectDisplayMode} size="sm" />
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
