# Plan 002: Fix hover and pin interaction state

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report instead of improvising.
>
> **Drift check (run first)**: `git status --short -- src/App.tsx src/diagrams/AspectFunctionDiagram.tsx src/diagrams/types.ts src/data/socionics.ts package.json package-lock.json`
> Baseline is "unborn HEAD / no commits" on 2026-06-11. If the cited current-state excerpts below no longer match, stop and refresh this plan before editing.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/archive/001-add-characterization-tests.md`
- **Category**: bug
- **Planned at**: no commit, unborn HEAD, 2026-06-11

## Why This Matters

The diagram code exposes a click-to-pin interaction, but mouse leave handlers clear the same state that click handlers use for pinning. On desktop, a clicked aspect or function is not reliably pinned after the pointer leaves the tile. The same shared state also allows an aspect and a function to be active at the same time, which makes block highlighting ambiguous.

## Current State

- `src/App.tsx:31-32` stores only one state field for aspect activity and one for function activity:

```ts
const [hoveredAspect, setHoveredAspect] = useState<AspectId | null>(null);
const [hoveredFunction, setHoveredFunction] = useState<number | null>(null);
```

- `src/App.tsx:67-71` describes this as resetting a "pin":

```ts
// При смене признака/полюса — сбрасываем "пин" клеток.
useEffect(() => {
  setHoveredAspect(null);
  setHoveredFunction(null);
}, [selectedTraitIndex, selectedPoleIndex, activeViewIndex]);
```

- `src/diagrams/AspectFunctionDiagram.tsx:134-135` has click handlers named as pin actions:

```ts
const pinAspect = (id: AspectId) => setHoveredAspect(hoveredAspect === id ? null : id);
const pinFunction = (id: number) => setHoveredFunction(hoveredFunction === id ? null : id);
```

- But `src/diagrams/AspectFunctionDiagram.tsx:175-177` and `:226-228` clear the same state on mouse leave:

```tsx
onMouseEnter={() => setHoveredAspect(aspect.id)}
onMouseLeave={() => setHoveredAspect(null)}
onClick={() => pinAspect(aspect.id)}
```

```tsx
onMouseEnter={() => setHoveredFunction(func.id)}
onMouseLeave={() => setHoveredFunction(null)}
onClick={() => pinFunction(func.id)}
```

## Commands You Will Need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm.cmd run lint` | exit 0, no TypeScript errors |
| Tests | `npm.cmd test` | exit 0, all tests pass |
| Build | `npm.cmd run build` | exit 0; writes `dist/` |

## Scope

**In scope**:
- `src/App.tsx`
- `src/diagrams/AspectFunctionDiagram.tsx`
- `src/diagrams/types.ts`
- A focused test file if Plan 001 established a practical place for interaction tests

**Out of scope**:
- Do not rewrite the diagram layout or visual design.
- Do not change the meaning of block permutations or domain data.
- Do not add a new state library.
- Do not change `src/data/socionics.ts` except for test imports if absolutely necessary.

## Git Workflow

- Branch: `codex/002-fix-hover-pin-state`
- Commit message style: no existing history. Use a clear imperative message such as `fix: separate diagram hover and pin state`.
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Replace shared hover/pin state with explicit interaction state

Introduce a small explicit state shape in `App.tsx`, for example:

```ts
type ActiveCell =
  | { kind: 'aspect'; id: AspectId; mode: 'hover' | 'pin' }
  | { kind: 'function'; id: number; mode: 'hover' | 'pin' }
  | null;
```

Use one `activeCell` state instead of separate `hoveredAspect` and `hoveredFunction` states, or use separate `hoveredCell` and `pinnedCell` states if that is clearer. The important behavior is:

- hover affects highlighting only while there is no pinned cell, or hover is visually secondary
- click toggles a persistent pinned cell
- clicking an aspect clears any pinned function, and clicking a function clears any pinned aspect
- mouse leave does not clear a pinned cell
- changing trait, pole, or view clears the pinned cell

**Verify**: `npm.cmd run lint` exits 0.

### Step 2: Update diagram props and highlight logic

Update `src/diagrams/types.ts` and `src/diagrams/AspectFunctionDiagram.tsx` to consume the new state shape. Keep the current highlight semantics:

- non-block views still highlight the directly mapped aspect/function group
- block views still pulse across possible block placements
- inactive cells remain hidden/dimmed exactly as before

Avoid passing setter pairs for separate aspect/function state if the new model can expose clearer callbacks such as `onAspectHover`, `onFunctionHover`, `onAspectClick`, and `onFunctionClick`.

**Verify**: `npm.cmd run lint` exits 0.

### Step 3: Add regression coverage

If Plan 001 added only data tests, add the lightest practical regression test for the state reducer/helper you create. Prefer extracting pure helper functions only if that keeps the UI code simpler:

- clicking an aspect pins it
- mouse leave does not clear a pinned aspect
- clicking the same aspect clears it
- clicking a function replaces a pinned aspect
- trait/pole/view reset clears the pin

If testing React DOM interaction would require adding a large new browser stack, do not add it in this plan. Instead, test the pure transition helper and leave browser E2E as a future plan.

**Verify**: `npm.cmd test` exits 0.

### Step 4: Manual browser verification

Run the app and verify manually:

1. Open the app.
2. Select a block permutation trait such as `democracy`.
3. Click an aspect tile.
4. Move the pointer away.
5. The tile/group remains pinned.
6. Click the same tile again.
7. The pin clears.
8. Click a function tile, then click an aspect tile.
9. Only the latest clicked cell remains pinned.

**Verify**: `npm.cmd run build` exits 0.

## Test Plan

- Reuse the test runner from Plan 001.
- Add pure state transition tests if a helper is extracted.
- Final verification: `npm.cmd run lint`, `npm.cmd test`, and `npm.cmd run build`.

## Done Criteria

- [ ] A clicked aspect/function remains pinned after mouse leave.
- [ ] Clicking the same cell toggles the pin off.
- [ ] Clicking an aspect clears a pinned function, and clicking a function clears a pinned aspect.
- [ ] Changing trait, pole, or view clears the pin.
- [ ] `npm.cmd run lint` exits 0.
- [ ] `npm.cmd test` exits 0.
- [ ] `npm.cmd run build` exits 0.
- [ ] `git status --short` shows only in-scope files changed.
- [ ] `plans/README.md` status row for 002 is updated.

## STOP Conditions

Stop and report if:

- The maintainer says click-to-pin was not intended behavior despite the current code naming/comments.
- The fix requires changing mapping semantics in `src/data/socionics.ts`.
- The highlight behavior for block permutations becomes unclear or contradicts existing copy at `src/diagrams/AspectFunctionDiagram.tsx:151`.
- The code at the cited current-state locations no longer matches this plan.

## Maintenance Notes

Keep hover and pin concepts separate in future diagram features. Reviewers should test both mouse and touch behavior, because touch devices may not emit the same enter/leave sequence as desktop pointers.
