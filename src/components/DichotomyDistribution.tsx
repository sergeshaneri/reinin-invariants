import React from 'react';
import type { PoleIndex, ReininTraitId } from '../data/socionics';
import { selectDichotomyDistributionView } from '../data/selectors';
import { TypePatternCard } from './TypePatternCard';

interface Props {
  traitId: ReininTraitId;
  selectedPoleIndex: PoleIndex;
  onSelectPole: (poleIndex: PoleIndex) => void;
}

export const DichotomyDistribution: React.FC<Props> = ({
  traitId,
  selectedPoleIndex,
  onSelectPole,
}) => {
  const view = selectDichotomyDistributionView(traitId, selectedPoleIndex);

  return (
    <TypePatternCard
      view={view}
      onSelectClass={(classKey) => {
        if (!view.partition.ok) {
          return;
        }

        const partitionClass = view.partition.classes.find(candidate => candidate.key === classKey);
        const poleIndex = partitionClass?.poles[0]?.poleIndex;

        if (poleIndex !== undefined) {
          onSelectPole(poleIndex);
        }
      }}
    />
  );
};
