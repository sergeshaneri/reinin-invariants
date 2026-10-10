import { useState } from 'react';
import { ASPECTS, REININ_TRAITS } from '../data/socionics';
import { getOrderDependentTetrachotomy } from '../data/orderDependentTetrachotomies';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from '../data/memberships';
import type { PartitionExplorerViewModel } from '../data/selectors';
import { AspectFunctionDiagram } from '../diagrams/AspectFunctionDiagram';
import { resolveActiveCell, togglePinnedCell, type ActiveCell } from '../diagrams/interaction';
import { AspectGlyph, type AspectDisplayMode } from './AspectGlyph';

interface Props {
  view: PartitionExplorerViewModel;
  aspectDisplayMode: AspectDisplayMode;
}

export const TetrachotomyOrderPanel = ({ view, aspectDisplayMode }: Props) => {
  const [viewIndex, setViewIndex] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<ActiveCell>(null);
  const [pinnedCell, setPinnedCell] = useState<ActiveCell>(null);
  const family = getOrderDependentTetrachotomy(view.sourceFormula?.id);
  const selected = view.selectedClass;
  if (!family || !selected) return null;

  const trait = REININ_TRAITS.find(candidate => candidate.id === family.orderTraitId)!;
  const commonPole = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[family.orderTraitId].poles.find(
    candidate => selected.types.every(type => candidate.typeIds.includes(type.id)),
  );
  if (!commonPole) return null;
  const pole = trait.poles[commonPole.poleIndex];
  const ordinaryView = pole.views[viewIndex] ?? pole.views[0];
  const isCycle = family.orderTraitId === 'process';

  return (
    <section className="glass-panel block-surface rounded-[28px] p-5"
      data-tetrachotomy-order-panel={family.formulaId} data-order-trait={trait.id} data-order-pole={commonPole.poleIndex}>
      <div className="eyebrow">Порядковое условие · {trait.name}</div>
      <h2 className="mt-2 text-lg font-medium text-[var(--color-app-fg)]">{pole.name}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-shell-muted)]" data-order-invariant-explanation>
        {isCycle
          ? 'Процесс и Результат различаются порядком макроаспектов при обходе тактов модели А.'
          : 'В каждой из двух эквивалентностей диада аспектов целиком занимает одну из пар функций. У разных типов соответствие диад и пар может различаться.'}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {pole.views.map((condition, index) => (
          <button key={index} type="button" aria-pressed={viewIndex === index} data-order-view-select={index}
            className={`shell-control rounded-xl border px-3 py-2 text-xs ${viewIndex === index ? 'border-[var(--color-shell-accent)]' : 'border-[var(--color-shell-border)]'}`}
            onClick={() => { setViewIndex(index); setHoveredCell(null); setPinnedCell(null); }}>
            {condition.title || 'Циклический порядок'}
          </button>
        ))}
      </div>
      <div className="mt-4" data-order-ordinary-diagram={viewIndex}>
        <AspectFunctionDiagram key={`${trait.id}:${commonPole.poleIndex}:${viewIndex}`}
          trait={trait} pole={pole} view={ordinaryView} activeCell={resolveActiveCell(hoveredCell, pinnedCell)}
          aspectDisplayMode={aspectDisplayMode}
          onAspectHover={id => setHoveredCell(id ? { kind: 'aspect', id } : null)}
          onFunctionHover={id => setHoveredCell(id !== null ? { kind: 'function', id } : null)}
          onAspectClick={id => setPinnedCell(previous => togglePinnedCell(previous, { kind: 'aspect', id }))}
          onFunctionClick={id => setPinnedCell(previous => togglePinnedCell(previous, { kind: 'function', id }))}
        />
      </div>
      <div className="mt-5 grid gap-4">
        {pole.views.map((condition, conditionIndex) => (
          <section key={conditionIndex} className="block-condition rounded-2xl p-4 sm:p-5" data-order-condition={conditionIndex}>
            <h3 className="block-condition-title">{condition.title || 'Циклический порядок'}</h3>
            {isCycle ? <div className="order-cycle-description">
              <p className="block-label">Циклический порядок макроаспектов</p>
              <p className="order-cycle-sequence" data-order-cycle>
                {condition.mappings.map((mapping, index) => <span key={index} className="order-cycle-step">
                  <span>{mapping.aspectLabel}</span><span aria-hidden="true">→</span>
                </span>)}
                <span>{condition.mappings[0].aspectLabel}</span>
              </p>
            </div> : null}
            <div className="block-columns order-condition-blocks">
              <div className="min-w-0">
                <div className="block-label">{isCycle ? 'Макроаспекты' : 'Диады аспектов'}</div>
                <div className="block-collection order-block-collection">
                  {condition.mappings.map((mapping, index) => (
                    <div key={index} className="block-tile block-text-tile" data-order-aspect-block={mapping.aspects.join(',')}>
                      {mapping.aspectLabel ? <span className="block-tile-label">{mapping.aspectLabel}</span> : null}
                      <div className="block-members">
                        {mapping.aspects.map(id => {
                          const aspect = ASPECTS.find(candidate => candidate.id === id)!;
                          return <span key={id} title={aspect.fullName} aria-label={`${aspect.fullName} (${aspect.name})`}>
                            <AspectGlyph aspectId={id} label={aspect.name} mode={aspectDisplayMode} size="sm" />
                          </span>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <div className="block-label">{isCycle ? 'Такты модели А' : 'Пары функций модели А'}</div>
                <div className="block-collection order-block-collection">
                  {condition.mappings.map((mapping, index) => (
                    <div key={index} className="block-tile block-text-tile" data-order-function-block={mapping.functions.join(',')}>
                      {mapping.functionLabel ? <span className="block-tile-label">{mapping.functionLabel}</span> : null}
                      <span className="block-members">{mapping.functions.map(id => <span key={id} className="block-number">{id}</span>)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {isCycle ? <div className="order-condition-explanation" data-order-cycle-explanation>
              <p>Каждый макроаспект занимает один такт целиком. У разных типов макроаспекты находятся в разных тактах.</p>
              <p>Обход тактов в модели А происходит по пунктирной стрелке. Первый такт — функции 3 и 5.</p>
            </div> : condition.footnote ? <p className="mt-4 text-xs leading-relaxed text-[var(--color-shell-muted)]">{condition.footnote}</p> : null}
          </section>
        ))}
      </div>
    </section>
  );
};
