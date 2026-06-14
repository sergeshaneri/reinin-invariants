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
?mode=type&type=ILE&trait=democracy
?mode=tetra&traits=democracy,process
?mode=octo&traits=democracy,process,asking
?lang=en&theme=dark
```

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

