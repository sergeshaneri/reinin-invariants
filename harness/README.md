# Project Harness

This folder holds the repo-local AI harness: validation entrypoints, failure notes, and future workflow helpers.

Current harness:

- `npm run validate` runs all deterministic checks.
- `npm run smoke:render` renders the React app through `react-dom/server` and verifies the default UI/data surface.
- `npm run smoke` starts the Vite dev server, requests the local page, and verifies the app root is present.
- `npm run test:e2e` opens the app in Chromium desktop and mobile viewports, checks key UI controls, captures a screenshot snapshot, and fails on browser console errors.
- `harness/failure-log.md` records recurring agent failures and proposed harness fixes.

Domain ground-truth rule:

- For socionics domain facts, the user's supplied tables and decisions are the source of truth.
- Before adding or changing hand-authored domain tables such as Model A assignments, socion membership, aspecton/functionon ordering, trait polarity, semantic interpretations, or theoretical explanations, ask the user for the ground-truth data or explicit confirmation.
- Do not use web sources as primary authority for socionics data in this repo. External sources may be used only as secondary orientation and must not override the user's tables.
- If a task lacks required user-confirmed domain data, stop and request that data instead of improvising.

Publish workflow:

- Keep validation local and deterministic. Do not add automatic commits, pushes, PR creation, or other network side effects to validation scripts.
- After a step is complete, verified, and coherent enough for history, commit it with a narrow message.
- Push the current branch when the user asks to publish progress or when continuing safely across windows depends on persisted remote state.
- Push directly to `main` only when the user explicitly asks for that target; otherwise use the current working branch and normal PR/merge flow.

Keep this harness practical. Add new checks when they catch real project risks.
