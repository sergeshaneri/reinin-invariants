# Plans

Use `plans/roadmap/` for active work.

## Active Queue

- `plans/roadmap/tasks.md` is the source of current task order and status.
- `plans/roadmap/progress.md` records completed roadmap work.
- `plans/roadmap/decisions.md` records domain and architecture decisions.
- `plans/roadmap/handoff.md` contains the clean-context prompt for one atomic task.

New implementation agents should not read archived plans by default. Read them only when historical context is explicitly needed.

## Archive

Completed pre-roadmap implementation plans live in `plans/archive/`:

- `001-add-characterization-tests.md`
- `002-fix-hover-pin-state.md`
- `003-remediate-vite-audit.md`
- `004-remove-local-generated-artifacts.md`

