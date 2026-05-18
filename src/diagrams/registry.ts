import type { DiagramComponent } from './types';
import { AspectFunctionDiagram } from './AspectFunctionDiagram';

// Реестр визуализаций. Чтобы добавить новый вид:
//   1) Создайте файл src/diagrams/<MyDiagram>.tsx с экспортом DiagramComponent.
//   2) Зарегистрируйте его здесь под уникальным ключом.
//   3) Укажите ключ в `diagramId` нужного признака (REININ_TRAITS).
export const DIAGRAMS: Record<string, DiagramComponent> = {
  'aspect-function': AspectFunctionDiagram,
};

export const DEFAULT_DIAGRAM_ID = 'aspect-function';
