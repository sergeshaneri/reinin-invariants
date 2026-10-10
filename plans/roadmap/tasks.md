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
| X2.5 | X2.4, F4.4 | DONE | Вывести существующие диаграммы дихотомий и тетрахотомий выше дополнительных представлений; сохранить компактный выбор на mobile, полные каталоги и дополнительные материалы. | `src/App.tsx`, `src/components/Header.tsx`, `src/components/TetrachotomyView.tsx`, `src/components/AspectDisplayToggle.tsx`, `src/components/ThemeToggle.tsx`, `src/App.layout.test.tsx`, `tests/e2e/app.spec.ts` | SSR layout tests, desktop/mobile viewport assertions, URL selection, snapshots, `npm run validate` | UI-проверки прошли; полный release gate остановился на существующих уязвимостях зависимостей. Теоретическую форму диаграмм и доменные данные не менять. |

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
| C4.2 | C4.1 | DONE | Добавить multi-entry chooser: sequential trait selection, catalog list, visual pattern gallery. | `src/components/PartitionChooser.tsx`, `src/App.tsx` | e2e choose tetra/octo through all entry modes | Сложность UI: нужны compact controls и один canonical state. |
| C4.3 | C4.2 | DONE | Добавить composition view для тетрахотомий: 2 component dichotomy cards -> final 4-class pattern. | `src/components/PartitionCompositionView.tsx`, selectors | e2e component toggles, render smoke | Важно показать, что итог = пересечение компонентов, не новый hand-authored object. |
| C4.4 | C4.3 | DONE | Добавить detail тетрахотомии: 4 classes, selected class default = class ИЛЭ, types panel, Model A previews. | `src/components/TetrachotomyView.tsx`, `src/components/ModelAPreviewGrid.tsx` | selector tests, e2e desktop/mobile | 4 groups x 4 types могут перегрузить mobile layout. |
| C4.5 | C4.2 | DONE | Добавить composition view для октохотомий: 3 component dichotomy cards -> final 8-class pattern. | `src/components/PartitionCompositionView.tsx`, selectors | e2e component/final highlight modes | Нужна хорошая diagnostic для dependent triples. |
| C4.6 | C4.5 | DONE | Добавить detail октохотомии: 8 classes, selected class default = class ИЛЭ, types panel, Model A previews. | `src/components/OctochotomyView.tsx`, `src/components/PartitionDiagnostic.tsx` | e2e valid and invalid triple | 8 classes должны быть readable без card-heavy перегруза. |

## Phase 4F: Formula Ground Truth for Tetrachotomies and Octochotomies

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| F4.1 | C4.6 | DONE | Зафиксировать различие между structural partitions и авторскими formula catalogs: текущий UI строит разбиения, но не доказывает перенос всех формул тетра/окто. | `plans/roadmap/PRD.md`, `plans/roadmap/domain-model.md`, `plans/roadmap/decisions.md`, `plans/roadmap/progress.md` | docs review | Нельзя пометить tetra/octo formula слой DONE только потому, что structural partition UI работает. |
| F4.2 | F4.1 | DONE | Ввести доменную schema для source-derived тетрахотомий: formula id, source table, left trait, basis traits, relation, class groups, extraction status. | `src/data/tetrachotomies.ts`, `src/data/tetrachotomies.test.ts`, `src/data/socionics.ts` | Unit tests: 35 source records, stable IDs, registered trait IDs, 4 groups x 4 types | Нужно не потерять source metadata из `tetrachotomy-doc-extract.json`. |
| F4.3 | F4.2 | DONE | Сверить 35 тетра-формул из extract с вычисляемыми partitions и зафиксировать mismatch diagnostics. | `src/data/tetrachotomies.test.ts`, maybe extraction fixture under `src/data/fixtures/` | Tests: each source formula class set equals computed partition class set, mismatches fail explicitly | Возможны реальные расхождения extraction/кодирования, их нельзя тихо нормализовать. |
| F4.4 | F4.3 | DONE | Перевести tetra catalog UI с "все пары признаков" на canonical 35 source formulas, сохранив остальные structural pairs как advanced/basis path. | `src/data/selectors.ts`, `src/components/PartitionChooser.tsx`, tests | Selector tests, e2e choose canonical tetra formula | 105 вычисляемых пар не равны 35 source formulas; UI должен объяснять canonical vs structural. |
| F4.5 | F4.1 | DONE | Ввести draft schema для source-derived октохотомий с явным status: `draft`, `incomplete`, `verified`. | `src/data/octochotomies.ts`, `src/data/octochotomies.test.ts`, `harness/theory/Октохотомии.md` | Unit tests: records link to valid type pairs/classes and status is explicit | Исходник окт ещё дописывается; нельзя выдавать все independent triples за авторский каталог. |
| F4.6 | F4.5 | IN PROGRESS | Доделать/занести недостающие окто-формулы по `harness/theory/Октохотомии.md`, помечая как `verified` только записи с явным basis и совпадением computed partition. | `src/data/octochotomies.ts`, `src/data/octochotomies.test.ts` | Tests: verified octo formulas have 8 classes x 2 types and match computed partitions | Частично выполнено: `octo-08` и `octo-11` verified; остальные остаются `incomplete`/`draft` без новых теоретических решений. `octo-09` оставлен incomplete при нормальном source marker `знаки?`; `octo-10` candidate basis dependent; `octo-12` candidate basis mismatch; `octo-13` недоделан в source, видны только первые пары. |
| F4.7 | F4.6 | TODO | Перевести octo catalog UI на verified/draft source records, а structural independent triples оставить как diagnostic/advanced режим. | `src/data/selectors.ts`, `src/components/PartitionChooser.tsx`, `src/components/OctochotomyView.tsx`, tests | Selector tests, e2e verified/draft labels | Риск смешать "математически возможное" и "авторски описанное"; выполнять после тетрахотомического formula-transfer фокуса. |

## Phase 4T: Tetrachotomy Aspect-to-Function Formula Transfer

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| T4A.1 | F4.4 | IN PROGRESS | Сделать активным фокусом перенос тетрахотомий в source-derived формулы отображения аспектов/аспектных блоков в функции/функциональные блоки; начинать с простых формул, где не участвуют дихотомии 3 класса. | `plans/roadmap/tasks.md`, `plans/roadmap/progress.md`, `plans/roadmap/tetrachotomy-ui-handoff.md` | docs review | Нельзя снова подменить задачу списками типов, классами тетрахотомии или structural partitions. |
| T4A.2 | T4A.1 | DONE | Расширить `TetrachotomyFormulaRecord.sourceBlocks` для простых source rows из `harness/theory/tetrachotomy-source.docx`: прямые `→` строки, class 1/2 traits only, без `~`-эквивалентностей и `>`-последовательностей. | `src/data/tetrachotomies.ts`, `src/data/tetrachotomies.test.ts`, `scripts/audit-tetrachotomy-docx.ts`, `harness/README.md` | Unit tests: полный набор class-1/2 формул, source provenance и Model A diagnostics; `npm run audit:tetra-docx`; e2e новых групп | Перенесены все 13 no-class-3 формул: `tetra-01`, `03`, `04`, `06`, `07`, `12`, `13`, `18`, `19`, `28`, `29`, `32`, `33`. Для `07`/`13` группы extract подтверждены автором 2026-10-02; literal DOCX groups сохранены в correction metadata, строки сверяются только внутри своей формулы. Исправление `tetra-28` согласовано и применено 2026-10-03 в T4A.2-review; placement mismatches отсутствуют во всех 13 формулах. 22 class-3 формулы сохраняют fallback. |
| T4A.2-deferred | T4A.2 | DONE | Разобрать отложенные простые формулы `tetra-07` (`Верт = Наль Х Таль`) и `tetra-13` (`Бс/Пр = Тк/Ст Х Таль`) после сверки DOCX row groups с extract `typeIds` или пользовательского подтверждения правильной привязки. | `src/data/tetrachotomies.ts`, `src/data/tetrachotomies.test.ts`, `scripts/audit-tetrachotomy-docx.ts` | Confirmed group sets, literal DOCX provenance, все placements новых строк на четырёх моделях каждой тетрады, desktop/mobile dark/light | Автор подтвердил группы extract. Исправления привязки ограничены двумя записями реестра; исходный DOCX не изменён. Неподтверждённые corrections и lookup по нормализованной группе вместо literal source отклоняются тестами. |
| T4A.2-review | T4A.2 | DONE | Согласовать и применить исправление исходных строк `tetra-28` (`Ус/Уп = Сб/Об Х Наль`) для рациональных тетрад; отделить точный перенос текста от семантической корректности. | `plans/roadmap/tetra-28-review/README.md`, `plans/roadmap/tetra-28-review/verify.ts`, `src/data/tetrachotomies.ts`, `harness/theory/tetrachotomy-source.docx` | 0 placement mismatches, 48 равенств образов, 64 classification checks среди 16 моделей; unit/DOCX audit; desktop/mobile dark/light | Автор разрешил прямую поправку 2026-10-03. Переставлены четыре левые части в данных и рабочем DOCX; правые части, группы и остальные строки сохранены. Оригинальный DOCX подтверждён в Git `70acb99`; отдельная архивная ветка и новые row-correction metadata не создавались. 112 unit и 4 focused e2e прошли; aggregate validate блокируется семью прежними dependency vulnerabilities. |
| T4A.3a | T4A.2 | TODO | Отдельно согласовать модель диаграммы для тетрахотомий без дихотомий 3 класса: объекты, направление, подписи, группировка строк, fallback для формул без `sourceBlocks`. | `plans/roadmap/progress.md`, possible sketch notes | User approval before code | Диаграммы являются главным смысловым слоем; нельзя начинать UI-реализацию без утвержденной формы. |
| T4A.3b | T4A.3a | TODO | Реализовать утвержденную диаграмму `Отображение аспектов в функции` для перенесенных no-class-3 formulas: показывать aspect side, function-block label (`мерность 4` etc.), functions and source features; unsupported formulas show honest fallback. | `src/components/TetrachotomyAspectFunctionPanel.tsx`, `src/components/TetrachotomyView.tsx`, `tests/e2e/app.spec.ts`, `scripts/render-smoke.tsx` | `npm test -- src/data/tetrachotomies.test.ts src/data/selectors.test.ts`, `npm run smoke:render`, focused e2e | Не смешивать простые direct rows с class-3/`~`/`>` семантикой. |
| T4A.4-deferred | T4A.3b | TODO | Отдельно согласовать будущую модель диаграмм для тетрахотомий, где участвуют дихотомии 3 класса (`Дм/Ар`, `+/-`, `?/!`, `Пц/Рз`), `~`-эквивалентности или `>`-последовательности. | `harness/theory/tetrachotomy-source.docx`, theory notes, possible prototype sketches | User approval before source transfer/UI | Конечного варианта сейчас нет; держать как отдельный theory-design blocker, не блокировать реализацию no-class-3 диаграмм. |

## Phase 4L: Future Subgroup Lattice

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| G4L.1 | F4.7 | TODO | Зафиксировать domain model для решетки подгрупп/подпространств группы признаков. | `plans/roadmap/domain-model.md`, possible `src/data/lattice.ts` | domain review, no UI required | Дальняя фаза: не блокировать formula-ground-truth слой. |
| G4L.2 | G4L.1 | TODO | Прототип визуализации включений: дихотомии -> тетрахотомии -> октохотомии. | `src/components/LatticeView.tsx` or docs prototype | visual smoke only | Риск сделать математически красиво, но непонятно для целевого сценария. |
## Phase 5: Aspect Icons

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| V5.1 | D1.1 | DONE | Определить icon metadata для всех аспектов без React в domain records. | `src/data/aspectVisuals.ts`, `src/data/socionics.ts`, tests | Tests: every `AspectId` has visual metadata | Спорные icon metaphors для аспектов. |
| V5.2 | V5.1 | DONE | Создать UI registry, который мапит `iconKey` в lucide/custom icon. | `src/components/AspectIcon.tsx`, `src/diagrams/AspectFunctionDiagram.tsx`, `src/diagrams/TypeModelDiagram.tsx` | `npm run lint`, render smoke | Bundle size и визуальная неоднозначность. |
| V5.3 | V5.2 | DONE | Расширить настройку compact display после D3.4: icon, symbol, icon+symbol, persistence if needed. | `src/components/AspectDisplayToggle.tsx`, `src/App.tsx` | e2e toggle, accessibility labels | Persisted preference может конфликтовать с language/theme params. |

## Phase 6: Dark Theme

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| H6.1 | U2.1 | DONE | Ввести theme state, URL/localStorage policy и `ThemeToggle`. | `src/App.tsx`, `src/components/ThemeToggle.tsx`, tests | Unit tests for preference resolution, e2e toggle | SSR/render smoke без `window` должен остаться стабильным. |
| H6.2 | H6.1 | DONE | Добавить CSS variables/design tokens для базовых цветов. | `src/index.css` или global CSS, `tailwind` usage | `npm run build`, screenshot/e2e | Ручная миграция hardcoded классов может быть неполной. |
| H6.3 | H6.2 | DONE | Перевести shell components на tokens. | `src/App.tsx`, `Header`, `TraitNav`, `PoleSelector`, `ViewSelector`, `Footer`, `HelpModal` | e2e light/dark desktop/mobile | Контраст и focus states. |
| H6.4 | H6.2 | DONE | Перевести diagrams and formula panels на tokens. | `src/diagrams/*`, `src/components/FormulaPanel.tsx` | canvas/screenshot style review, e2e | Цвета групп должны оставаться различимыми в dark mode. |

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
| Q9.1 | D3.4, C4.6 | DONE | Расширить smoke render на новые partition/detail режимы. | `scripts/render-smoke.tsx`, tests | `npm run smoke:render` | Smoke должен оставаться быстрым. |
| Q9.2 | H6.4, L7.5 | TODO | Добавить e2e сценарии theme + locale + partitions. | `tests/*` | `npm run test:e2e` | Playwright snapshots могут требовать стабильных размеров. |
| Q9.3 | all feature phases | TODO | Запустить полную проверку и обновить `plans/roadmap/progress.md`. | `plans/roadmap/progress.md` | `npm run validate` | Audit или smoke могут упасть из-за внешнего окружения. |
| Q9.4 | D1.4 | DONE | Добавить краткое объяснение H3-порядка аспектон/функцион/социон в справку или документацию, не перегружая главный экран. | `plans/roadmap/PRD.md`, `src/components/HelpModal.tsx` или docs | `npm run smoke:render`, `npm run test:e2e` если меняется UI | Теоретическое объяснение может стать слишком длинным для первого экрана. |

## UI Refinements and Theory Introduction Backlog

| ID | Depends | Status | Цель | Вероятные файлы | Проверки | Риски |
|---|---|---:|---|---|---|---|
| X2.11 | H6.3 | DONE | Сделать выбранный полюс визуально однозначным: галочка у выбранного полюса и согласованная с другими переключателями заливка. | `src/components/PoleSelector.tsx`, `tests/e2e/ui-backlog.spec.ts` | Desktop/mobile, обе темы: единственная галочка, `aria-selected` (существующий role=tab), состояние и URL совпадают для «Статики / Динамики». | Membership и смысл полюсов сохранены; полная browser validation остаётся незавершённой, см. progress 2026-10-09. |
| X2.12 | V5.3 | DONE | Соблюдать режим отображения в обычном аспектоне: пиктограммы без аббревиатур, аббревиатуры без пиктограмм, оба представления вместе. Передать режим также во встроенные диаграммы кратии и порядкового условия. | `src/diagrams/AspectFunctionDiagram.tsx`, `src/diagrams/types.ts`, `src/App.tsx`, `TetrachotomyCracyPanel.tsx`, `TetrachotomyOrderPanel.tsx`, unit/e2e tests | Red/green unit regression; три режима, обе темы, desktop/mobile, узкий и широкий контейнер; доступные названия и подсказки сохранены. | Подписи отдельно согласованных source-row карточек сохранены; порядок аспектов, группировки и доменные данные не менялись. |
| X2.13 | V5.3 | DONE | Удалить круглые индексы блоков из алгебраических формул; согласовать аспекты с «Пикто / Аббр. / Оба» в фиксированных парах и блочных перестановках, включая fallback тетрахотомий; сохранить номера функций. | `FormulaPanel.tsx`, `FormulaPanel.test.tsx`, `src/App.tsx`, `TetrachotomyDichotomyPanel.tsx`, `TetrachotomyView.tsx`, `tests/e2e/ui-backlog.spec.ts`, `scripts/render-smoke.tsx` | Red/green unit и browser regression для фиксированных пар; все non-permutation views в трёх режимах; desktop/mobile и обе темы; прежние проверки блочных перестановок сохранены. | Первая реализация пропустила PairView; исправлено по скриншоту пользователя. Состав блоков, порядок функций и смысл перестановки сохранены; общий validate не зелёный, см. progress. |
| X2.10 | X2.5 | DONE | Исправить сжатие переключателей в «Оформлении и обозначениях»: компоновка групп зависит от доступной ширины, кнопки переносятся целиком без обрезания подписей и сближения иконок. | `src/App.tsx`, `AspectDisplayToggle.tsx`, `ThemeToggle.tsx`, `src/index.css`, `tests/e2e/ui-backlog.spec.ts` | Red/green browser regression; viewport 320/360/640/768/1280 px, контейнер 260/320/480/640 px, обе темы и все переключатели. | Настройки, доступные названия и активные состояния сохранены; общий browser gate отдельно не завершён. |
| X2.6 | X2.5 | DONE | Непрозрачные тематические селекторы формулы/тетрады; типы полюса сразу после диаграммы; цветное приглушение незадействованных аспектов/функций без добавления принадлежности к формуле. | `src/App.tsx`, `src/components/TetrachotomyView.tsx`, `src/components/TetrachotomyAspectFunctionPanel.tsx`, `src/index.css`, layout/e2e tests | SSR, native select/option styles in both themes, desktop/mobile e2e; full validate blocked by dependency audit | Цветовая окраска и source-row membership должны оставаться раздельными. |
| X2.7 | X2.6 | DONE | Уточнить карточки прямых source-строк: индивидуальные аббревиатуры под пиктограммами, адаптивная стрелка, метки свойств, общая окраска полоски и номеров функций; пояснять прямое соответствие и перестановку блоков разными текстами. | `src/components/TetrachotomyAspectFunctionPanel.tsx`, `src/diagrams/AspectFunctionDiagram.tsx`, layout/e2e tests | 106 unit tests, 32 desktop/mobile e2e, production build/preview passed; full validate blocked by dependency audit | Не переименовывать признаки аспектов «Альфа», «Бета», «Гамма», «Дельта» в названия групп типов; не приписывать блочным инвариантам фиксированные пары блоков. |
| X2.8 | X2.7 | DONE | Компактная диаграмма и горизонтальные карточки соответствий на телефоне и в узкой панели; переключение компоновки по ширине контейнера, целые слова свойств и подписи под пиктограммами. | `src/components/TetrachotomyAspectFunctionPanel.tsx`, `src/index.css`, layout/e2e tests and snapshots | 106 unit tests, 36 desktop/mobile e2e; container widths 260–640 px; production build/preview and smoke passed; validate blocked by audit HTTP 400 | Не менять порядок функций модели А, source-строки, термины свойств и смысл групповой стрелки. |
| X2.9 | X2.8 | DONE | Ограничить ширину сеток обычной диаграммы признака, адаптировать направление по ширине контейнера; закрыть пропуск отдельного renderer в X2.8. | `src/diagrams/AspectFunctionDiagram.tsx`, `src/index.css`, browser tests/snapshots | Red/green width regression; narrow and wide viewports/panels, process-cycle variant; 106 unit tests and production build/preview passed; browser suite 37 passed plus 1 font timeout passing on isolated rerun | Не менять размеры пиктограмм, порядок функций, подсветку и геометрию циклических декораторов. |
| E10.1 | - | DONE | Короткие названия полюсов «Альфа», «Бета», «Гамма», «Дельта»; отдельная справочная страница с происхождением терминов, различением групп аспектов и квадр типов, легендами и базовыми таблицами. | `src/components/ReferencePage.tsx`, `Header.tsx`, `src/App.tsx`, `src/data/socionics.ts` | Терминологический и SSR-тесты; 4 desktop/mobile e2e в обеих темах; переходы сохраняют выбранный тип; typecheck/build/smoke passed. Full validate blocked by dependency audit; полный браузерный набор содержит отдельные ошибки тетрахотомий. | Таблицы формируются из данных приложения. Ценностным аспектам соответствуют вербальные 1256, остальным — лаборные 3478; два признака аспектов не смешиваются с тетрахотомией типов. |
