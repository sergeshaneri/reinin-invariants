import type { ReininTrait, TraitPole, View } from '../data/socionics';

// Декоратор — самостоятельный SVG-оверлей, который накладывается поверх диаграммы.
// Знает только текущий контекст (признак/полюс/view), позиционируется абсолютно.
export interface DecoratorProps {
  trait: ReininTrait;
  pole: TraitPole;
  view: View;
}

export type DecoratorComponent = React.FC<DecoratorProps>;
