# Architecture Plan

## Целевая структура

Существующий public import `../data/socionics` стоит сохранить, чтобы не переписывать UI за один шаг. Внутри доменный слой можно постепенно разделить на focused modules и реэкспортировать из `socionics.ts`.

Предлагаемая структура:

```text
src/
  data/
    socionics.ts              # public facade and existing exports
    aspects.ts                # optional split later
    functions.ts              # optional split later
    traits.ts                 # optional split later
    types.ts                  # 16 SocionicType records
    memberships.ts            # Reinin trait -> type poles
    partitions.ts             # pure partition/rank helpers
    interpretations.ts        # semantic content records
    localization.ts           # locale helpers for domain names
  diagrams/
    AspectFunctionDiagram.tsx # current formula diagram
    TypeModelDiagram.tsx      # future model A type diagram
    PartitionDiagram.tsx      # future tetrachotomy/octochotomy summary
    registry.ts
  components/
    TypeSelector.tsx
    ModeSelector.tsx
    PartitionSelector.tsx
    ThemeToggle.tsx
    LocaleToggle.tsx
    InterpretationPanel.tsx
    ...
```

Если split окажется слишком большим для первого этапа, можно создать только `types.ts`, `memberships.ts` и `partitions.ts`, а `socionics.ts` оставить facade.

## Слои

### Domain Layer

Ответственность:

- source-of-truth данные аспектов, функций, типов, признаков, memberships и interpretations;
- чистые helpers для групп, partitions и rank;
- tests на полноту, uniqueness и размеры классов.

Не делает:

- не импортирует React;
- не содержит Tailwind classes;
- не читает `window`, URL или localStorage;
- не выбирает тему или язык UI напрямую.

### Selector Layer

Ответственность:

- превращает domain records в compact view models;
- применяет locale fallback;
- объединяет formula views, model A type examples и semantic interpretations;
- возвращает diagnostic messages для dependent octochotomy triples.

Может жить в `src/data/selectors.ts` или рядом с feature modules. Это все еще pure layer.

### App State Layer

`src/App.tsx` сейчас хранит `trait`, `pole`, `view` и active cell. Его лучше расширять постепенно:

- `mode`: `trait` | `type` | `tetrachotomy` | `octochotomy`;
- `traitId`, `poleIndex`, `viewIndex`;
- `typeId`;
- `partitionTraitIds`;
- `locale`;
- `theme`;
- `activeCell`.

URL params должны оставаться стабильными и human-readable:

```text
?mode=trait&trait=democracy&pole=1&view=2
?mode=type&type=ILE
?mode=tetrachotomy&traits=democracy,process&class=democracy:0|process:1
?mode=octochotomy&traits=democracy,process,asking&class=democracy:0|process:1|asking:0
?lang=en&theme=dark
```

### Partition Explorer Layer

Дихотомии, тетрахотомии и октохотомии должны развиваться как одно UX-семейство, а не как три независимые страницы.

Canonical state для любого разбиения:

- `kind`: `dichotomy` | `tetrachotomy` | `octochotomy`;
- `traitIds`: один, два или три независимых признака;
- `selectedClassKey`: выбранный полюс/класс, по умолчанию класс, содержащий ИЛЭ;
- `entryMode`: optional UI-only hint для выбора через sidebar/list, sequential picker, catalog или visual gallery.

Разные способы выбора обязаны сходиться в один canonical state:

- дихотомия: sidebar/list или visual mini-pattern gallery;
- тетрахотомия: последовательный выбор 2 признаков, catalog готовых пар или visual pattern gallery;
- октохотомия: последовательный выбор 3 признаков, catalog независимых троек или visual pattern gallery.

Экран результата должен показывать:

- component dichotomy cards для каждого выбранного признака;
- итоговую схему распределения 16 типов;
- выбранный класс/полюс;
- типы внутри выбранного класса;
- компактные Model A previews с подсветкой того, что демонстрирует принадлежность к выбранному классу.

Type mode не должен скрыто зависеть от `trait`, `pole` или partition state. Если позже нужен путь "тип -> признаки типа", он должен иметь отдельное явное state/URL-поле, а не переиспользовать состояние режима признаков.

Future direction: решетка подгрупп/подпространств группы признаков должна опираться на эти же trait vectors и partition keys, но не блокировать ближайший Partition Explorer.

### UI Layer

Ответственность:

- controls, panels, layout, keyboard/focus behavior;
- rendering diagrams from view models;
- theme and locale toggles;
- accessibility labels.

Не делает:

- не вычисляет membership классы;
- не проверяет rank trait vectors;
- не содержит hardcoded domain truth tables кроме temporary labels during migration.

### Diagram Layer

Существующий registry подходит для расширения. Нужно отделить тип диаграммы от режима приложения:

- `aspect-function`: текущая формула invariant mappings;
- `type-model-a`: модель А конкретного типа;
- `partition-grid`: классы тетрахотомии или октохотомии.

Диаграммы получают props от selectors и могут использовать shared interaction state. Новые диаграммы не должны переписывать текущую, пока не появится доменная база.

### Theme Layer

Текущие цвета зашиты Tailwind-классами. Темную тему лучше вводить через design tokens:

- CSS variables для background, panel, border, text, muted, accent, danger, focus;
- Tailwind classes через arbitrary values или semantic utility classes;
- persisted preference: explicit URL param wins over localStorage, localStorage wins over system preference.

Риск: текущий UI много использует hardcoded `slate`, `indigo`, `white`. Тема должна идти отдельными small passes, а не одним большим rewrite.

### Localization Layer

Нужны две группы строк:

- UI strings: headers, buttons, tooltips, mode labels, diagnostic messages.
- Domain strings: names of aspects, functions, traits, poles, types, interpretations.

Locale adapter должен давать Russian fallback, чтобы неполный английский каталог не ломал приложение. Миграцию лучше вести по компонентам.

## Проверки

Минимальный baseline для каждого implementation task:

- focused unit tests для измененного domain helper;
- `npm test`;
- `npm run lint`;
- `npm run build` для UI changes;
- `npm run smoke:render` для changes, затрагивающих default render;
- `npm run test:e2e` для navigation, theme, locale, type/partition views;
- `npm run validate` перед завершением milestone.

## Риски архитектуры

- Один большой `socionics.ts` может стать неподдерживаемым. Mitigation: сохранить facade, но выносить новые данные в отдельные files.
- Локализация может смешаться с logic. Mitigation: IDs в logic, strings через adapters.
- Тетрахотомии и октохотомии можно ошибочно посчитать простым UI-фильтром. Mitigation: pure partition helpers и unit tests с expected class sizes.
- Темная тема может превратиться в ручную замену классов. Mitigation: tokens first, component migration second.
- Значки аспектов могут ухудшить доступность. Mitigation: text fallback, `aria-label`, tooltip with full name.
