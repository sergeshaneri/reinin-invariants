# Task Template

Каждая atomic task из `tasks.md` должна быть исполняемой в чистом окне без знания всей истории чата. Если задача требует больше контекста, сначала расширь этот шаблон или разбей задачу.

## Copy/Paste Template

```md
# Task <ID>: <Title>

## Objective

Один конкретный результат. Не включай соседние улучшения.

## Read First

- `AGENTS.md`
- `harness/README.md`
- `plans/roadmap/PRD.md`
- `plans/roadmap/domain-model.md`
- `plans/roadmap/architecture.md`
- `plans/roadmap/tasks.md`
- `plans/roadmap/progress.md`
- `plans/roadmap/decisions.md`
- `plans/roadmap/invariant-checklist.md`
- Relevant source files:
  - `<path>`

## Scope

In scope:

- `<file or behavior>`

Out of scope:

- `<explicit non-goal>`

## Likely Files

- `<path>`

## Constraints

- Preserve Russian user-facing text unless this task is explicitly about localization.
- Do not edit `dist/` directly.
- Keep domain logic in `src/data` or the agreed domain module, not in JSX.
- Add or update deterministic tests for domain changes.
- For socionics ground truth, use user-supplied tables and explicit user decisions as the primary authority; ask the user before adding or changing hand-authored domain data.
- Do not treat web sources as authoritative for Model A, socion membership, aspecton/functionon order, trait polarity or semantic interpretations.
- Keep changes surgical and avoid unrelated refactors.
- Work with existing dirty files; do not revert user changes.

## Steps

1. Run the drift check.
2. Inspect the relevant source and tests.
3. Make the smallest domain/model change first.
4. Add or update tests.
5. Wire UI only if the task explicitly includes UI.
6. Run focused checks.
7. Run `npm run validate` before marking the task done.
8. Update `plans/roadmap/progress.md`.
9. Add a decision entry if a domain or architecture choice was made.

## Drift Check

```powershell
git status --short -- <likely files>
```

Stop if the task files have unrelated changes that make the task ambiguous.

## Required Checks

- `npm test`
- `npm run lint`
- `npm run build` if UI or bundling changed
- `npm run smoke:render` if default render or app shell changed
- `npm run test:e2e` if navigation, URL, theme, locale or layout changed
- `npm run validate` before final response

## Domain Invariants To Cover

Reference `plans/roadmap/invariant-checklist.md` and list the exact checklist sections touched.

## Stop Conditions

Stop and report instead of improvising if:

- domain source data is missing or contradictory;
- required socionics ground truth has not been supplied or confirmed by the user;
- a test exposes a real inconsistency outside this task's scope;
- the task requires changing `src/data/socionics.ts` semantics without a new or updated invariant test;
- localization terminology is uncertain and affects public labels;
- the implementation would require a broad refactor not named in scope;
- `npm run validate` fails for a reason unrelated to the task.

## Progress Ledger Update

Append this to `plans/roadmap/progress.md`:

```md
### YYYY-MM-DD - Task <ID>

- Status: DONE | BLOCKED
- Changed files:
  - `<path>`
- Summary:
  - `<what changed>`
- Checks:
  - `<command>`: passed | failed | not run, reason
- Decisions:
  - `DEC-000` or `none`
- Remaining:
  - `<follow-up or none>`
```
```

## Executor Rule

Do not mark a task `DONE` in `tasks.md` unless the task objective is complete, required checks were run or explicitly documented as impossible, and `progress.md` contains a ledger entry.
