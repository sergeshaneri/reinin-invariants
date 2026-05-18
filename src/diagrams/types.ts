import type { AspectId, ReininTrait, TraitPole, View } from '../data/socionics';

// Контракт визуализатора признака. Любая диаграмма должна принимать этот объект
// и рисовать что угодно — главное, чтобы взаимодействие с курсором аспекта/функции
// прокидывалось обратно наружу (для синхронизации с формулой и пр.).
export interface DiagramProps {
  trait: ReininTrait;
  pole: TraitPole;
  view: View;
  hoveredAspect: AspectId | null;
  setHoveredAspect: (a: AspectId | null) => void;
  hoveredFunction: number | null;
  setHoveredFunction: (f: number | null) => void;
}

export type DiagramComponent = React.FC<DiagramProps>;
