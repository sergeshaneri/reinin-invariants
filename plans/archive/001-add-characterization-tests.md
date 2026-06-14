# Plan 001: Add characterization tests for domain data and app invariants

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report instead of improvising.
>
> **Drift check (run first)**: `git status --short -- package.json package-lock.json src/data/socionics.ts src/diagrams/registry.ts src/decorators/registry.ts src/diagrams/AspectFunctionDiagram.tsx`
> Baseline is "unborn HEAD / no commits" on 2026-06-11. If the cited current-state excerpts below no longer match, stop and refresh this plan before editing.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: no commit, unborn HEAD, 2026-06-11

## Why This Matters

The project's central asset is a large hand-authored domain table in `src/data/socionics.ts`. TypeScript currently proves that the file has the right broad shapes, but it does not prove that every mapping references registered IDs, avoids duplicates, uses registered decorators, or preserves the app assumptions that the diagram code relies on. This makes future edits to the table risky and makes UI fixes harder to verify.

## Current State

- `package.json` defines `dev`, `build`, `preview`, `clean`, and `lint`, but no `test` script:

```json
package.json:6
"scripts": {
  "dev": "vite --configLoader runner --port=3000 --host=0.0.0.0",
  "build": "vite build --configLoader runner",
  "preview": "vite preview",
  "clean": "node -e \"require('node:fs').rmSync('dist', { recursive: true, force: true })\"",
  "lint": "tsc --noEmit"
}
```

- `src/data/socionics.ts:253-278` defines open arrays for mappings and views:

```ts
export interface Mapping {
  aspects: AspectId[];
  functions: number[];
  aspectLabel?: string;
  functionLabel?: string;
}

export interface View {
  title: string;
  mappings: Mapping[];
  decoratorIds?: string[];
  connector?: string;
  footnote?: string;
  description?: string;
  isBlockPermutation?: boolean;
}
```

- `src/data/socionics.ts:328` exports `REININ_TRAITS`, which contains the hand-authored domain data.
- `src/diagrams/AspectFunctionDiagram.tsx:51`, `:54`, and `:211` use non-null assertions when looking up aspects/functions. Tests should make those assumptions explicit before any refactor.
- Audit command run by advisor: `npm.cmd run lint` exited 0.
- No project test directory or project test files were found.

## Commands You Will Need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install/update deps | `npm.cmd install` | exit 0; `package-lock.json` updated if a test dependency is added |
| Typecheck | `npm.cmd run lint` | exit 0, no TypeScript errors |
| Tests | `npm.cmd test` | exit 0, all tests pass |
| Build | `npm.cmd run build` | exit 0; writes `dist/` |

## Scope

**In scope**:
- `package.json`
- `package-lock.json`
- `src/data/socionics.test.ts` or `src/data/__tests__/socionics.test.ts` (create one)
- Optional: `src/test/` only if shared test helpers are truly needed

**Out of scope**:
- Do not change the actual `REININ_TRAITS`, `ASPECTS`, or `FUNCTIONS` data in this plan unless a test exposes a real current inconsistency. If that happens, stop and report the exact inconsistency.
- Do not refactor UI components in this plan.
- Do not add browser E2E tooling in this plan; keep the baseline small.

## Git Workflow

- Branch: `codex/001-add-characterization-tests`
- Commit message style: no existing history. Use a clear imperative message such as `test: add socionics data characterization`.
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Add a minimal test runner

Add Vitest as a dev dependency and add a `test` script. Prefer:

```json
"test": "vitest run"
```

Keep the existing `lint` script unchanged.

**Verify**: `npm.cmd test` should execute Vitest. It may report "No test files found" before Step 2; that is acceptable only at this step.

### Step 2: Add structural tests for domain tables

Create a test file under `src/data/`. Import these symbols from `src/data/socionics.ts`:

- `ASPECTS`
- `FUNCTIONS`
- `REININ_TRAITS`
- `MODEL_A_LAYOUT`

Test cases to add:

- every aspect ID used in every mapping exists in `ASPECTS`
- every function ID used in every mapping exists in `FUNCTIONS`
- every view has at least one mapping
- every trait has exactly two poles
- every pole has at least one view
- no view repeats an aspect ID within that view
- no view repeats a function ID within that view
- `MODEL_A_LAYOUT` contains exactly the registered function IDs, no duplicates

Use ordinary Vitest `describe`/`it`/`expect` style. Keep failure messages specific enough to name the trait, pole index, view index, and duplicated/invalid ID.

**Verify**: `npm.cmd test` exits 0 and reports the new test file passing.

### Step 3: Add registry consistency tests

In the same test file or a second focused file, import:

- `DIAGRAMS`, `DEFAULT_DIAGRAM_ID` from `src/diagrams/registry.ts`
- `DECORATORS` from `src/decorators/registry.ts`
- `REININ_TRAITS` from `src/data/socionics.ts`

Test cases to add:

- `DEFAULT_DIAGRAM_ID` exists in `DIAGRAMS`
- every `trait.diagramId`, or the default when absent, exists in `DIAGRAMS`
- every `view.decoratorIds` entry exists in `DECORATORS`

**Verify**: `npm.cmd test` exits 0.

### Step 4: Document the new verification baseline

Update `README.md` only if the maintainer wants docs changed in this same plan. If you do update it, add `npm run test` to the "Проверка и сборка" command block. If you are unsure whether docs changes are desired, skip README and leave this plan focused on tooling/tests.

**Verify**: `npm.cmd run lint` exits 0.

## Test Plan

- The tests created in this plan are the test plan.
- Minimum expected coverage: structural integrity of domain IDs, duplicate prevention, diagram registry validity, decorator registry validity, and `MODEL_A_LAYOUT` consistency.
- Final verification: `npm.cmd run lint`, `npm.cmd test`, and `npm.cmd run build` all exit 0.

## Done Criteria

- [ ] `package.json` has a `test` script.
- [ ] `package-lock.json` reflects any added dev dependency.
- [ ] Domain/registry characterization tests exist and pass.
- [ ] `npm.cmd run lint` exits 0.
- [ ] `npm.cmd test` exits 0.
- [ ] `npm.cmd run build` exits 0.
- [ ] `git status --short` shows only the in-scope files changed, plus `README.md` only if intentionally documented.
- [ ] `plans/README.md` status row for 001 is updated.

## STOP Conditions

Stop and report if:

- Adding Vitest requires a major framework migration or conflicts with Vite/React versions.
- A characterization test exposes a real current data inconsistency.
- The code at the cited current-state locations no longer matches this plan.
- The fix appears to require changing UI behavior or domain data beyond adding tests.

## Maintenance Notes

These tests become the guardrail for future edits to `src/data/socionics.ts`. Reviewers should require new or updated characterization tests whenever a trait, mapping, decorator, diagram, or function layout changes.
