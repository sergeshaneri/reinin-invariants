# Clean-Context Handoff

Use this file to start a fresh agent window for one atomic task. Replace placeholders and keep the scope narrow.

## Standard Handoff Prompt

```text
Прочитай:
- AGENTS.md
- harness/README.md
- plans/roadmap/PRD.md
- plans/roadmap/domain-model.md
- plans/roadmap/architecture.md
- plans/roadmap/tasks.md
- plans/roadmap/progress.md
- plans/roadmap/decisions.md
- plans/roadmap/task-template.md
- plans/roadmap/invariant-checklist.md

Возьми только task <TASK_ID> из plans/roadmap/tasks.md.

Цель:
<one-sentence objective from tasks.md>

Ограничения:
- не трогай соседние задачи;
- не меняй dist/ вручную;
- не рефактори UI/данные вне scope;
- если меняешь доменную модель, добавь deterministic tests из invariant-checklist;
- для соционического ground truth опирайся на таблицы и решения пользователя; перед добавлением или изменением hand-authored доменных данных спроси пользователя;
- не используй web sources как авторитет для Model A, membership социона, порядка аспектон/функцион, полярности признаков или семантических интерпретаций;
- если принимаешь спорное доменное решение, добавь запись в decisions.md;
- в конце обнови progress.md;
- перед финальным ответом запусти npm run validate.

Начни с drift check:
git status --short -- <likely files from task>

Если есть unrelated dirty changes, работай вокруг них и не откатывай их.
Если задача требует решения, которого нет в decisions.md, остановись и явно сформулируй решение.
Если задача требует новых соционических таблиц или трактовок, остановись и попроси user ground truth.
```

## Minimal Executor Checklist

1. Read the required files.
2. Identify one task ID.
3. Confirm scope and likely files.
4. Run drift check.
5. Implement only that task.
6. Add or update invariant tests.
7. Run focused checks.
8. Run `npm run validate`.
9. Update `progress.md`.
10. Update `decisions.md` if a decision was made.
11. Final response: changed files, checks, remaining risks.

## Blocked Task Handoff

Use this when a task cannot proceed:

```md
### YYYY-MM-DD - Task <TASK_ID> BLOCKED

- Blocking issue:
  - `<specific missing decision/data/tooling>`
- Evidence:
  - `<file/test/command/result>`
- Files changed:
  - `<path or none>`
- Checks:
  - `<command>`: passed | failed | not run, reason
- Needed from user:
  - `<one concrete decision or input>`
```

Blocked tasks must not be marked `DONE` in `tasks.md`.

## Resume Prompt After Block

```text
Resume task <TASK_ID>.

Read:
- plans/roadmap/progress.md
- plans/roadmap/decisions.md
- plans/roadmap/tasks.md
- plans/roadmap/task-template.md
- files changed in the blocked attempt

The previous block was:
<copy blocking issue>

New user decision/input:
<copy user answer>

Continue with the same scope. Do not restart unrelated phases.
```
