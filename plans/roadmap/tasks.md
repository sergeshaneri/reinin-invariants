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

## Phase 2: Navigation UX Realignment and Partition Explorer Foundation

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| U2.1 | D1.8 | DONE | Добавить `mode` в app state и URL parser без изменения default behavior. | `src/App.tsx`, `src/data/selectors.ts`, possible `src/appState.ts`, tests | `npm test`, `npm run smoke:render` | URL regression для текущего `trait/pole/view`. |
| U2.2 | U2.1 | DONE | Добавить `ModeSelector` для перехода между признаком, типом, тетрахотомией, октохотомией. | `src/components/ModeSelector.tsx`, `src/App.tsx` | `npm run lint`, e2e basic navigation | Слишком много controls в первом viewport. |
| U2.3 | U2.1 | DONE | Добавить `TypeSelector` с 16 типами и URL param `type`. | `src/components/TypeSelector.tsx`, `src/App.tsx` | Tests for URL clamp/fallback, e2e select type | Спорный порядок типов в списке. |
| U2.4 | U2.3 | DONE | Создать `TypeModelDiagram` для модели А выбранного типа. | `src/diagrams/TypeModelDiagram.tsx`, `src/App.tsx`, `tests/e2e/app.spec.ts` | `npm run build`, visual smoke, e2e desktop/mobile | Перегрузка диаграммы текстом на mobile. |
| U2.5 | U2.4 | DONE | Подсвечивать текущий trait invariant на модели А типа. | `src/diagrams/TypeModelDiagram.tsx`, `src/data/selectors.ts`, tests | Unit tests selector, e2e smoke | UX признан неверным: type mode не должен скрыто зависеть от выбранного признака. |
| X2.1 | U2.5 | DONE | Убрать скрытую зависимость type mode от `trait`: модель А типа должна быть чистым type path. | `src/App.tsx`, `src/diagrams/TypeModelDiagram.tsx`, `src/data/selectors.ts`, tests | `npm run lint`, e2e type URL regression | Не потерять полезный `TypeModelDiagram`; подсветку перенести в partition path. |
| X2.2 | X2.1 | DONE | Ввести общую state/URL-модель Partition Explorer: `kind`, `traitIds`, `selectedClassKey`, дефолтный класс = класс ИЛЭ. | `src/appState.ts`, `src/data/selectors.ts`, tests | Unit URL tests, selector tests | Не смешать `trait` path, `type` path и partition path в одно скрытое состояние. |
| X2.3 | X2.2 | DONE | Создать shared 16-type pattern card для дихотомий, тетрахотомий и октохотомий в canonical H3 порядке. | `src/components/TypePatternCard.tsx`, selectors, tests | render smoke, e2e visual smoke | Цвет не должен быть единственным каналом: нужны labels/tooltips. |
| X2.4 | X2.3 | DONE | Добавить visual chooser для дихотомий: галерея мини-схем + сохранить sidebar/list chooser. | `src/components/DichotomyGallery.tsx`, `src/components/TraitNav.tsx`, `src/App.tsx` | e2e choose trait by card and sidebar | Два способа выбора не должны вести разные состояния. |

## Phase 3: Dichotomy Detail Path

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| D3.1 | X2.4 | DONE | Пересобрать trait screen как путь дихотомии: признак -> полюс -> view; полюс по умолчанию = полюс ИЛЭ. | `src/App.tsx`, `src/appState.ts`, `src/data/selectors.ts`, tests | URL tests, e2e default pole for ILE | ИЛЭ подтвержден пользователем как первый полюс во всех дихотомиях; старые links без `pole` сохраняют поведение. |
| D3.2 | D3.1 | DONE | Добавить в detail дихотомии схему распределения 16 типов по двум полюсам. | `src/components/DichotomyDistribution.tsx`, selectors | e2e select pole from pattern | Паттерн должен быть понятен без длинных объяснений на экране. |
| D3.3 | D3.2 | DONE | Добавить панель типов выбранного полюса как часть dichotomy path. | `src/components/PartitionTypesPanel.tsx`, selectors | `npm run smoke:render`, e2e | Не дублировать будущий grid; панель должна быть reusable для tetra/octo. |
| D3.4 | D3.3 | DONE | Добавить 8 compact Model A previews для типов выбранного полюса с подсветкой детерминирующих аспектов/позиций и переключением аспектов pictogram/abbrev. | `src/components/ModelAPreviewGrid.tsx`, `src/components/AspectGlyph.tsx`, `src/diagrams/TypeModelDiagram.tsx`, selectors | selector tests, e2e mobile/desktop | Для `isBlockPermutation` views подсветка должна показывать принадлежность аспект-функция к допустимому блоку, а не ложную уникальную биекцию блоков. |

## Phase 4: Tetrachotomy and Octochotomy Composition

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| C4.1 | X2.3 | DONE | Добавить selectors для catalogs: все валидные pairs и independent triples с preview pattern data. | `src/data/partitions.ts`, `src/data/selectors.ts`, tests | Tests: counts, class sizes, dependent triples excluded | Не импровизировать labels готовых tetra/octo без данных пользователя. |
| C4.2 | C4.1 | TODO | Добавить multi-entry chooser: sequential trait selection, catalog list, visual pattern gallery. | `src/components/PartitionChooser.tsx`, `src/App.tsx` | e2e choose tetra/octo through all entry modes | Сложность UI: нужны compact controls и один canonical state. |
| C4.3 | C4.2 | TODO | Добавить composition view для тетрахотомий: 2 component dichotomy cards -> final 4-class pattern. | `src/components/PartitionCompositionView.tsx`, selectors | e2e component toggles, render smoke | Важно показать, что итог = пересечение компонентов, не новый hand-authored object. |
| C4.4 | C4.3 | TODO | Добавить detail тетрахотомии: 4 classes, selected class default = class ИЛЭ, types panel, Model A previews. | `src/components/TetrachotomyView.tsx`, `src/components/ModelAPreviewGrid.tsx` | selector tests, e2e desktop/mobile | 4 groups x 4 types могут перегрузить mobile layout. |
| C4.5 | C4.2 | TODO | Добавить composition view для октохотомий: 3 component dichotomy cards -> final 8-class pattern. | `src/components/PartitionCompositionView.tsx`, selectors | e2e component/final highlight modes | Нужна хорошая diagnostic для dependent triples. |
| C4.6 | C4.5 | TODO | Добавить detail октохотомии: 8 classes, selected class default = class ИЛЭ, types panel, Model A previews. | `src/components/OctochotomyView.tsx`, `src/components/PartitionDiagnostic.tsx` | e2e valid and invalid triple | 8 classes должны быть readable без card-heavy перегруза. |

## Phase 4L: Future Subgroup Lattice

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| G4L.1 | C4.6 | TODO | Зафиксировать domain model для решетки подгрупп/подпространств группы признаков. | `plans/roadmap/domain-model.md`, possible `src/data/lattice.ts` | domain review, no UI required | Дальняя фаза: не блокировать ближний Partition Explorer. |
| G4L.2 | G4L.1 | TODO | Прототип визуализации включений: дихотомии -> тетрахотомии -> октохотомии. | `src/components/LatticeView.tsx` or docs prototype | visual smoke only | Риск сделать математически красиво, но непонятно для целевого сценария. |
## Phase 5: Aspect Icons

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| V5.1 | D1.1 | TODO | Определить icon metadata для всех аспектов без React в domain records. | `src/data/aspectVisuals.ts`, `src/data/socionics.ts`, tests | Tests: every `AspectId` has visual metadata | Спорные icon metaphors для аспектов. |
| V5.2 | V5.1 | TODO | Создать UI registry, который мапит `iconKey` в lucide/custom icon. | `src/components/AspectIcon.tsx`, `src/diagrams/AspectFunctionDiagram.tsx`, `src/diagrams/TypeModelDiagram.tsx` | `npm run lint`, render smoke | Bundle size и визуальная неоднозначность. |
| V5.3 | V5.2 | TODO | Расширить настройку compact display после D3.4: icon, symbol, icon+symbol, persistence if needed. | `src/components/AspectDisplayToggle.tsx`, `src/App.tsx` | e2e toggle, accessibility labels | Persisted preference может конфликтовать с language/theme params. |

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
| Q9.1 | D3.4, C4.6 | TODO | Расширить smoke render на новые partition/detail режимы. | `scripts/render-smoke.tsx`, tests | `npm run smoke:render` | Smoke должен оставаться быстрым. |
| Q9.2 | H6.4, L7.5 | TODO | Добавить e2e сценарии theme + locale + partitions. | `tests/*` | `npm run test:e2e` | Playwright snapshots могут требовать стабильных размеров. |
| Q9.3 | all feature phases | TODO | Запустить полную проверку и обновить `plans/roadmap/progress.md`. | `plans/roadmap/progress.md` | `npm run validate` | Audit или smoke могут упасть из-за внешнего окружения. |
| Q9.4 | D1.4 | TODO | Добавить краткое объяснение H3-порядка аспектон/функцион/социон в справку или документацию, не перегружая главный экран. | `plans/roadmap/PRD.md`, `src/components/HelpModal.tsx` или docs | `npm run smoke:render`, `npm run test:e2e` если меняется UI | Теоретическое объяснение может стать слишком длинным для первого экрана. |
