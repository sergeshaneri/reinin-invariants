# Atomic Tasks

Статусы: `TODO`, `IN PROGRESS`, `DONE`, `BLOCKED`.

## Execution Protocol

Для выполнения любой задачи новый агент должен читать `task-template.md`, проверять релевантные пункты из `invariant-checklist.md`, фиксировать спорные решения в `decisions.md` и завершать задачу записью в `progress.md`. Если задача передается в чистое окно, используй шаблон из `handoff.md`.

## Phase 0: Roadmap

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| R0.1 | - | DONE | Создать roadmap artifacts без правок `src`. | `plans/roadmap/PRD.md`, `plans/roadmap/domain-model.md`, `plans/roadmap/architecture.md`, `plans/roadmap/tasks.md`, `plans/roadmap/progress.md` | `npm run validate` | Только документация; риск в неполном учете текущих dirty changes. |
| R0.2 | R0.1 | DONE | Достроить execution harness для чистых окон и повторяемого выполнения задач. | `plans/roadmap/decisions.md`, `plans/roadmap/task-template.md`, `plans/roadmap/invariant-checklist.md`, `plans/roadmap/handoff.md`, `plans/roadmap/tasks.md`, `plans/roadmap/progress.md` | `npm run validate` | Только документация; риск в том, что шаблоны станут слишком тяжелыми для маленьких задач. |

## Phase 1: Testable Domain Foundation

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| D1.1 | R0.1 | DONE | Ввести stable type IDs и `SocionicType` contract без UI. | `src/data/types.ts`, `src/data/socionics.ts`, `src/data/socionics.test.ts` | `npm test`, `npm run lint` | Неверный canonical список 16 типов или спорные aliases. |
| D1.2 | D1.1 | DONE | Добавить 16 моделей А как данные `functionId -> aspectId`. | `src/data/types.ts`, `src/data/socionics.test.ts` | Tests: 16 типов, 8 функций и 8 аспектов в каждом типе, нет повторов | Ошибка в hand-authored Model A assignments. |
| D1.3 | D1.2 | DONE | Добавить membership признаков Рейнина по типам: 15 признаков, 2 полюса по 8 типов. | `src/data/memberships.ts`, `src/data/socionics.ts`, `src/data/socionics.test.ts` | Tests: полное покрытие типов, 8/8 на каждый признак, все trait IDs существуют | Нужно доменно подтвердить pole membership. |
| D1.4 | D1.3 | DONE | Добавить trait vector helpers для бинарных векторов признаков. | `src/data/partitions.ts`, `src/data/partitions.test.ts` | Tests: vector length 16, values 0/1, stable order types | Ошибка порядка типов даст неверные partitions. |
| D1.5 | D1.4 | DONE | Добавить rank over GF(2) для проверки независимости признаков. | `src/data/partitions.ts`, `src/data/partitions.test.ts` | Tests: rank 1 для одного признака, rank 2 для пары разных признаков, dependent triple fixture | Трудно отлаживать без явных fixtures. |
| D1.6 | D1.5 | DONE | Добавить generic `buildPartition(traitIds)`. | `src/data/partitions.ts`, `src/data/partitions.test.ts` | Tests: 1 trait -> 2x8, 2 traits -> 4x4, valid 3 traits -> 8x2 | Dependent triples могут ошибочно выглядеть валидными. |
| D1.7 | D1.6 | DONE | Добавить diagnostic для dependent или invalid partition requests. | `src/data/partitions.ts`, `src/data/partitions.test.ts` | Tests: duplicate trait rejected, dependent triple rejected, unknown ID impossible by type or guarded | UI должен получить понятную причину отказа. |
| D1.8 | D1.6 | DONE | Добавить selectors для type model, trait example, tetrachotomy и octochotomy view models. | `src/data/selectors.ts`, `src/data/selectors.test.ts` | Unit tests snapshot-like на компактные view models | Риск слишком раннего усложнения selector API. |

## Phase 2: Type Examples and 16 Model A Views

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| U2.1 | D1.8 | TODO | Добавить `mode` в app state и URL parser без изменения default behavior. | `src/App.tsx`, `src/data/selectors.ts`, possible `src/appState.ts`, tests | `npm test`, `npm run smoke:render` | URL regression для текущего `trait/pole/view`. |
| U2.2 | U2.1 | TODO | Добавить `ModeSelector` для перехода между признаком, типом, тетрахотомией, октохотомией. | `src/components/ModeSelector.tsx`, `src/App.tsx` | `npm run lint`, e2e basic navigation | Слишком много controls в первом viewport. |
| U2.3 | U2.1 | TODO | Добавить `TypeSelector` с 16 типами и URL param `type`. | `src/components/TypeSelector.tsx`, `src/App.tsx` | Tests for URL clamp/fallback, e2e select type | Спорный порядок типов в списке. |
| U2.4 | U2.3 | TODO | Создать `TypeModelDiagram` для модели А выбранного типа. | `src/diagrams/TypeModelDiagram.tsx`, `src/diagrams/registry.ts`, `src/diagrams/types.ts` | `npm run build`, visual smoke, e2e desktop/mobile | Перегрузка диаграммы текстом на mobile. |
| U2.5 | U2.4 | TODO | Подсвечивать текущий trait invariant на модели А типа. | `src/diagrams/TypeModelDiagram.tsx`, `src/data/selectors.ts`, tests | Unit tests selector, e2e hover/click smoke | Нужно ясно показать, что подсветка является примером, а не новой формулой. |
| U2.6 | U2.5 | TODO | Добавить панель "типы на полюсе" для выбранного признака. | `src/components/TraitTypesPanel.tsx`, `src/App.tsx`, selectors | `npm run smoke:render`, e2e | Дублирование с будущей partition grid. |

## Phase 3: Tetrachotomies

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| T3.1 | D1.8 | TODO | Добавить selector для списка всех валидных пар признаков. | `src/data/partitions.ts`, `src/data/selectors.ts`, tests | Tests: количество пар, каждая пара 4x4 | Если есть исключения, нужно доменное объяснение. |
| T3.2 | U2.1, T3.1 | TODO | Добавить `PartitionSelector` для выбора двух признаков. | `src/components/PartitionSelector.tsx`, `src/App.tsx` | e2e select two traits, URL sync | UI выбора 15x15 может быть шумным. |
| T3.3 | T3.2 | TODO | Добавить `TetrachotomyView`: 4 класса по 4 типа, labels полюсов. | `src/components/TetrachotomyView.tsx`, selectors | Unit selector tests, e2e desktop/mobile | Длинные имена полюсов могут ломать layout. |
| T3.4 | T3.3 | TODO | Добавить link-through из класса тетрахотомии к списку типов и type examples. | `src/components/TetrachotomyView.tsx`, `src/App.tsx` | e2e click class/type | Потеря контекста выбранных признаков при переходе. |
| T3.5 | T3.3 | TODO | Добавить формульное summary тетрахотомии без дублирования domain logic в JSX. | `src/components/PartitionFormulaPanel.tsx`, selectors | Snapshot-like selector tests, render smoke | Непонятные labels при неполной локализации. |

## Phase 4: Octochotomies

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| O4.1 | D1.7 | TODO | Добавить selector валидных independent triples. | `src/data/partitions.ts`, `src/data/selectors.ts`, tests | Tests: valid triples rank 3, dependent triples excluded | Ошибка rank даст ложные октохотомии. |
| O4.2 | U2.1, O4.1 | TODO | Расширить `PartitionSelector` до режима трех признаков с disabled dependent combos. | `src/components/PartitionSelector.tsx`, `src/App.tsx` | e2e select valid/invalid triple | Трудно объяснить disabled состояние без лишнего текста. |
| O4.3 | O4.2 | TODO | Добавить `OctochotomyView`: 8 классов по 2 типа. | `src/components/OctochotomyView.tsx`, selectors | Unit selector tests, e2e mobile layout | 8 карточек могут быть слишком плотными. |
| O4.4 | O4.3 | TODO | Добавить diagnostic panel для зависимых triples. | `src/components/PartitionDiagnostic.tsx`, selectors | Tests for diagnostic, e2e invalid URL | Нужно не пугать пользователя математическим сообщением. |

## Phase 5: Aspect Icons

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| V5.1 | D1.1 | TODO | Определить icon metadata для всех аспектов без React в domain records. | `src/data/aspectVisuals.ts`, `src/data/socionics.ts`, tests | Tests: every `AspectId` has visual metadata | Спорные icon metaphors для аспектов. |
| V5.2 | V5.1 | TODO | Создать UI registry, который мапит `iconKey` в lucide/custom icon. | `src/components/AspectIcon.tsx`, `src/diagrams/AspectFunctionDiagram.tsx`, `src/diagrams/TypeModelDiagram.tsx` | `npm run lint`, render smoke | Bundle size и визуальная неоднозначность. |
| V5.3 | V5.2 | TODO | Добавить настройку compact display: icon, symbol, icon+symbol. | `src/components/AspectDisplayToggle.tsx`, `src/App.tsx` | e2e toggle, accessibility labels | Persisted preference может конфликтовать с language/theme params. |

## Phase 6: Dark Theme

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| H6.1 | U2.1 | TODO | Ввести theme state, URL/localStorage policy и `ThemeToggle`. | `src/App.tsx`, `src/components/ThemeToggle.tsx`, tests | Unit tests for preference resolution, e2e toggle | SSR/render smoke без `window` должен остаться стабильным. |
| H6.2 | H6.1 | TODO | Добавить CSS variables/design tokens для базовых цветов. | `src/index.css` или global CSS, `tailwind` usage | `npm run build`, screenshot/e2e | Ручная миграция hardcoded классов может быть неполной. |
| H6.3 | H6.2 | TODO | Перевести shell components на tokens. | `src/App.tsx`, `Header`, `TraitNav`, `PoleSelector`, `ViewSelector`, `Footer`, `HelpModal` | e2e light/dark desktop/mobile | Контраст и focus states. |
| H6.4 | H6.2 | TODO | Перевести diagrams and formula panels на tokens. | `src/diagrams/*`, `src/components/FormulaPanel.tsx` | canvas/screenshot style review, e2e | Цвета групп должны оставаться различимыми в dark mode. |

## Phase 7: English Version

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| L7.1 | D1.1 | TODO | Ввести `Locale` и fallback helper без миграции всех строк. | `src/data/localization.ts`, tests | Unit tests fallback ru/en | Частичная локализация может выглядеть случайной. |
| L7.2 | L7.1 | TODO | Вынести UI strings первого экрана и controls в catalogs. | `src/i18n/ui.ts`, `Header`, `TraitNav`, `PoleSelector`, `ViewSelector`, `FormulaPanel` | `npm run lint`, smoke render ru/en | Риск повредить русские тексты или кодировку. |
| L7.3 | L7.1 | TODO | Добавить английские names для аспектов, функций, типов, признаков и полюсов. | `src/data/*`, `src/data/socionics.test.ts` | Tests: every visible domain label has ru and en or allowed fallback | Нужна терминологическая ревизия. |
| L7.4 | L7.2, L7.3 | TODO | Добавить `LocaleToggle` и URL param `lang`. | `src/components/LocaleToggle.tsx`, `src/App.tsx` | e2e language switch preserves selected domain state | SEO не цель, но URL должен быть стабильным. |
| L7.5 | L7.4 | TODO | Покрыть e2e русскую и английскую навигацию. | `tests/*`, maybe snapshots | `npm run test:e2e` | Снапшоты могут быть хрупкими при длинных текстах. |

## Phase 8: Semantic Interpretations

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| S8.1 | L7.1, D1.8 | TODO | Ввести schema `SemanticInterpretation` и тесты ссылочной целостности. | `src/data/interpretations.ts`, `src/data/interpretations.test.ts` | Tests: target IDs exist, locale valid, status valid | Контент может смешаться с вычислениями. |
| S8.2 | S8.1 | TODO | Добавить первые reviewed interpretations для trait poles или type examples. | `src/data/interpretations.ts` | Tests pass, content review checklist | Спорные формулировки требуют авторской ревизии. |
| S8.3 | S8.1 | TODO | Добавить `InterpretationPanel` с fallback "нет интерпретации". | `src/components/InterpretationPanel.tsx`, `src/App.tsx`, selectors | render smoke, e2e panel visibility | Панель может перегрузить основной экран. |
| S8.4 | S8.3 | TODO | Подключить interpretations к tetrachotomy/octochotomy classes. | `src/components/*Partition*`, selectors | selector tests, e2e | Стабильность `partitionClass.key` важна для ссылок. |

## Phase 9: Hardening and Release

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| Q9.1 | U2.6, T3.5, O4.4 | TODO | Расширить smoke render на новые режимы. | `scripts/render-smoke.tsx`, tests | `npm run smoke:render` | Smoke должен оставаться быстрым. |
| Q9.2 | H6.4, L7.5 | TODO | Добавить e2e сценарии theme + locale + partitions. | `tests/*` | `npm run test:e2e` | Playwright snapshots могут требовать стабильных размеров. |
| Q9.3 | all feature phases | TODO | Запустить полную проверку и обновить `plans/roadmap/progress.md`. | `plans/roadmap/progress.md` | `npm run validate` | Audit или smoke могут упасть из-за внешнего окружения. |
| Q9.4 | D1.4 | TODO | Добавить краткое объяснение H3-порядка аспектон/функцион/социон в справку или документацию, не перегружая главный экран. | `plans/roadmap/PRD.md`, `src/components/HelpModal.tsx` или docs | `npm run smoke:render`, `npm run test:e2e` если меняется UI | Теоретическое объяснение может стать слишком длинным для первого экрана. |
