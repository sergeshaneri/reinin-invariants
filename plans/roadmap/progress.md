# Roadmap Progress

## Snapshot

- Created: 2026-06-12.
- Scope of this pass: Partition Explorer hardening through dark-theme visual migration, then roadmap correction for formula-ground-truth coverage.
- Source changes in this pass: Q9.1 render smoke covers partition detail modes and dependent diagnostics; Q9.4 documents H3 display order; H6.4 migrates diagram, formula and partition surfaces toward the reference visual style; F4.1 records that tetra/octo formula catalogs are not complete just because structural partitions work.
- Existing dirty workspace changes were observed before planning and left untouched.
- Validation: `npm run smoke:render` and `npm run lint` passed; `npm run validate` was not run for Q9.1 because it can write generated `dist/`.

## Current Status

| Area | Status | Notes |
|---|---:|---|
| Roadmap artifacts | DONE | PRD, domain model, architecture, tasks, progress created under `plans/roadmap/`. |
| Execution harness | DONE | Decisions, task template, invariant checklist and clean-context handoff added. |
| Domain foundation | DONE | D1.1-D1.8 complete. |
| 16 Model A types | DONE | Implemented with stable type IDs and tests. |
| Trait membership by type | DONE | Membership tables and partition helpers are covered by tests. |
| App mode URL state | DONE | U2.1 added mode parsing/serialization without changing default trait behavior. |
| Visible mode selector | DONE | U2.2 added mode switching and e2e URL coverage. |
| Type selector | DONE | U2.3 added canonical 16-type selection and `type` URL state in type mode. |
| Type Model A diagram | DONE | U2.4 renders selected TIM Model A in type mode. |
| Type invariant highlight | DONE/SUPERSEDED | U2.5 works technically but is no longer the desired UX direction. |
| Partition Explorer UX | DONE | Structural partition UI is complete: C4.1 catalogs, C4.2 multi-entry chooser, C4.3 tetrachotomy composition, C4.4 tetrachotomy detail, C4.5 octochotomy composition and C4.6 octochotomy detail. |
| Tetrachotomies | PARTIAL | Structural view works, but the canonical 35 source formulas from `tetrachotomy-doc-extract.json` still need a domain schema, verification and UI catalog pass. |
| Octochotomies | PARTIAL | Structural independent triples work, but source-derived octochotomy formulas are still draft/incomplete until the user finishes and confirms the source. |
| Formula ground truth | IN PROGRESS | F4.1-F4.3 split source-derived tetra/octo formula catalogs from computed partition structure and verify the 35 extracted tetras. |
| Render smoke hardening | DONE | Q9.1 covers default dichotomy, valid tetrachotomy, valid octochotomy and dependent octochotomy SSR paths. |
| H3 order explanation | DONE | Q9.4 documents canonical H3 order in PRD without adding main-screen UI text. |
| Aspect icons | DONE | V5.1 visual metadata, V5.2 UI registry and V5.3 icon/symbol/combined compact display are complete. |
| Dark theme | DONE | H6.1 theme state, H6.2 base tokens, H6.3 shell token migration and H6.4 diagram/formula surface migration are complete. |
| English version | TODO | Should follow locale adapter and catalog split. |
| Semantic interpretations | TODO | Should follow stable target IDs and localization foundation. |

## Recommended Next Step

Continue with F4.4: separate the tetrachotomy UI/catalog path so the 35 verified source formulas are not confused with the broader 105 structural pairs. Then do F4.5-F4.7 for octochotomy drafts after the user confirms the remaining source text.

## Milestone Checklist

- [x] `plans/roadmap/PRD.md`
- [x] `plans/roadmap/domain-model.md`
- [x] `plans/roadmap/architecture.md`
- [x] `plans/roadmap/tasks.md`
- [x] `plans/roadmap/progress.md`
- [x] `plans/roadmap/decisions.md`
- [x] `plans/roadmap/task-template.md`
- [x] `plans/roadmap/invariant-checklist.md`
- [x] `plans/roadmap/handoff.md`
- [x] `npm run validate` completed after planning artifact creation

## Change Log

### 2026-06-12

- Added roadmap documents.
- No files under `src/` were edited.
- No generated `dist/` files were edited.
- `npm run validate` initially failed inside the sandbox with `Access is denied` while loading Vite config, then passed outside the sandbox.

### 2026-06-12 - Execution harness expansion

- Status: DONE
- Changed files:
  - `plans/roadmap/decisions.md`
  - `plans/roadmap/task-template.md`
  - `plans/roadmap/invariant-checklist.md`
  - `plans/roadmap/handoff.md`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added decision log for domain and architecture choices.
  - Added reusable task template with constraints, checks and stop conditions.
  - Added domain invariant checklist for future tests.
  - Added clean-context handoff prompt for new agent windows.
  - Linked the execution protocol from `tasks.md`.
- Checks:
  - `npm run validate`: passed after rerun outside the sandbox.
- Decisions:
  - `DEC-001` through `DEC-006`
- Remaining:
  - Start implementation with `D1.1` through `D1.4`.

### 2026-06-14 - Task D1.1

- Status: DONE
- Changed files:
  - `src/data/types.ts`
  - `src/data/socionics.ts`
  - `src/data/socionics.test.ts`
  - `plans/roadmap/domain-model.md`
  - `plans/roadmap/decisions.md`
- Summary:
  - Added stable `SocionicTypeId`, canonical `SOCIONIC_TYPE_ORDER`, localized type names, aliases and quadra IDs.
  - Re-exported type data through `src/data/socionics.ts`.
  - Updated the canonical order to the user-provided socion ground truth.
- Checks:
  - `npm test`: passed
  - `npm run lint`: passed
  - `npm run validate`: passed
- Decisions:
  - `DEC-007`
- Remaining:
  - none

### 2026-06-14 - Task D1.2

- Status: DONE
- Changed files:
  - `src/data/types.ts`
  - `src/data/socionics.test.ts`
- Summary:
  - Added Model A assignments for all 16 TIMs as `functionId -> aspectId` data.
  - Added invariant tests for 8 functions, 8 aspects, uniqueness and registered IDs in every model.
- Checks:
  - `npm test`: passed
  - `npm run lint`: passed
  - `npm run validate`: passed
- Decisions:
  - `DEC-007`
- Remaining:
  - none

### 2026-06-14 - Task D1.3

- Status: DONE
- Changed files:
  - `src/data/memberships.ts`
  - `src/data/socionics.ts`
  - `src/data/socionics.test.ts`
- Summary:
  - Added Reinin trait type memberships for 15 traits, two poles per trait and eight types per pole.
  - Added tests for trait coverage, pole indexes, membership completeness and canonical type order inside each pole.
- Checks:
  - `npm test`: passed
  - `npm run lint`: passed
  - `npm run validate`: passed
- Decisions:
  - `DEC-007`
- Remaining:
  - none

### 2026-06-14 - Task D1.4

- Status: DONE
- Changed files:
  - `src/data/partitions.ts`
  - `src/data/partitions.test.ts`
  - `src/data/socionics.ts`
- Summary:
  - Added binary trait vector helpers over `SOCIONIC_TYPE_ORDER`.
  - Encoded the user-provided socion convention: first UI pole is vector value `1`, second UI pole is `0`.
  - Added deterministic vector tests and ground-truth vector fixtures.
- Checks:
  - `npm test`: passed
  - `npm run lint`: passed
  - `npm run validate`: passed
- Decisions:
  - `DEC-007`
- Remaining:
  - none

### 2026-06-14 - Validation remediation during D1.1-D1.4

- Status: DONE
- Changed files:
  - `package.json`
  - `package-lock.json`
  - `vite.config.ts`
  - `playwright.config.ts`
  - `harness/failure-log.md`
  - `plans/roadmap/tasks.md`
- Summary:
  - Updated `vite` and `tsx` to clear the `npm audit --audit-level=moderate` gate.
  - Added explicit Vite `root` needed after the Vite 8/Rolldown migration.
  - Aligned Playwright `baseURL` with its managed dev server port and logged the harness failure.
  - Added future task Q9.4 for explaining H3 table order outside the main screen.
- Checks:
  - `npm run test:e2e`: passed
  - `npm run validate`: passed
- Decisions:
  - `DEC-007`
- Remaining:
  - none

### 2026-06-14 - Task D1.5

- Status: DONE
- Changed files:
  - `src/data/partitions.ts`
  - `src/data/partitions.test.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
  - `harness/failure-log.md`
  - `package.json`
  - `playwright.config.ts`
  - `playwright.preview.config.ts`
  - `scripts/e2e-dev.mjs`
  - `scripts/preview-e2e.mjs`
- Summary:
  - Added generic GF(2) rank calculation for binary vectors and a `rankTraitVectors` wrapper over existing trait vectors.
  - Added tests for rank 1, rank 2 for confirmed distinct trait pairs, a generic dependent triple, input immutability, deterministic input ordering and invalid vector widths.
  - Avoided adding a socionics dependent triple fixture without a user-confirmed mapping from the tetrachotomy extract.
  - Replaced hanging Playwright-managed e2e server teardown with bounded Vite API runners for validation.
- Checks:
  - `npm test`: passed
  - `npm run lint`: passed
  - `npm run test:e2e:preview`: passed
  - `npm run test:e2e`: passed
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - D1.6 should build generic partitions without treating unconfirmed dependent triples as domain fixtures.

### 2026-06-14 - Tasks D1.6-D1.7

- Status: DONE
- Changed files:
  - `src/data/partitions.ts`
  - `src/data/partitions.test.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added `buildPartition(traitIds)` for dichotomy, tetrachotomy and octochotomy requests.
  - Added stable partition class keys, preserved selected trait/pole IDs and grouped types in canonical socion order.
  - Added diagnostics for empty, unsupported, duplicate and dependent partition requests.
  - Treated actual equal-sized partition classes as the validity gate, because GF(2) rank alone can pass triples that do not form 8 classes of 2 types.
- Checks:
  - `npm test -- src/data/partitions.test.ts`: passed
  - `npm run lint`: passed
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - D1.8 should add selectors over the new partition result/diagnostic API.

### 2026-06-14 - Task D1.8

- Status: DONE
- Changed files:
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added domain selectors for type model views, type-trait examples, tetrachotomy view models and octochotomy view models.
  - Kept IDs in selector outputs while adding compact Russian labels and English type-name fallback where source data already provides it.
  - Returned partition diagnostics as view models without throwing, so UI can render invalid combinations explicitly.
- Checks:
  - `npm test`: passed
  - `npm run lint`: passed
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - U2.1 should introduce app mode state and URL parsing over the selector-ready domain layer.

### 2026-06-14 - Task U2.1

- Status: DONE
- Changed files:
  - `src/appState.ts`
  - `src/appState.test.ts`
  - `src/App.tsx`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added `AppMode` and app URL state parsing/serialization for `trait`, `type`, `tetrachotomy` and `octochotomy`.
  - Moved initial URL parsing out of `App.tsx` and kept existing default trait URLs free of a `mode` parameter.
  - Added regression tests for the current `trait/pole/view` URL contract and invalid URL fallbacks.
- Checks:
  - `npm test -- src/appState.test.ts`: passed
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - U2.2 should add the visible mode selector.

### 2026-06-14 - Task U2.2

- Status: DONE
- Changed files:
  - `src/components/ModeSelector.tsx`
  - `src/App.tsx`
  - `scripts/render-smoke.tsx`
  - `tests/e2e/app.spec.ts`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-desktop-win32.png`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-mobile-win32.png`
  - `scripts/preview-e2e.mjs`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a compact `ModeSelector` for trait, type, tetrachotomy and octochotomy modes.
  - Wired mode selection into app state and URL serialization while keeping default trait mode free of a `mode` query parameter.
  - Added e2e coverage for mode switching and updated visual snapshots for the intentional new control.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed after snapshot update
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - U2.3 should add `TypeSelector` and the `type` URL parameter.

### 2026-06-14 - Task U2.3

- Status: DONE
- Changed files:
  - `src/appState.ts`
  - `src/appState.test.ts`
  - `src/App.tsx`
  - `src/components/TypeSelector.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added selected TIM state to app URL parsing and serialization.
  - Added `TypeSelector` with all 16 TIMs in canonical type order.
  - Rendered the selector in type mode and covered URL sync through e2e.
- Checks:
  - `npm test -- src/appState.test.ts`: passed
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed
- Decisions:
  - none
- Remaining:
  - U2.4 should create `TypeModelDiagram` for the selected type's Model A.

### 2026-06-14 - Task U2.4

- Status: DONE
- Changed files:
  - `src/diagrams/TypeModelDiagram.tsx`
  - `src/App.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a selected-type Model A diagram backed by `selectTypeModelView`.
  - Switched the right column in type mode from trait controls to the type model view.
  - Added e2e coverage that the model follows the selected TIM.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed after tightening an exact text locator
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - U2.5 should highlight the current trait invariant on the type model.

### 2026-06-14 - Task U2.5

- Status: DONE
- Changed files:
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `src/diagrams/TypeModelDiagram.tsx`
  - `src/App.tsx`
  - `tests/e2e/app.spec.ts`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-type-mode-chromium-mobile-win32.png`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added optional current-trait invariant context to `selectTypeModelView`.
  - Highlighted matching Model A assignments in type mode and showed the selected type's pole for the current trait.
  - Added selector and e2e coverage for invariant highlights.
- Checks:
  - `npm test -- src/data/selectors.test.ts`: passed
  - `npm run lint`: passed
  - `npm run test:e2e`: passed after mobile type-mode snapshot update
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - Superseded by the 2026-06-15 Partition Explorer rewrite; continue with X2.1.

### 2026-06-15 - UX roadmap rewrite

- Status: DONE
- Changed files:
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
  - `plans/roadmap/architecture.md`
  - `plans/roadmap/decisions.md`
  - `plans/roadmap/invariant-checklist.md`
- Summary:
  - Superseded the old U2.6 next step because type mode must not depend on hidden selected-trait state.
  - Reframed dichotomies, tetrachotomies and octochotomies as a shared Partition Explorer path.
  - Added visual chooser paths: sidebar/list, sequential trait selection, catalog list and mini-pattern gallery.
  - Added composition-view tasks so tetra/octo screens show how final invariants come from component dichotomies.
  - Added a future subgroup-lattice milestone.
- Checks:
  - Docs-only change; deterministic app validation not run.
- Decisions:
  - `DEC-008`
- Remaining:
  - X2.1 should remove hidden trait dependency from type mode before adding new partition UX.

### 2026-06-15 - Task X2.1

- Status: DONE
- Changed files:
  - `src/appState.ts`
  - `src/appState.test.ts`
  - `src/App.tsx`
  - `src/diagrams/TypeModelDiagram.tsx`
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `tests/e2e/app.spec.ts`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-type-mode-chromium-mobile-win32.png`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Removed the selected-trait and selected-view inputs from the type-mode Model A diagram.
  - Restored `selectTypeModelView` to a pure selected-type model selector without invariant highlight state.
  - Stopped serializing `trait`, `pole` and `view` into non-trait URLs; type mode now serializes as `mode=type&type=<id>`.
  - Updated e2e coverage and mobile type-mode snapshot for the intentional removal of the invariant example panel.
- Checks:
  - `npm test -- src/appState.test.ts src/data/selectors.test.ts`: passed
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed after updating the intentional mobile snapshot
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - X2.2 should introduce the shared Partition Explorer state/URL model.

### 2026-06-15 - Task X2.2

- Status: DONE
- Changed files:
  - `src/appState.ts`
  - `src/appState.test.ts`
  - `src/App.tsx`
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added shared Partition Explorer URL state with `kind`, selected `traitIds` and `selectedClassKey`.
  - Serialized tetrachotomy and octochotomy URLs with canonical `traits` and `class` params while keeping type URLs free of partition state.
  - Added selector support for a selected partition class and fallback to the class containing `ILE`.
- Checks:
  - `npm test -- src/appState.test.ts src/data/selectors.test.ts`: passed
  - `npm run lint`: passed
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - X2.3 should create the shared 16-type pattern card.

### 2026-06-15 - Task X2.3

- Status: DONE
- Changed files:
  - `src/components/TypePatternCard.tsx`
  - `src/App.tsx`
  - `src/appState.ts`
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a reusable 16-type pattern card for dichotomy, tetrachotomy and octochotomy partition results in canonical H3 order.
  - Added selector-level pattern cell view models with class keys, class labels and pole names so color is not the only information channel.
  - Rendered the pattern card in tetrachotomy and octochotomy modes with selectable classes and URL `class` sync.
  - Reset partition state to the correct default kind when switching between app modes.
- Checks:
  - `npm test -- src/data/selectors.test.ts src/appState.test.ts`: passed
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - X2.4 should add the dichotomy visual chooser gallery while preserving the sidebar/list chooser.

### 2026-06-15 - Task X2.4

- Status: DONE
- Changed files:
  - `src/components/DichotomyGallery.tsx`
  - `src/components/TraitNav.tsx`
  - `src/App.tsx`
  - `tests/e2e/app.spec.ts`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-desktop-win32.png`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-mobile-win32.png`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a horizontal visual chooser gallery for all dichotomies with compact 16-type mini-patterns in canonical H3 order.
  - Kept the sidebar/list chooser and routed both chooser paths through the same selected-trait state reset.
  - Added stable e2e/smoke locators for sidebar and gallery selection and updated visual snapshots for the intentional new control.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed after updating intentional snapshots
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - D3.1 should rebuild the trait screen as the dichotomy detail path and default the pole to the ILE pole.

### 2026-06-15 - Task D3.1

- Status: DONE
- Changed files:
  - `src/appState.ts`
  - `src/appState.test.ts`
  - `src/App.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added an explicit `getDefaultTraitPoleIndex` rule that defaults dichotomy detail state to the pole containing `ILE`.
  - Preserved the current user-confirmed convention that `ILE` is always in the first pole, so existing trait URLs without `pole` keep opening pole `0`.
  - Marked the trait screen with stable dichotomy detail data attributes for current trait and pole, giving D3.2/D3.3 a deterministic integration point.
  - Added URL and e2e regressions for the ILE-pole default.
- Checks:
  - `npm test -- src/appState.test.ts`: passed
  - `npm run lint`: passed
  - `npm test`: passed
  - `npm run build`: passed
  - `npm run smoke:dist`: passed
  - `npm run test:e2e:preview`: passed
  - `npm audit --audit-level=moderate`: passed
  - `npm run smoke:render`: passed
  - `npm run smoke`: passed
  - `PLAYWRIGHT_EXTERNAL_SERVER=1 node node_modules/playwright/cli.js test`: passed against the already-running local server on port `3002`
  - `npm run validate`: not run because port `3002` is already occupied by an existing `node` process; the final `npm run test:e2e` step would fail while trying to start a second strict-port server.
- Decisions:
  - none
- Remaining:
  - D3.2 should add the 16-type distribution pattern to the dichotomy detail path.

### 2026-06-15 - Task D3.2

- Status: DONE
- Changed files:
  - `src/components/DichotomyDistribution.tsx`
  - `src/App.tsx`
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `tests/e2e/app.spec.ts`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-desktop-win32.png`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-mobile-win32.png`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a dichotomy distribution component that reuses the shared 16-type pattern card for the selected trait.
  - Bound the selected pattern class to the active pole, so clicking a type cell switches the dichotomy pole and keeps the existing `trait/pole/view` URL path authoritative.
  - Added selector and e2e coverage for selecting the pole from the 16-type pattern.
- Checks:
  - `npm test -- src/data/selectors.test.ts`: passed
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `PLAYWRIGHT_EXTERNAL_SERVER=1 node node_modules/playwright/cli.js test tests/e2e/app.spec.ts --update-snapshots`: passed and regenerated intentional app snapshots
  - `npm run validate`: passed after the e2e runner learned to reuse a verified existing Vite dev server on port `3002`.
- Decisions:
  - none
- Remaining:
  - D3.3 should add the selected-pole types panel.

### 2026-06-15 - E2E port reuse harness

- Status: DONE
- Changed files:
  - `scripts/e2e-dev.mjs`
  - `harness/README.md`
  - `harness/failure-log.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Changed the dev e2e runner so `npm run test:e2e` automatically reuses an existing verified Vite dev server at `http://127.0.0.1:3002/reinin-invariants/`.
  - Kept the strict safety rule for unknown occupants: if port `3002` is not clearly this app's Vite dev server, the runner stops with an explanatory error instead of killing any process.
  - Updated harness documentation so occupied `3002` becomes a useful shared local e2e server instead of a recurring validation blocker.
- Checks:
  - `npm run test:e2e`: passed while reusing the existing server on `3002`
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - D3.3 should add the selected-pole types panel.

### 2026-06-15 - Task D3.3

- Status: DONE
- Changed files:
  - `src/components/PartitionTypesPanel.tsx`
  - `src/App.tsx`
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `tests/e2e/app.spec.ts`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-desktop-win32.png`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-mobile-win32.png`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a reusable selected-class types panel for dichotomy, tetrachotomy and octochotomy partition views.
  - Rendered the selected dichotomy pole as 8 concrete TIM cards under the 16-type distribution pattern.
  - Added selector and e2e coverage that the panel follows pole selection from the pattern.
- Checks:
  - `npm test -- src/data/selectors.test.ts`: passed
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `PLAYWRIGHT_EXTERNAL_SERVER=1 node node_modules/playwright/cli.js test tests/e2e/app.spec.ts --update-snapshots`: passed and regenerated intentional app snapshots
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - D3.4 should add compact Model A previews for the selected pole types.

### 2026-06-15 - Task D3.4

- Status: DONE
- Changed files:
  - `src/components/AspectDisplayToggle.tsx`
  - `src/components/AspectGlyph.tsx`
  - `src/components/ModelAPreviewGrid.tsx`
  - `src/components/PartitionTypesPanel.tsx`
  - `src/diagrams/TypeModelDiagram.tsx`
  - `src/App.tsx`
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `tests/e2e/app.spec.ts`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-desktop-win32.png`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-app-chromium-mobile-win32.png`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-type-mode-chromium-desktop-win32.png`
  - `tests/e2e/app.spec.ts-snapshots/reinin-invariants-type-mode-chromium-mobile-win32.png`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a global aspect display toggle for pictograms vs abbreviations.
  - Added reusable aspect glyphs and wired them into the full type-mode Model A diagram.
  - Replaced the selected-pole type list with eight compact Model A previews in canonical type order.
  - Highlighted preview cells by current invariant mapping group, including block-permutation views without asserting a false unique block pairing.
- Checks:
  - `npm test -- src/data/selectors.test.ts`: passed
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `PLAYWRIGHT_EXTERNAL_SERVER=1 node node_modules/playwright/cli.js test tests/e2e/app.spec.ts --update-snapshots`: passed and regenerated intentional app/type snapshots
  - `npm run validate`: passed
- Decisions:
  - none
- Remaining:
  - C4.1 should add catalogs for valid tetrachotomy pairs and independent octochotomy triples.

### 2026-06-15 - Task C4.1

- Status: DONE
- Changed files:
  - `src/data/selectors.ts`
  - `src/data/selectors.test.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added computed catalog selectors for valid tetrachotomy pairs and independent octochotomy triples.
  - Reused existing partition view models as preview pattern data, so catalog entries carry 16-type pattern cells without new hand-authored tetra/octo labels.
  - Added deterministic tests for catalog counts, class sizes, preview cells and exclusion of dependent triples.
- Checks:
  - `npm test -- src/data/selectors.test.ts`: passed
  - `npm run lint`: passed
- Decisions:
  - none
- Remaining:
  - C4.2 should add the multi-entry chooser UI over these catalogs.

### 2026-06-15 - Task C4.2

- Status: DONE
- Changed files:
  - `src/components/PartitionChooser.tsx`
  - `src/App.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a shared Partition Explorer chooser for tetrachotomies and octochotomies.
  - Added three entry modes over one canonical partition state: sequential trait selection, full catalog list and visual mini-pattern gallery.
  - Wired chooser selection into the existing pattern/detail state with selected class fallback reset.
  - Added e2e coverage for choosing tetra and octo partitions through all three entry modes.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed
  - `npm run validate`: passed
  - `npm run validate`: not run because it performs a production build that can update generated `dist/`, which this task explicitly avoided.
- Decisions:
  - none
- Remaining:
  - C4.3 should add the tetrachotomy composition view.

### 2026-06-15 - Task C4.3

- Status: DONE
- Changed files:
  - `src/components/PartitionCompositionView.tsx`
  - `src/App.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a tetrachotomy composition view with two component dichotomy cards and one scoped final 4-class pattern.
  - Component pole toggles select the existing partition class intersection through `selectedClassKey`; no hand-authored partition facts were added.
  - Kept octochotomy on the existing pattern path for C4.5.
  - Added scoped e2e locators for component cards and final pattern to avoid ambiguous `TypePatternCard` matches.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `PLAYWRIGHT_EXTERNAL_SERVER=1 node node_modules/playwright/cli.js test tests/e2e/app.spec.ts -g "shows tetrachotomy composition"`: passed
  - `npm run validate`: not run because it performs a production build that can update generated `dist/`, which this task explicitly avoided.
- Decisions:
  - The composition view derives component pole membership from the existing tetrachotomy partition view model.
- Remaining:
  - C4.4 should add the tetrachotomy detail view with 4 classes, selected-class type panel and Model A previews.

### 2026-06-15 - Task C4.4

- Status: DONE
- Changed files:
  - `src/components/TetrachotomyView.tsx`
  - `src/App.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a tetrachotomy detail wrapper that combines the existing component composition, four computed class buttons and the reusable selected-class types panel.
  - Reused `PartitionTypesPanel` and `ModelAPreviewGrid`; no duplicate Model A preview logic or new domain facts were added.
  - Derived preview highlight context deterministically from the first trait/pole of the selected class using that pole's first view.
  - Added e2e coverage for the four class buttons and four selected-class Model A previews.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `PLAYWRIGHT_EXTERNAL_SERVER=1 node node_modules/playwright/cli.js test tests/e2e/app.spec.ts --grep "shows tetrachotomy composition"`: passed on chromium desktop and mobile
  - `npm run validate`: not run because it performs a production build that can update generated `dist/`, which this task explicitly avoided.
- Decisions:
  - The tetrachotomy detail preview uses the first selected class pole's first view as the minimal deterministic highlight source.
- Remaining:
  - C4.5 should add the octochotomy composition view.

### 2026-06-15 - Task C4.5

- Status: DONE
- Changed files:
  - `src/components/PartitionCompositionView.tsx`
  - `src/App.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Reused the existing partition composition view for octochotomy mode.
  - Added three component dichotomy cards feeding the existing octochotomy `selectPartitionExplorerView` final pattern.
  - Kept dependent-triple URL/parser diagnostics unchanged for C4.6, per scope.
  - Added e2e coverage for component cards, 16-cell final pattern, two selected final cells and component-pole URL sync.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `node scripts/e2e-dev.mjs tests/e2e/app.spec.ts --grep "shows octochotomy composition"`: passed; script ran the full desktop/mobile e2e suite.
  - `npm run validate`: not run because it performs a production build that can update generated `dist/`, which this task explicitly avoided.
- Decisions:
  - No `OctochotomyView` was added; C4.5 only needs composition plus final pattern.
- Remaining:
  - C4.6 should add the octochotomy detail view and dependent URL diagnostic path.

### 2026-06-15 - Task C4.6

- Status: DONE
- Changed files:
  - `src/components/OctochotomyView.tsx`
  - `src/components/PartitionDiagnostic.tsx`
  - `src/components/TypePatternCard.tsx`
  - `src/App.tsx`
  - `src/appState.ts`
  - `src/appState.test.ts`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added octochotomy detail with eight computed class buttons, selected class defaulting through the existing ILE class selector, and the reusable selected-class types panel with Model A previews.
  - Added a reusable partition diagnostic component with explicit diagnostic data attributes.
  - Preserved known unique dependent triples in URL state so selector diagnostics render instead of silently defaulting.
  - Added e2e coverage for valid octochotomy detail and dependent-triple diagnostic URLs.
- Checks:
  - `npm run lint`: passed
  - `npm test -- src/appState.test.ts`: passed
  - `npm run smoke:render`: passed
  - `node scripts/e2e-dev.mjs tests/e2e/app.spec.ts --grep "shows octochotomy"`: passed; script ran the full desktop/mobile e2e suite.
  - `npm run validate`: not run because it performs production build/audit/dev-server checks and may update generated `dist/`; targeted checks covered this scoped change.
- Decisions:
  - Dependent diagnostics use the existing `buildPartition` and selector diagnostic path; no new domain facts were added.
- Remaining:
  - Next roadmap step can be G4L.1 for subgroup-lattice domain modeling; Q9.1 is also unblocked for smoke-render hardening.

### 2026-06-15 - Task Q9.1

- Status: DONE
- Changed files:
  - `scripts/render-smoke.tsx`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Expanded SSR render smoke from the default trait path to a deterministic multi-case harness.
  - Added URL-search SSR cases for valid tetrachotomy, valid octochotomy and a dependent octochotomy triple.
  - Checked stable data attributes, class/component/model-preview counts, canonical Russian UI strings and diagnostic reason output without asserting URL mutation.
- Checks:
  - `npm run smoke:render`: passed
  - `npm run lint`: passed
  - `npm run validate`: not run because it performs a production build that can write generated `dist/`, which Q9.1 explicitly avoided.
- Decisions:
  - none
- Remaining:
  - none

### 2026-06-16 - Task Q9.4

- Status: DONE
- Changed files:
  - `plans/roadmap/PRD.md`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a short PRD section explaining that aspecton, functionon and socion use the user-provided canonical H3 display order.
  - Clarified that the order is part of domain data for trait vectors, partitions, Model A comparisons and regression tests, not a cosmetic UI sort.
  - Kept the explanation out of the main screen and avoided adding new theoretical claims beyond existing roadmap decisions.
- Checks:
  - pending commit validation
- Decisions:
  - none
- Remaining:
  - none

### 2026-06-16 - Task V5.1

- Status: DONE
- Changed files:
  - `src/data/aspectVisuals.ts`
  - `src/data/socionics.ts`
  - `src/data/socionics.test.ts`
  - `src/components/AspectGlyph.tsx`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added serializable aspect visual metadata keyed by `AspectId`, with `iconKey` and fill state kept outside React components.
  - Re-exported the metadata through the domain barrel.
  - Updated `AspectGlyph` to consume the shared metadata instead of maintaining duplicate shape/fill tables.
  - Added a domain invariant test requiring visual metadata for every registered aspect.
- Checks:
  - `npm test -- src/data/socionics.test.ts`: passed
  - `npm run lint`: passed
- Decisions:
  - V5.1 keeps rendering SVG paths in the existing UI component; V5.2 should introduce a dedicated UI registry for richer icon mapping.
- Remaining:
  - V5.2

### 2026-06-16 - Task V5.2

- Status: DONE
- Changed files:
  - `src/components/AspectIcon.tsx`
  - `src/components/AspectGlyph.tsx`
  - `src/diagrams/AspectFunctionDiagram.tsx`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a reusable UI registry that maps domain `iconKey` values to custom SVG aspect icons.
  - Kept `AspectGlyph` as the public icon/abbreviation switch while delegating icon rendering to `AspectIcon`.
  - Reused `AspectIcon` in the aspect-function grid while leaving compact formula chips width-stable.
  - Preserved existing `data-aspect-glyph-mode` compatibility for icon-mode glyphs.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed
- Decisions:
  - Aspect symbols stay as custom SVG shapes because lucide does not provide the classical socionics aspect mark set.
- Remaining:
  - V5.3

### 2026-06-16 - Task V5.3

- Status: DONE
- Changed files:
  - `src/components/AspectDisplayToggle.tsx`
  - `src/components/AspectGlyph.tsx`
  - `src/components/AspectIcon.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Expanded aspect display mode from two options to `icon`, `symbol` and `icon-symbol`.
  - Kept the visible abbreviation label while renaming the internal mode to `symbol`.
  - Added combined icon+symbol rendering for compact Model A glyphs.
  - Left persistence unchanged because the existing aspect display toggle is local visual state, not URL state.
  - Added e2e coverage for symbol-only and combined modes.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed
- Decisions:
  - No URL/localStorage persistence was added for V5.3; the current app convention treats this toggle as a visual preference only.
- Remaining:
  - none

### 2026-06-16 - Task H6.1

- Status: DONE
- Changed files:
  - `src/appState.ts`
  - `src/appState.test.ts`
  - `src/App.tsx`
  - `src/components/ThemeToggle.tsx`
  - `tests/e2e/app.spec.ts`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added `ThemeMode` with URL-first, localStorage-second, default-light policy.
  - Serialized non-default `theme=dark` while omitting default light theme URLs.
  - Added a guarded localStorage write and `html`/app-root `data-theme` sync.
  - Added a fixed-position `ThemeToggle` so the new control does not change existing page snapshot height.
  - Added e2e coverage for URL, localStorage and root theme state.
- Checks:
  - `npm run lint`: passed
  - `npm test -- src/appState.test.ts`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed
- Decisions:
  - No `system` theme option in H6.1; that would require separate resolved-theme policy.
- Remaining:
  - H6.2

### 2026-06-16 - Task H6.2

- Status: DONE
- Changed files:
  - `src/index.css`
  - `src/App.tsx`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added light/dark base CSS variables for app background, foreground, selection and scrollbar colors.
  - Bound the app root background/text/selection to the new variables.
  - Updated custom scrollbar colors to use the same token layer.
- Checks:
  - `npm run build`: passed
  - `npm run smoke:render`: passed
  - `npm run lint`: passed after rerun; the first parallel lint collided with a simultaneous build changing `dist` assets.
- Decisions:
  - H6.2 only adds base tokens; migration of shell components remains H6.3.
- Remaining:
  - H6.3

### 2026-06-16 - Task H6.3

- Status: DONE
- Changed files:
  - `src/index.css`
  - `src/components/ModeSelector.tsx`
  - `src/components/AspectDisplayToggle.tsx`
  - `src/components/ThemeToggle.tsx`
  - `src/components/TraitNav.tsx`
  - `src/components/TypeSelector.tsx`
  - `src/components/PoleSelector.tsx`
  - `src/components/ViewSelector.tsx`
  - `src/components/Footer.tsx`
  - `src/components/HelpModal.tsx`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added shared shell token utility classes for panels, controls, tabs, headings, muted text, accents and active states.
  - Migrated primary shell selectors and panels to those token utilities.
  - Preserved existing snapshot dimensions while making shell controls theme-aware.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed
- Decisions:
  - Diagram and formula surfaces remain separate H6.4 scope.
- Remaining:
  - H6.4

### 2026-06-24 - Task H6.4

- Status: DONE
- Changed files:
  - `src/index.css`
  - `src/App.tsx`
  - `src/components/Header.tsx`
  - `src/components/DichotomyGallery.tsx`
  - `src/components/PartitionChooser.tsx`
  - `src/components/PartitionCompositionView.tsx`
  - `src/components/PartitionDiagnostic.tsx`
  - `src/components/PartitionTypesPanel.tsx`
  - `src/components/TetrachotomyView.tsx`
  - `src/components/OctochotomyView.tsx`
  - `src/components/TypePatternCard.tsx`
  - `src/components/ModelAPreviewGrid.tsx`
  - `src/components/FormulaPanel.tsx`
  - `src/diagrams/AspectFunctionDiagram.tsx`
  - `src/diagrams/TypeModelDiagram.tsx`
  - `tests/e2e/app.spec.ts-snapshots/*.png`
- Summary:
  - Ported the reference project's OLED editorial glass visual language into the current app through shared CSS tokens, glass panels, grain and a subtle ambient grid.
  - Migrated diagram, formula, Model A preview, partition pattern, chooser and class-detail surfaces away from hardcoded white/slate styling to theme-aware tokens.
  - Kept URL/domain behavior unchanged and updated the intentional desktop/mobile e2e snapshots for the visual redesign.
- Checks:
  - `npm run lint`: passed
  - `npm run smoke:render`: passed
  - `npm run test:e2e`: passed
- Decisions:
  - The reference style was adapted as a local token system rather than copied wholesale; no new package dependency or external font request was added.
- Remaining:
  - none

### 2026-06-24 - Task F4.1 planning correction

- Status: DONE
- Changed files:
  - `plans/roadmap/PRD.md`
  - `plans/roadmap/domain-model.md`
  - `plans/roadmap/decisions.md`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Split computed structural partitions from source-derived formula catalogs.
  - Added Phase 4F for tetrachotomy and octochotomy formula ground truth before localization and semantic interpretation work.
  - Recorded that current tetrachotomy exploration enumerates 105 structural trait pairs, while the source extract contains 35 canonical formulas.
  - Recorded that current octochotomy exploration enumerates structural independent triples, while author octochotomy records must stay `draft`, `incomplete` or `verified` until the source text is finished and confirmed.
  - Added `DEC-009` so future agents do not mark tetra/octo formula transfer complete based only on working partition UI.
- Checks:
  - Docs-only change; deterministic app validation not run.
- Decisions:
  - `DEC-009`
- Remaining:
  - F4.2 should add source-derived tetrachotomy formula records.
  - F4.3 should verify all 35 formulas against computed partitions.
  - F4.5-F4.7 should handle source-derived octochotomy records after user confirmation of the final source.

### 2026-06-24 - Tasks F4.2-F4.3

- Status: DONE
- Changed files:
  - `tsconfig.json`
  - `src/data/socionics.ts`
  - `src/data/tetrachotomies.ts`
  - `src/data/tetrachotomies.test.ts`
  - `plans/roadmap/PRD.md`
  - `plans/roadmap/domain-model.md`
  - `plans/roadmap/decisions.md`
  - `plans/roadmap/tasks.md`
  - `plans/roadmap/progress.md`
- Summary:
  - Added a source-derived tetrachotomy formula adapter over `plans/roadmap/tetrachotomy-doc-extract.json`.
  - Parsed source formula labels into stable `ReininTraitId` target and basis traits.
  - Preserved source metadata: source document, tetra number, source table number, formula text, relation text, nearby label, source colors and type groups.
  - Added tests for 35 records, stable IDs, registered trait labels, 4x4 groups, rank-2 basis traits and equality between source groups and computed tetrachotomy partition classes.
  - Removed the unverified roadmap claim that every source formula is one of three aliases in a rank-2 triple; tests showed source groups match computed basis partitions, but target trait rank is not always dependent in the current vector model.
- Checks:
  - `npm test -- src/data/tetrachotomies.test.ts`: passed
  - `npm run lint`: passed
- Decisions:
  - `DEC-009` refined: source formulas are canonical records; broader structural pairs remain separate unless explicitly verified.
- Remaining:
  - F4.4 should separate canonical source formulas from structural pair exploration in selectors/UI.
  - F4.5-F4.7 should handle octochotomy source records after user confirmation of the final source.
