import type { DecoratorComponent } from './types';
import { ProcessCycle } from './ProcessCycle';

// Реестр декораторов (SVG-оверлеев) поверх диаграммы.
// Чтобы добавить новый: создайте компонент, зарегистрируйте под ключом
// и упомяните ключ в `view.decoratorIds`.
export const DECORATORS: Record<string, DecoratorComponent> = {
  'process-cycle': ProcessCycle,
};
