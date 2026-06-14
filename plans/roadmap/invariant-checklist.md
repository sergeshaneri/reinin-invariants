# Domain Invariant Test Checklist

Этот файл не является тестом. Это список обязательных доменных проверок, которые должны быть реализованы в unit tests по мере добавления новых сущностей.

## Existing Baseline

Already covered by current tests:

- `ASPECTS` have unique IDs.
- `FUNCTIONS` have unique IDs.
- `MODEL_A_LAYOUT` matches registered function IDs.
- Each `ReininTrait` has exactly two poles.
- Every pole has at least one view.
- Every view has at least one mapping.
- Mappings reference registered aspect and function IDs.
- A view does not repeat an aspect or function.
- Default and referenced diagrams are registered.
- Referenced decorators are registered.
- Diagram interaction helpers preserve hover/pin behavior.

## Aspect Data

Required before completing aspect visual tasks:

- Every `AspectId` has exactly one `Aspect`.
- Every aspect has complete feature values for all `AspectFeatureKey`s.
- Every aspect has Russian display name and full name.
- Every aspect has English display name and full name before English release.
- Every aspect visual metadata record references an existing `AspectId`.
- Every aspect visual metadata record has a stable `iconKey`.
- UI icon registry covers every `iconKey`.
- Icon rendering keeps accessible label with full aspect name.

## Function Data

Required before model A expansion:

- Every function ID is integer 1 through 8.
- Every function has complete feature values for all `FunctionFeatureKey`s.
- Every function has Russian display name.
- Every function has English display name before English release.
- Function order in `MODEL_A_LAYOUT` is stable and documented.

## Socionic Types

Required for D1.1 and D1.2:

- Exactly 16 `SocionicType` records exist.
- Every `SocionicTypeId` is unique.
- Every type has Russian name.
- Every type has English name before English release.
- Every type has exactly 8 model A assignments.
- Every model A assignment references a registered function.
- Every model A assignment references a registered aspect.
- Each type uses every function exactly once.
- Each type uses every aspect exactly once.
- No two assignments in one type share the same function or aspect.
- Type order used for vectors is explicit and tested.

## Trait Membership

Required for D1.3:

- Every `ReininTrait` has one type-membership record.
- Every membership record references an existing trait ID.
- Every membership record has exactly two poles.
- Pole indexes are only `0` and `1`.
- Each pole contains exactly 8 type IDs.
- Every type ID in membership exists.
- No type repeats inside one trait membership.
- The union of both poles equals the full set of 16 types.
- Membership pole order matches `trait.poles`.
- If a trait name or pole name is localized, membership stays unchanged.

## Trait Vectors

Required for D1.4:

- Every trait vector has length 16.
- Vector position order equals the tested canonical type order.
- Vector values are only `0` or `1`.
- Vector value maps back to the expected pole membership.
- Vector generation is deterministic.
- Unknown trait IDs are impossible by type or return a controlled diagnostic.

## Partitions

Required for D1.5 through O4.4:

- One trait produces 2 classes.
- Each dichotomy class contains 8 types.
- Two different traits produce 4 classes.
- Each tetrachotomy class contains 4 types.
- Three independent traits produce 8 classes.
- Each octochotomy class contains 2 types.
- Duplicate trait selections are rejected.
- Unknown trait selections are rejected or impossible by type.
- Dependent triples are rejected with diagnostic, not rendered as octochotomy.
- Partition class keys are stable and order-independent where intended.
- Partition class labels preserve selected trait/pole IDs.
- Every type appears exactly once in a valid partition result.

## GF(2) Rank

Required before accepting octochotomy logic:

- Rank of one non-empty trait vector is 1.
- Rank of two different valid trait vectors is expected to be 2 unless a domain exception is recorded.
- Rank of valid independent triples is 3.
- Known dependent triple fixtures return rank below 3.
- Rank helper does not mutate input vectors.
- Rank helper behavior is deterministic for permuted input order.

## Selectors

Required for D1.8 and UI phases:

- Selectors return domain IDs plus localized labels, not labels only.
- Selectors use Russian fallback when English is missing.
- Selectors do not mutate domain source records.
- Type model selector returns 8 assignments in `MODEL_A_LAYOUT` order.
- Trait example selector returns the selected type's pole for the selected trait.
- Tetrachotomy selector returns 4 classes with class labels and type IDs.
- Octochotomy selector returns 8 classes or a diagnostic.
- Interpretation selector returns only records matching target and locale/fallback policy.

## Localization

Required before English release:

- Locale values are limited to supported locales.
- URL `lang` values outside supported locales fall back predictably.
- UI catalogs cover all visible static strings for the release scope.
- Domain labels have English coverage for aspects, functions, traits, poles and types.
- Missing English strings are either allowed by explicit test fixture or fail the release checklist.
- Switching locale does not change selected trait, pole, view, type or partition IDs.
- Russian strings preserve encoding.

## Theme

Required before dark theme release:

- Theme values are limited to supported themes.
- URL theme overrides localStorage.
- localStorage overrides system preference only when explicit.
- SSR/render smoke works without `window`.
- Every theme exposes tokens for background, panel, border, text, muted text, accent, focus and danger.
- Core controls have visible focus state in light and dark themes.
- Diagram group colors remain distinguishable in light and dark themes.
- Formula panel remains readable in light and dark themes.

## Semantic Interpretations

Required for S8.*:

- Every interpretation target references existing domain IDs.
- `partitionClass` interpretations use stable class keys.
- Locale is valid.
- Status is valid.
- Missing interpretation returns an empty state, not an exception.
- Interpretation records do not alter membership or partition results.
- Draft content is not shown in release views unless explicitly allowed.

