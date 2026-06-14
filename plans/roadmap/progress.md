# Roadmap Progress

## Snapshot

- Created: 2026-06-12.
- Scope of this pass: planning and execution-harness artifacts only.
- Source changes in this pass: none.
- Existing dirty workspace changes were observed before planning and left untouched.
- Validation: `npm run validate` passed after rerun outside the sandbox.

## Current Status

| Area | Status | Notes |
|---|---:|---|
| Roadmap artifacts | DONE | PRD, domain model, architecture, tasks, progress created under `plans/roadmap/`. |
| Execution harness | DONE | Decisions, task template, invariant checklist and clean-context handoff added. |
| Domain foundation | DONE | D1.1-D1.8 complete. |
| 16 Model A types | DONE | Implemented with stable type IDs and tests. |
| Trait membership by type | DONE | Membership tables and partition helpers are covered by tests. |
| Tetrachotomies | TODO | Depends on generic partition helpers. |
| Octochotomies | TODO | Depends on GF(2) rank and independent triple validation. |
| Aspect icons | TODO | Should follow stable aspect visual metadata. |
| Dark theme | TODO | Should follow app state and design token decisions. |
| English version | TODO | Should follow locale adapter and catalog split. |
| Semantic interpretations | TODO | Should follow stable target IDs and localization foundation. |

## Recommended Next Step

Continue with `U2.1` from `tasks.md`: add `mode` to app state and URL parser without changing default behavior. D1.1-D1.8 now provide stable domain data, partition diagnostics and selector view models.

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
