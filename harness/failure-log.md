# Harness Failure Log

Use this file to convert repeated agent mistakes into concrete harness changes.

## Entry Template

### YYYY-MM-DD - Short Failure Name

- Task:
- What happened:
- Expected behavior:
- Root cause:
- Proposed harness change:
- Change type: rule | test | check | workflow | tool restriction | documentation
- Acceptance test:
- Status: proposed | accepted | rejected

## Active Entries

### 2026-06-14 - Windows PowerShell Cyrillic Output Mojibake

- Task: Work with repository files and paths containing Cyrillic text on Windows.
- What happened: New Codex windows sometimes read or display Cyrillic through PowerShell with the wrong encoding before later commands happen to use a working encoding.
- Expected behavior: Set UTF-8 console and PowerShell output encoding before reading or printing non-ASCII text.
- Root cause: Windows PowerShell sessions can default to a legacy code page while repository content is UTF-8.
- Proposed harness change: Add a root working rule for UTF-8 setup before reading or printing non-ASCII text.
- Change type: rule
- Acceptance test: A new session can read Cyrillic-containing files without mojibake after applying the documented PowerShell encoding setup.
- Status: accepted

### 2026-06-14 - Known Dev Server Sandbox Retry

- Task: Start local dev/watch servers such as Vite from Codex.
- What happened: Agents first ran a known long-running dev command in the sandbox, hit an expected sandbox restriction, then retried with escalation.
- Expected behavior: For commands known in advance to start a server, open a port, download dependencies, or write build caches outside the workspace, request sandbox escalation on the first attempt with a narrow justification and prefix rule.
- Root cause: The agent treated expected sandbox restrictions as a discovery step instead of using the known permission model.
- Proposed harness change: Add a root working rule for first-attempt escalation on known dev/watch/server commands.
- Change type: tool restriction | rule
- Acceptance test: A new session that needs to start Vite or another dev server requests a scoped escalation before the first run instead of producing an avoidable sandbox failure.
- Status: accepted

### 2026-06-14 - Production Preview E2E Did Not Exit On Windows

- Task: Complete D1.5 validation.
- What happened: `npm run test:e2e:preview`, and then `npm run test:e2e`, reported passing Playwright tests but did not return control to `npm run validate`, causing repeated validation timeouts.
- Expected behavior: Browser validation should exit after tests pass and the managed Vite server is stopped.
- Root cause: The Playwright-managed `webServer` process did not shut down cleanly after successful tests in this Windows harness.
- Proposed harness change: Replace managed `webServer` usage in npm validation scripts with small Node runners that start Vite through its API, run the browser checks, and close the HTTP server with bounded shutdown.
- Change type: check
- Acceptance test: `npm run test:e2e:preview` and `npm run validate` exit successfully.
- Status: accepted

### 2026-06-14 - External Sources Used Before User Ground Truth

- Task: Add D1.1-D1.4 domain foundation.
- What happened: The agent started orienting domain tables with web sources before asking for the user's authoritative socionics ground truth.
- Expected behavior: For socionics domain facts in this repo, user-supplied tables and explicit user decisions should be treated as the primary authority. The agent should ask for missing or uncertain ground truth before adding hand-authored data.
- Root cause: The harness required deterministic tests for domain data but did not state that this project uses the user's advanced socionics tables over external references.
- Proposed harness change: Add a domain ground-truth rule to `harness/README.md`, `task-template.md`, and clean-context handoff prompts. Web sources may be secondary orientation only and must not override user tables.
- Change type: rule | workflow | documentation
- Acceptance test: Future tasks that add Model A, socion membership, aspecton/functionon ordering, trait polarity, or semantic interpretations explicitly cite user-provided data or stop to request it.
- Status: accepted

### 2026-06-14 - E2E Base URL Did Not Match Managed Dev Server

- Task: Complete D1.1-D1.4 domain foundation and run full validation.
- What happened: `npm run validate` started the Playwright-managed dev server on port 3002, but tests navigated through `baseURL` port 3000 and failed with `ERR_CONNECTION_REFUSED`.
- Expected behavior: Dev-mode Playwright tests should target the same server that Playwright starts.
- Root cause: `playwright.config.ts` had `webServer.url` set to `http://127.0.0.1:3002` while `use.baseURL` still pointed to `http://127.0.0.1:3000`.
- Proposed harness change: Align `use.baseURL` with the managed `webServer.url` and keep `reuseExistingServer: false`.
- Change type: check
- Acceptance test: `npm run test:e2e` and `npm run validate` pass without relying on any pre-existing dev server on port 3000.
- Status: accepted

### 2026-06-12 - Validation Could Reuse Stale Dev Server

- Task: Close the remaining harness cleanup items.
- What happened: Dev-mode Playwright reused an existing local server outside CI, so `npm run validate` could exercise a stale app on port 3000.
- Expected behavior: Validation should always start and test the current workspace server.
- Root cause: `playwright.config.ts` optimized for local convenience with `reuseExistingServer: !process.env.CI`.
- Proposed harness change: Disable dev-mode Playwright server reuse; keep existing `smoke:dist` fetch timeouts, bounded shutdown, and flexible root div matching.
- Change type: check
- Acceptance test: `npm run validate` passes.
- Status: accepted

### 2026-06-12 - URL Sync Test Was Style-Coupled

- Task: Make URL-sync E2E assertions semantic.
- What happened: The URL-sync test identified the active trait by Tailwind classes instead of an accessibility/state attribute.
- Expected behavior: The test should verify selection state without depending on visual styling.
- Root cause: `TraitNav` exposed active trait visually but not semantically.
- Proposed harness change: Add `aria-current="true"` to the active trait button and assert that in the URL-sync Playwright test.
- Change type: test
- Acceptance test: `npm run test:e2e` and `npm run validate` pass.
- Status: accepted

### 2026-06-12 - URL Sync Lacked Browser Coverage

- Task: Cover `App` state and URL synchronization in the browser harness.
- What happened: The E2E harness checked default rendering and clicks, but did not verify non-default `?trait=...&pole=...&view=...` initialization or URL updates after UI changes.
- Expected behavior: Browser validation should catch regressions in query parsing and `history.replaceState` synchronization.
- Root cause: URL sync was treated as app logic but had no user-flow E2E assertion.
- Proposed harness change: Add a dev-mode Playwright test that opens a non-default URL, verifies selected trait/pole/view in the UI, changes them, and verifies the URL updates.
- Change type: test
- Acceptance test: `npm run test:e2e` and `npm run validate` pass.
- Status: accepted

### 2026-06-12 - Dist Smoke Could Hang Or Overfit HTML

- Task: Harden the production `dist` smoke check.
- What happened: `scripts/smoke-dist.mjs` used unbounded fetch/shutdown waits and required the exact `<div id="root"></div>` string.
- Expected behavior: The smoke check should fail within bounded time and tolerate harmless root div formatting changes.
- Root cause: Initial smoke implementation optimized for the happy path only.
- Proposed harness change: Add fetch timeouts, bounded preview-server shutdown, and a less brittle root div matcher.
- Change type: check
- Acceptance test: `npm run smoke:dist` and `npm run validate` pass.
- Status: accepted

### 2026-06-12 - Dist Smoke Did Not Execute Built Bundle

- Task: Strengthen production artifact coverage after adding the `dist` base-path smoke check.
- What happened: `npm run smoke:dist` verified the production HTML and fetched generated assets, but did not run the built JavaScript in a real browser.
- Expected behavior: Validation should catch production-only browser crashes, bundle execution failures, and console/page errors from the built app under `/reinin-invariants/`.
- Root cause: The production artifact check used HTTP fetches only, while the browser E2E check still exercised the dev server.
- Proposed harness change: Add a dedicated Playwright production-preview test that serves the built `dist` with Vite preview, opens `/reinin-invariants/`, checks key UI, and fails on browser console or page errors.
- Change type: check
- Acceptance test: `npm run validate` runs `npm run test:e2e:preview` after `npm run build` and passes.
- Status: accepted

### 2026-06-12 - Validate Skipped Built Dist Base Path

- Task: Add production artifact coverage to the repository validation harness.
- What happened: `npm run validate` built production output, but the runtime smoke and browser checks exercised dev-mode servers instead of the built `dist` artifact under the GitHub Pages base path.
- Expected behavior: Validation should catch deploy-only failures such as missing production assets or incorrect `/reinin-invariants/` base-path references before publishing.
- Root cause: The harness had no post-build check that requested the generated production HTML and assets from `dist`.
- Proposed harness change: Add `npm run smoke:dist` after `npm run build`; serve the built artifact with Vite preview, request `/reinin-invariants/`, and verify the root HTML plus generated JS/CSS assets load under that base path.
- Change type: check
- Acceptance test: `npm run validate` runs `npm run smoke:dist` immediately after `npm run build` and passes.
- Status: accepted

### 2026-06-12 - Deploy Skipped Full Harness Validation

- Task: Align GitHub Pages deployment with the repository validation harness.
- What happened: The deploy workflow ran only type-check and build before publishing.
- Expected behavior: Deployment should use the same deterministic validation gate documented in `AGENTS.md`.
- Root cause: `.github/workflows/deploy.yml` duplicated a subset of checks instead of calling `npm run validate`.
- Proposed harness change: Replace the separate type-check and build workflow steps with one `npm run validate` step.
- Change type: workflow
- Acceptance test: `.github/workflows/deploy.yml` contains a `Validate` step that runs `npm run validate`, and no longer has separate deploy-time `npm run lint` / `npm run build` steps.
- Status: accepted

### 2026-06-12 - Validate Gate Lacked Render Coverage

- Task: Add a stronger harness gate after unifying deployment validation.
- What happened: The first harness gate verified TypeScript, tests, build, audit, and a Vite HTML response, but did not prove the React app could render its default UI surface.
- Expected behavior: Validation should catch a broken React render before deploy.
- Root cause: The initial smoke check only verified the static Vite response and root mount point.
- Proposed harness change: Add a server-render smoke check that renders `App` and verifies traits, aspects, functions, and the default selection are present.
- Change type: check
- Acceptance test: `npm run validate` runs `npm run smoke:render` and passes.
- Status: accepted

### 2026-06-12 - Render Smoke Was Self-Referential For Russian Text

- Task: Validate the clean-context harness review finding.
- What happened: `scripts/render-smoke.tsx` checked rendered text using values imported from `src/data/socionics.ts`, so corrupted Russian text in the source data could still satisfy the check.
- Expected behavior: The harness should catch obvious mojibake or replacement-character corruption in key Russian UI/domain strings.
- Root cause: Expected strings came only from the same data source being validated.
- Proposed harness change: Add a small list of canonical Russian text markers and assert that rendered HTML does not contain Unicode replacement characters.
- Change type: check
- Acceptance test: `npm run smoke:render` and `npm run validate` pass with canonical text checks enabled.
- Status: accepted

### 2026-06-12 - Harness Lacked Browser-Level UI Coverage

- Task: Add a real browser gate for the React interface.
- What happened: The harness had unit tests, SSR render smoke, and Vite HTML smoke, but no check that Chromium loads the app, runs the JS bundle, renders key UI, handles clicks, and preserves a visual baseline.
- Expected behavior: Validation should catch browser-only render failures, console errors, and large visual regressions on desktop and mobile.
- Root cause: Browser E2E coverage had not been installed yet.
- Proposed harness change: Add Playwright with desktop and mobile Chromium projects, role-based UI assertions, click checks, console-error collection, and screenshot snapshots.
- Change type: check
- Acceptance test: `npm run test:e2e` and `npm run validate` pass.
- Status: accepted
