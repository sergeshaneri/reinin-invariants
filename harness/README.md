# Project Harness

This folder holds the repo-local AI harness: validation entrypoints, failure notes, and future workflow helpers.

Current harness:

- `npm run validate` runs all deterministic checks.
- `npm run smoke:render` renders the React app through `react-dom/server` and verifies the default UI/data surface.
- `npm run smoke` starts the Vite dev server, requests the local page, and verifies the app root is present.
- `npm run test:e2e` opens the app in Chromium desktop and mobile viewports, checks key UI controls, captures a screenshot snapshot, and fails on browser console errors.
- `harness/failure-log.md` records recurring agent failures and proposed harness fixes.

Dev e2e port rule:

- `npm run test:e2e` uses `127.0.0.1:3002` through `scripts/e2e-dev.mjs`.
- If `3002` is free, the script starts a strict-port Vite server and closes it after Playwright exits.
- If `3002` already serves this app's Vite dev server at `http://127.0.0.1:3002/reinin-invariants/`, the script reuses it automatically for Playwright.
- If port `3002` is already occupied, do not kill the process unless the user explicitly confirms that exact PID can be stopped.
- If the occupied port is not clearly this app, the script stops with an explanatory error; ask the user to free port `3002` or confirm which process may be stopped.

Domain ground-truth rule:

- For socionics domain facts, the user's supplied tables and decisions are the source of truth.
- Before adding or changing hand-authored domain tables such as Model A assignments, socion membership, aspecton/functionon ordering, trait polarity, semantic interpretations, or theoretical explanations, ask the user for the ground-truth data or explicit confirmation.
- Do not use web sources as primary authority for socionics data in this repo. External sources may be used only as secondary orientation and must not override the user's tables.
- If a task lacks required user-confirmed domain data, stop and request that data instead of improvising.

Theory diagram approval rule:

- Before implementing or materially changing a diagram that encodes socionics logic, first state the proposed diagram model to the user and wait for confirmation.
- The proposal should name the diagram objects, arrow direction, labels, grouping rule, source records used and unsupported/fallback cases.
- This checkpoint applies to explanatory diagrams and source-derived model views. It does not apply to small style-only changes or exact diagram shapes already approved by the user in the current context.

Windows PowerShell text-output rule:

- When a PowerShell command prints repository file contents, diffs, or other likely non-ASCII text, include the UTF-8 setup in the same command invocation:
  `[Console]::InputEncoding = [Text.UTF8Encoding]::new(); [Console]::OutputEncoding = [Text.UTF8Encoding]::new(); $OutputEncoding = [Text.UTF8Encoding]::new(); <command>`
- Apply this on the first attempt. Do not read first with default encoding to check whether mojibake appears.
- This is a command habit, not a separate preflight step; keep it attached to the actual read/print command.

Git sandbox write rule:

- Read-only git commands such as `git status`, `git diff`, `git log`, and `git show` can run without escalation.
- If `.git` is read-only in the active sandbox, request scoped escalation on the first attempt for commands that write repository metadata: `git add`, `git commit`, branch switch/create, merge/rebase, and push.
- Keep validation scripts local and do not bundle git writes into validation commands.

Publish workflow:

- Keep validation local and deterministic. Do not add automatic commits, pushes, PR creation, or other network side effects to validation scripts.
- After a step is complete, verified, and coherent enough for history, commit it with a narrow message.
- Push the current branch when the user asks to publish progress or when continuing safely across windows depends on persisted remote state.
- Push directly to `main` only when the user explicitly asks for that target; otherwise use the current working branch and normal PR/merge flow.

Keep this harness practical. Add new checks when they catch real project risks.
