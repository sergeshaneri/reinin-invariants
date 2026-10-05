import { REININ_TRAITS } from '../data/socionics';
import { TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID } from '../data/memberships';
import type { PartitionExplorerViewModel } from '../data/selectors';
import { FormulaPanel } from './FormulaPanel';

interface Props {
  view: PartitionExplorerViewModel;
}

export const TetrachotomyDichotomyPanel = ({ view }: Props) => {
  const formula = view.sourceFormula;
  const selected = view.selectedClass;
  if (!formula || formula.sourceBlocks?.length || !selected) return null;

  const dichotomies = [formula.targetTrait, ...formula.basisTraits].map(participant => {
    const trait = REININ_TRAITS.find(candidate => candidate.id === participant.id)!;
    const commonPole = TRAIT_TYPE_MEMBERSHIPS_BY_TRAIT_ID[trait.id].poles.find(
      candidate => selected.types.every(type => candidate.typeIds.includes(type.id)),
    );
    return commonPole ? { trait, poleIndex: commonPole.poleIndex, pole: trait.poles[commonPole.poleIndex] } : null;
  });
  if (dichotomies.some(dichotomy => dichotomy === null)) return null;

  return (
    <section className="space-y-5" data-tetrachotomy-dichotomy-panel={formula.id}>
      <div className="glass-panel rounded-[28px] p-5">
        <h2 className="text-lg font-medium text-[var(--color-app-fg)]">Формулы участвующих дихотомий</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-shell-muted)]">{formula.formulaText}</p>
      </div>
      {dichotomies.map(dichotomy => {
        if (!dichotomy) return null;
        const { trait, pole, poleIndex } = dichotomy;
        return (
          <section key={trait.id} className="space-y-3" data-tetrachotomy-dichotomy={trait.id} data-dichotomy-pole={poleIndex}>
            <div className="px-2">
              <h3 className="text-base font-medium text-[var(--color-app-fg)]">{trait.name} · {pole.name}</h3>
              {trait.id === 'process' ? <p className="mt-2 text-sm leading-relaxed text-[var(--color-shell-muted)]">{pole.description}</p> : null}
            </div>
            {pole.views.map((dichotomyView, index) => (
              <div key={index} className="space-y-2" data-dichotomy-view={index}>
                {dichotomyView.title ? <h4 className="px-2 text-sm font-medium text-[var(--color-shell-muted)]">{dichotomyView.title}</h4> : null}
                <FormulaPanel trait={trait} view={dichotomyView} />
              </div>
            ))}
          </section>
        );
      })}
    </section>
  );
};
