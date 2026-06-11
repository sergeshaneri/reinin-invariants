import type { AspectId, ReininTrait, TraitPole, View } from '../data/socionics';
import type { ActiveCell } from './interaction';

// Контракт визуализатора признака. Любая диаграмма должна принимать этот объект
// и рисовать что угодно — главное, чтобы взаимодействие с курсором аспекта/функции
// прокидывалось обратно наружу (для синхронизации с формулой и пр.).
export interface DiagramProps {
  trait: ReininTrait;
  pole: TraitPole;
  view: View;
  activeCell: ActiveCell;
  onAspectHover: (id: AspectId | null) => void;
  onFunctionHover: (id: number | null) => void;
  onAspectClick: (id: AspectId) => void;
  onFunctionClick: (id: number) => void;
}

export type DiagramComponent = React.FC<DiagramProps>;
