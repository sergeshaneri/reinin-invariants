# Decision Log

Этот файл фиксирует спорные или архитектурно значимые решения по roadmap. Новые агенты должны читать его перед доменными задачами и добавлять записи, когда принимают решение, которое влияет на данные, API, локализацию, отображение или порядок реализации.

## Формат записи

```md
## DEC-000: Короткое название

- Status: Proposed | Accepted | Superseded | Rejected
- Date: YYYY-MM-DD
- Owner: agent/user/name
- Related tasks: D1.1, O4.1

### Context

Почему решение нужно.

### Decision

Что принято.

### Consequences

Что это упрощает, какие риски создает, что нужно проверить.
```

## DEC-001: Domain IDs are locale-free

- Status: Accepted
- Date: 2026-06-12
- Owner: roadmap
- Related tasks: D1.1, D1.3, L7.1, L7.3

### Context

Приложение должно поддерживать русский и английский интерфейс, но доменные вычисления не должны зависеть от видимых строк.

### Decision

Все вычисления используют стабильные IDs: `AspectId`, function IDs, `ReininTrait.id`, future `SocionicTypeId`, partition keys and interpretation targets. Русские и английские имена читаются через locale adapter или catalogs.

### Consequences

Локализация не должна менять URL-состояние, membership, partitions или test fixtures. Любая новая domain entity должна иметь стабильный ID до добавления переводов.

## DEC-002: Keep `src/data/socionics.ts` as the public facade during migration

- Status: Accepted
- Date: 2026-06-12
- Owner: roadmap
- Related tasks: D1.1, D1.2, D1.3, D1.8

### Context

Сейчас `src/data/socionics.ts` является источником истины и импортируется UI-компонентами. Большой одномоментный split повысит риск regressions.

### Decision

Новые доменные файлы можно добавлять рядом с `socionics.ts`, но существующие public exports сохраняются через facade. UI migration идет постепенно.

### Consequences

Ранние задачи должны быть маленькими: добавить типы, memberships, partitions и selectors без переписывания текущих diagram/components. Split старых структур допустим только после покрытия тестами.

## DEC-003: Partitions are computed from binary trait vectors

- Status: Accepted
- Date: 2026-06-12
- Owner: roadmap
- Related tasks: D1.4, D1.5, D1.6, T3.1, O4.1

### Context

Тетрахотомии и октохотомии должны быть проверяемыми, а не вручную нарисованными UI-группами.

### Decision

Каждый признак Рейнина получает бинарный вектор длиной 16 по стабильному порядку типов. Тетрахотомии и октохотомии строятся пересечением выбранных trait vectors. Независимость тройки проверяется rank over GF(2).

### Consequences

Все partition features требуют тестов на размеры классов. Зависимые triples должны возвращать diagnostic, а не неполное или ложное разбиение.

## DEC-004: Semantic interpretations are content, not logic

- Status: Accepted
- Date: 2026-06-12
- Owner: roadmap
- Related tasks: S8.1, S8.2, S8.3, S8.4

### Context

Семантические интерпретации могут быть спорными и меняться чаще, чем доменные инварианты.

### Decision

Интерпретации хранятся отдельными records, ссылаются на domain targets и имеют status. Они не определяют membership, vectors, rank или formula mappings.

### Consequences

Отсутствие интерпретации не должно ломать UI. Tests проверяют ссылочную целостность, locale, status и стабильность targets.

## DEC-005: Theme is implemented through tokens before component-wide restyling

- Status: Proposed
- Date: 2026-06-12
- Owner: roadmap
- Related tasks: H6.1, H6.2, H6.3, H6.4

### Context

Текущий UI содержит много hardcoded Tailwind colors. Ручная замена классов во всех компонентах за один проход рискованна.

### Decision

Сначала добавить theme state and CSS/design tokens. Затем переносить shell components, diagrams and formula panels небольшими задачами.

### Consequences

Dark theme нельзя считать готовой до проверки contrast, focus states, group colors and e2e screenshots in light/dark modes.

## DEC-006: English localization uses Russian fallback until coverage is complete

- Status: Proposed
- Date: 2026-06-12
- Owner: roadmap
- Related tasks: L7.1, L7.2, L7.3, L7.4, L7.5

### Context

Полная терминологическая ревизия английских names может занять несколько итераций.

### Decision

Locale helper возвращает английскую строку, если она есть; иначе русскую fallback string. Tests должны явно проверять, какие domain strings обязаны иметь английскую версию к конкретному milestone.

### Consequences

Partial localization допустима только в ранних задачах. Перед user-facing release английская версия должна пройти checklist покрытия строк.

## DEC-007: Hadamard-ordered domain tables are ground truth

- Status: Accepted
- Date: 2026-06-14
- Owner: user
- Related tasks: D1.1, D1.2, D1.3, D1.4, Q9.4

### Context

Типы, признаки социона, аспектон и функцион должны сохранять порядок из пользовательских ground-truth таблиц. Порядок строк и столбцов не является косметическим: он отражает матрицу Адамара H3 и нужен для будущих бинарных векторов, partitions и объяснений теории.

### Decision

`SOCIONIC_TYPE_ORDER` фиксируется как `ILE, SEI, ESE, LII, EIE, LSI, SLE, IEI, LIE, ESI, SEE, ILI, IEE, SLI, LSE, EII`. Membership-списки внутри полюсов хранятся как подмножества этого порядка. Model A хранится по `functionId` 1..8 из ground-truth таблицы. Аспектон и функцион используют текущие H3-признаки как вычислительную основу; пользовательское объяснение этого порядка не выводится на главную без отдельной UI/content-задачи.

### Consequences

Любой будущий helper для trait vectors должен использовать `SOCIONIC_TYPE_ORDER` напрямую. Если порядок в таблицах меняется, это доменное решение, а не refactor. Нужно добавить отдельную задачу на объяснение H3-порядка в справке или документации, чтобы не перегружать первый экран.

## DEC-008: Partition Explorer owns dichotomy, tetrachotomy and octochotomy UX

- Status: Accepted
- Date: 2026-06-15
- Owner: user
- Related tasks: X2.1, X2.2, X2.3, X2.4, D3.1, D3.4, C4.1, C4.6, G4L.1

### Context

The previous plan made type mode depend on the currently selected trait, so a user looking at types had to know about hidden trait state. The desired UX separates the type path from the partition paths. For partitions, the user can choose structures through a sidebar/list, visual mini-schemes, sequential trait selection, or a catalog of ready tetra/octo combinations.

### Decision

Type mode must remain a type-centered path and must not implicitly depend on `trait`, `pole`, or partition state. Dichotomies, tetrachotomies and octochotomies are handled by a shared Partition Explorer model:

- dichotomy = 1 component trait, 2 classes of 8 types;
- tetrachotomy = 2 component traits, 4 classes of 4 types;
- octochotomy = 3 independent component traits, 8 classes of 2 types.

Tetra/octo screens should show how the final invariant is composed from component dichotomies. The selected class defaults to the class containing ИЛЭ. A future lattice view may show subgroup/subspace inclusions over the same trait-vector basis.

### Consequences

The next implementation step is X2.1, not the old U2.6. U2.5 remains a completed technical experiment but is superseded as UX direction. New partition UI work must converge all entry methods into one canonical state and avoid separate hidden states per chooser.
