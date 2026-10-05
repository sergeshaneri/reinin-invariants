import { useState } from 'react';
import { ASPECTS, REININ_TRAITS } from '../data/socionics';
import { AspectFunctionDiagram } from '../diagrams/AspectFunctionDiagram';
import type { ActiveCell } from '../diagrams/interaction';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from '../data/memberships';
import type { PartitionExplorerViewModel } from '../data/selectors';
import { AspectGlyph, type AspectDisplayMode } from './AspectGlyph';

interface Props {
  view: PartitionExplorerViewModel;
  aspectDisplayMode: AspectDisplayMode;
}

export const TetrachotomyCracyPanel = ({ view, aspectDisplayMode }: Props) => {
  const [viewIndex, setViewIndex] = useState(0);
  const [activeCell, setActiveCell] = useState<ActiveCell>(null);
  const formula = view.sourceFormula;
  const selected = view.selectedClass;
  const hasCracy = formula && [formula.targetTrait, ...formula.basisTraits].some(trait => trait.id === 'democracy');
  if (!hasCracy || !selected) return null;

  const trait = REININ_TRAITS.find(candidate => candidate.id === 'democracy')!;
  const membership = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID.democracy;
  const commonPole = membership.poles.find(pole => selected.types.every(type => pole.typeIds.includes(type.id)));
  if (!commonPole) return null;
  const pole = trait.poles[commonPole.poleIndex];

  return (
    <section className="glass-panel block-surface rounded-[28px] p-5" data-tetrachotomy-cracy-panel={formula.id} data-cracy-pole={commonPole.poleIndex}>
      <div className="eyebrow">Блочная формула кратии</div>
      <h2 className="mt-2 text-lg font-medium text-[var(--color-app-fg)]">{pole.name}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {pole.views.map((blockView, index) => (
          <button key={blockView.title} type="button" aria-pressed={index === viewIndex} data-cracy-view-select={index}
            className={`shell-control rounded-xl border px-3 py-2 text-xs ${index === viewIndex ? 'border-[var(--color-shell-accent)]' : 'border-[var(--color-shell-border)]'}`}
            onClick={() => { setViewIndex(index); setActiveCell(null); }}>
            {blockView.title}
          </button>
        ))}
      </div>
      <div className="mt-4" data-cracy-ordinary-diagram={viewIndex}>
        <AspectFunctionDiagram
          key={`${commonPole.poleIndex}:${viewIndex}`}
          trait={trait} pole={pole} view={pole.views[viewIndex]} activeCell={activeCell}
          onAspectHover={id => setActiveCell(id ? { kind: 'aspect', id } : null)}
          onFunctionHover={id => setActiveCell(id !== null ? { kind: 'function', id } : null)}
          onAspectClick={id => setActiveCell({ kind: 'aspect', id })}
          onFunctionClick={id => setActiveCell({ kind: 'function', id })}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-shell-muted)]" data-cracy-invariant-explanation>
        В каждом из четырёх условий каждый блок аспектов целиком занимает один из блоков функций.
        {' '}Соответствие между блоками может различаться между типами; состав каждого блока сохраняется.
      </p>
      <div className="mt-5 grid gap-4">
        {pole.views.map((blockView, conditionIndex) => (
          <section key={blockView.title} className="block-condition rounded-2xl p-4 sm:p-5" data-cracy-block-condition={conditionIndex}>
            <h3 className="block-condition-title">{blockView.title}</h3>
            <div className="block-columns mt-4">
              <div className="min-w-0">
                <div className="block-label">Блоки аспектов</div>
                <div className="grid grid-cols-2 gap-2">
                  {blockView.mappings.map((mapping, index) => (
                    <div key={index} className="block-tile flex flex-wrap items-center justify-center gap-4 rounded-xl p-3" data-cracy-aspect-block={mapping.aspects.join(',')}>
                      {mapping.aspects.map(aspectId => (
                        <AspectGlyph key={aspectId} aspectId={aspectId} label={ASPECTS.find(aspect => aspect.id === aspectId)!.name} mode={aspectDisplayMode === 'symbol' ? 'symbol' : 'icon-symbol'} size="sm" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <div className="block-label">Блоки функций модели А</div>
                <div className="grid grid-cols-2 gap-2">
                  {blockView.mappings.map((mapping, index) => (
                    <div key={index} className="block-tile flex flex-wrap items-center justify-center gap-6 rounded-xl p-3" data-cracy-function-block={mapping.functions.join(',')}>
                      {mapping.functions.map(functionId => <span key={functionId} className="block-number">{functionId}</span>)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};
