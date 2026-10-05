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

### 2026-10-04 - Lower Model A Previews Lost Overlapping Invariants

- Task: Inspect transferred tetrachotomy invariants and their rendering on the four models below each selected tetrad.
- What happened: The main source diagram preserved both function memberships, but the lower preview selector still used `rows.findIndex` on function position alone. All twelve order-dependent formulas collapsed to two source colors; 768 of 1536 participating cells selected the wrong aspect dyad and were muted. A browser audit reproduced this across all 35 formulas / 140 tetrads. The lower renderer also receives only the first basis pole's first view: the process cycle disappears for 10/17, and 05/26/27 show only one constituent condition despite a three-pole heading.
- Expected behavior: A model cell's color must follow its actual aspect's valid source row; every participating aspect retains its intended contrast. Complete block, equivalence and cycle conditions must be available on the four models, or the panel must explicitly identify the partial projection.
- Root cause: The multi-membership fix covered the main diagram but not `selectTypeModelPreviewsForSourceRows`; lower-model semantics were not included in the previous browser assertions.
- Proposed harness change: Add a lower-model regression for every formula and tetrad, comparing each rendered aspect/function pair to its source dyad, requiring all four dyad colors and full participating contrast for the twelve order-dependent formulas. Assert process-condition availability independently of basis ordering and exercise every constituent view for unbound formulas.
- Change type: test | check
- Acceptance test: 35 formulas / 140 tetrads / 560 models have correct aspect placements and selected invariant memberships; no participating order-dependent aspect is incorrectly muted; 10/17/30/34 expose process conditions and 05/26/27 expose all constituent conditions.
- Status: proposed; inspection only, application code unchanged. Evidence: scratch/tetrachotomy-inspection/model-audit.json, browser-audit.json and desktop/mobile screenshots.

### 2026-10-04 - Overlapping Source Rows and Duplicate Sibling Keys

- Task: Add the twelve author-defined order-dependent `(2×4)×4` tetrachotomies.
- What happened: A single function-to-row map would overwrite one of two valid memberships. The first browser run also exposed duplicated source panels after tetrad changes because source and order siblings shared the same React key. Mobile focus assertions exposed pointer-hover events overriding keyboard focus during scrolling. A notation registry initially attached the positivism formula labels to the wrong IDs.
- Expected behavior: Preserve all row memberships and exact formula labels; render one source panel and one order panel after every tetrad switch; preserve the active keyboard target.
- Root cause: Applying a disjoint-row representation to overlapping function tetrads, reusing an identical sibling key, merging focus and hover into one state, and validating order-trait membership without checking all three displayed traits.
- Proposed harness change: Keep the exact-label registry regression and the full four-tetrad order-dependent browser matrix, including shared-function memberships and focused-aspect/function highlighting. Use distinct key namespaces and separate focus/hover state.
- Change type: test | rule
- Acceptance test: `orderDependentTetrachotomies.test.ts` matches all three displayed traits to each source formula; `order-dependent.spec.ts` passes all twelve formulas on desktop/mobile in both themes, with four rows per panel, two memberships per function, and focus highlighting all four eligible functions or both dyads.
- Status: resolved; 24 order-dependent browser tests pass.

### 2026-10-02 - Literal Source Equality Did Not Validate Aspect Placements

- Task: T4A.2, finish simple tetrachotomy source-row transfer after author confirmation of two group corrections.
- What happened: The existing `tetra-28` rows passed formula-scoped DOCX transcription audit while contradicting Model A for 32 aspect placements in rational tetrads. New `tetra-07`/`tetra-13` placements passed independent checks; the defect predates this transfer.
- Expected behavior: Report transcription and semantic correctness separately; preserve primary text until the author approves a correction.
- Root cause: Previous provenance tests validated registered IDs, groups and source equality without checking each aspect's allowed function position for every type in its tetrad.
- Proposed harness change: Add independent Model A placement diagnostics and a regression that limits known source defects to the explicitly tracked `tetra-28` cases. Author-approved group corrections must retain literal provenance and a narrow allowlist.
- Change type: test | check | workflow
- Acceptance test: after the author-approved `tetra-28` correction, `getSourceModelAssignmentMismatches()` returns no mismatches for all transferred formulas; literal source equality and exact four-tetrad classification pass independently. Unauthorized group corrections and normalized-source substitution remain rejected.
- Status: resolved by T4A.2-review on 2026-10-03; the four approved left-side corrections are applied to app data and the working DOCX, with the original document preserved in Git `70acb99`.

### 2026-10-02 - Aspect-Feature Terms Misread as Type Quadras

- Task: Clarify the source-derived invariant row cards.
- What happened: A UI proposal separated «Дельта, Альфа» as quadra names rather than preserving them as aspect-feature names. The user corrected the interpretation before implementation.
- Expected behavior: Preserve the source aspect-feature terms, defined through quadra values. Their explanation belongs in separately reviewed theory-introduction materials, not in the invariant card.
- Root cause: Familiar quadra names were interpreted without checking the carrier of the displayed property.
- Proposed harness change: For theory-bearing labels, identify the carrier (aspect, function, type) before grouping or rewriting; preserve author definitions and test the confirmed rendering.
- Function-terminology follow-up: the shared function registry exposed `isMental` as «Статичная / Динамичная», and the new reference page repeated that convention. Corrected the functional poles to «Ментальная / Витальная» while preserving aspect statics/dynamics and all Boolean assignments. `src/data/functionTerminology.test.tsx` now checks labels, tooltips, equivalence text and reference sections; browser regressions verify both carriers separately in both themes and device projects.
- Change type: rule | test
- Acceptance test: `separates source features without reclassifying quadra-value aspect terms` and the source-row browser scenario preserve the aspect labels alongside other aspect properties. E10.1 defers definitions to author-approved introductory content.
- Status: accepted

### 2026-10-02 - DOCX Audit Accepted Rows From Other Formula Sections

- Task: Review and commit the source-derived tetrachotomy transfer.
- What happened: Formula references inside sections changed extraction ownership, while a cross-formula type-group fallback masked the resulting attribution errors. Cyrillic `с` section markers were also omitted from heading recognition.
- Expected behavior: Each extracted block belongs to the current genuine formula heading; an audit match requires the same formula ID, type group and row signatures.
- Root cause: An unanchored formula-number regex and a permissive cross-formula fallback; existing tests checked totals and formula presence without validating section ownership.
- Proposed harness change: Require section-scoped provenance tests for every transferred formula and a negative regression case where matching rows are reassigned to another formula.
- Change type: test | check
- Acceptance test: Ownership regression and cross-formula rejection tests pass; all 11 bound formulas pass the strict audit; deferred tetra-07/tetra-13 remain unbound.
- Status: accepted

### 2026-10-02 - Diagram Priority Did Not Guarantee Initial Mobile Viewport

- Task: X2.5, put existing diagrams ahead of supporting material.
- What happened: Reordering diagrams above patterns passed SSR ordering tests, but the first mobile browser run still placed the dichotomy diagram outside the initial viewport. Header/control panels consumed vertical space and the fixed theme panel covered content.
- Expected behavior: The primary diagram should intersect the initial viewport without scrolling on supported desktop/mobile layouts; optional settings should not obscure it.
- Root cause: DOM ordering and element visibility do not measure initial viewport priority or obstruction by fixed overlays.
- Proposed harness change: Keep route-specific `toBeInViewport()` assertions for dichotomy and source tetrachotomy, check mobile catalog placement, and review desktop/mobile snapshots with optional views collapsed.
- Change type: test | workflow
- Acceptance test: `prioritizes diagrams and keeps supporting views optional` passes in both Chromium projects and compact selections preserve URL state.
- Reference-navigation follow-up: a separate header row shifted existing mobile snapshots by 50 px. Keeping the reference link alongside the existing introduction summary restored the unchanged app/type snapshots in both browser projects. Check existing primary-view screenshots after adding global navigation; do not regenerate baselines merely to accept an avoidable header-height increase.
- Status: accepted

### 2026-10-02 - Dependency Audit Blocks UI Release Gate

- Task: Run full validation after X2.5.
- What happened: Type checking, 99 unit tests, production build, asset smoke and production browser preview passed; unified validation stopped at dependency audit with 7 vulnerabilities (1 low, 3 moderate, 3 high).
- Expected behavior: Full release validation requires the existing moderate-severity audit gate to pass; UI test success must not be reported as a successful full gate.
- Root cause: The installed dependency tree has advisories affecting Babel, Vitest mocker, baseline-browser-mapping, browserslist, nanoid and PostCSS. Package versions and lockfile were not changed by this UI task.
- Proposed harness change: Resolve dependency updates in a separate scoped maintenance task, then rerun `npm run validate`. Do not suppress the audit threshold to close unrelated UI work.
- Change type: workflow
- Acceptance test: `npm run validate` reaches `All validation checks passed.` after dependency remediation.
- Follow-up (2026-10-03, tetrachotomy chooser): the unchanged dependency tree again blocks `npm run validate` at the same audit gate. Type checking, 115 unit tests, build and production preview checks pass. Separate dev-browser checks pass 45 of 46 cases; the remaining mobile full-page snapshot differs and requires review independently of dependency maintenance.
- Status: proposed

### 2026-06-25 - Diagram Design Decided Without User Review

- Task: Add the first source-derived tetrachotomy aspect-to-function diagram.
- What happened: The implementation chose a concrete visual form for an important theoretical diagram during execution, after the general direction was known but before the user reviewed the exact diagram model.
- Expected behavior: For important diagrams and theory-bearing UI, the agent should first present the intended diagram model to the user in plain terms and wait for confirmation before implementing the visual shape.
- Root cause: The harness emphasized source truth and validation, but did not require a user review checkpoint for high-impact explanatory diagrams.
- Proposed harness change: Add a theory-diagram approval checkpoint: before implementing or materially changing diagrams that encode socionics logic, state the proposed diagram objects, direction of arrows, labels, grouping rule and unsupported cases, then ask for user confirmation. Small style-only changes and already-confirmed diagram extensions do not need this checkpoint.
- Change type: workflow | documentation
- Acceptance test: Future tasks that add or redesign source-derived diagrams stop before implementation with a concise proposal unless the user has already approved that exact diagram shape in the current context.
- Status: accepted

### 2026-06-24 - Tetrachotomy UI Task Misalignment

- Task: Refine the tetrachotomy screen so the main focus is the question: what all representatives of one tetrad share in Model A.
- What happened: The previous UI pass added and emphasized blocks that visualized source formulas as trait-pole intersections, type groups, composition, pattern maps, class lists and selected-class Model A previews. These pieces were useful as supporting materials, but they duplicated each other and did not answer the main question about how aspects map into functions for the whole tetrachotomy formula.
- Expected behavior: Before adding more tetrachotomy UI, the agent should align on the primary explanatory target: the shared Model A invariant of a selected tetrad, especially aspect/function mapping across the full formula, not only type-class membership.
- Root cause: Task misalignment. The agent interpreted "visualize formulas in detail" as "show the computed partition/classes in more detail" instead of "show the socionics element logic behind the formula." This led to executing the wrong task and making secondary classification views more prominent than the core aspect-to-function explanation.
- Proposed harness change: Add a frontend/theory alignment check for formula UI tasks: identify the user's primary question in one sentence, classify each proposed screen block as primary/supporting/advanced, and put supporting or duplicated material behind collapsed sections unless the user asks for it as the main view.
- Change type: workflow | documentation
- Acceptance test: Future tetrachotomy UI work keeps `Источник` and the main aspect/function explanation visible by default, while `По шагам`, `Паттерны`, `Композиция`, `Классы тетрахотомии` and type-group diagnostics remain secondary or collapsed unless explicitly promoted by the user.
- Status: accepted

### 2026-06-24 - Playwright Screenshot Font Wait Timeout

- Task: Validate tetrachotomy formula UI changes with browser screenshots.
- What happened: `npm run test:e2e` twice reached unrelated `toHaveScreenshot` checks and timed out while waiting for fonts to load within the default 5000 ms matcher timeout.
- Expected behavior: Existing full-page screenshot checks should allow enough bounded time for Windows font readiness without weakening visual comparison.
- Root cause: The screenshot matcher used the default timeout, which was too tight for occasional Windows font-load stabilization under parallel Playwright load.
- Proposed harness change: Set an explicit 15000 ms timeout on full-page screenshot assertions while keeping `maxDiffPixelRatio` unchanged.
- Change type: check
- Acceptance test: `npm run test:e2e` no longer fails on the repeated `waiting for fonts to load` timeout in the unchanged screenshot surfaces.
- Status: accepted

### 2026-06-15 - Worker Wrote Mojibake UI Literals

- Task: Implement C4.2 Partition Explorer chooser with Russian user-facing labels.
- What happened: The worker added `src/components/PartitionChooser.tsx` with mojibake Russian UI literals such as `РўРµ...` and `РџРѕ...`.
- Expected behavior: New Russian user-facing strings should be written as valid UTF-8 and reviewed before handoff.
- Root cause: The UTF-8 rule covered shell output, but the worker did not apply an explicit post-edit scan for newly added Russian literals.
- Proposed harness change: Add a narrow pre-handoff check for touched text-bearing files: scan diffs for common mojibake markers (`Р`, `С`, replacement characters) before claiming completion.
- Change type: check
- Acceptance test: A future task that adds Russian UI text fails pre-handoff review if the diff contains mojibake markers in user-facing literals.
- Status: proposed

### 2026-06-15 - Preflight Rules Applied Too Late

- Task: Continue from `Recommended Next Step` as orchestrator.
- What happened: The agent read `tasks.md` once through Windows PowerShell without the UTF-8 prefix even though `AGENTS.md` already documented the encoding rule, producing mojibake in command output. The agent also first attempted `git add` inside a sandbox where `.git` metadata was read-only, then retried with escalation.
- Expected behavior: Apply known lightweight preflight rules on the first attempt: attach the UTF-8 setup to PowerShell commands that print repository text, and request scoped escalation before git metadata writes when `.git` is read-only.
- Root cause: The rules were documented, but framed too generally. The agent treated them as situational reminders instead of concrete first-attempt command habits.
- Proposed harness change: Strengthen `AGENTS.md`, `harness/README.md`, and `task-template.md` with narrow first-attempt rules for PowerShell text output and git metadata writes.
- Change type: rule | workflow | documentation
- Acceptance test: A new session reads Cyrillic repository files without mojibake on the first print command, and does not produce a predictable sandbox failure before `git add` or `git commit` when `.git` is read-only.
- Status: accepted

### 2026-06-15 - Dev E2E Port 3002 Occupied

- Task: Validate D3.1 dichotomy detail path changes.
- What happened: `npm run test:e2e` could not start its strict-port Vite server because `127.0.0.1:3002` was already occupied by an existing `node` process. This made `npm run validate` ambiguous even though the already-running server could serve the app.
- Expected behavior: Agents should handle an occupied e2e port deterministically without killing unknown user processes or claiming full validation passed when the strict-port runner could not start normally.
- Root cause: The harness had strict-port e2e to avoid stale server reuse, but no explicit operating rule for a pre-existing server on the same port.
- Proposed harness change: Document a dev e2e port rule: do not stop unknown PIDs without explicit user confirmation; verify whether `http://127.0.0.1:3002/reinin-invariants/` is the current Vite app; if verified, run Playwright with `PLAYWRIGHT_EXTERNAL_SERVER=1`; otherwise ask the user to free the port.
- Change type: rule | workflow | documentation
- Acceptance test: `npm run test:e2e` automatically reuses a verified existing Vite dev server on `3002`; if the port is occupied by something else, it stops with an explanatory error before touching the process.
- Status: accepted

### 2026-06-14 - New Frontend Surface Lacked Visual Coverage

- Task: Add and refine a new user-facing frontend surface.
- What happened: `npm run validate` passed while the newly changed screen still had a visible UI regression, because screenshot coverage existed only for an older/default screen.
- Expected behavior: When a task adds or materially changes a frontend surface, validation should exercise that exact changed surface with browser-level semantic assertions and, when layout/visual presentation is part of the task, a screenshot baseline.
- Root cause: The e2e harness had a default-screen visual snapshot and broad navigation checks, but no rule tying frontend task scope to coverage of the newly changed screen.
- Proposed harness change: For each frontend task, add or update the smallest Playwright coverage that opens the changed route/state, asserts the user-visible requirements from the task, and stores desktop/mobile screenshots when the visual layout is newly introduced or materially changed.
- Change type: test
- Acceptance test: `npm run validate` fails if a newly introduced or materially changed frontend surface is not covered by route/state-specific browser assertions, and fails on visual regressions for surfaces whose layout was part of the task.
- Status: accepted

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

### 2026-10-02 - Narrow Panel Layout Was Coupled to Viewport Breakpoints

- Task: Improve invariant diagrams and source-row cards on mobile and in the desktop preview pane.
- What happened: Device-based browser projects passed while source rows still switched to tall vertical stacks too early and a narrow panel in a wide viewport retained an unsuitable header layout. A compact-card iteration also split a property word across lines.
- Expected behavior: Layout follows the component's available width, keeps grouped arrows meaningful and preserves complete property words and labels.
- Root cause: Responsive classes depended on viewport width; tests did not constrain the panel independently or inspect word wrapping.
- Proposed harness change: Test explicit panel widths from 260 to 640 px, arrow orientation, compact tile dimensions, column alignment, overflow, full-width headings, intact feature words and combined glyph bounds.
- Change type: test
- Acceptance test: New regressions pass in both browser projects; standalone full Playwright run passes without snapshot updates.
- Status: accepted; 36 tests passed with two workers. Avoid overlapping the final visual comparison run with build validation after observed screenshot/font-load timeouts under concurrent load.

### 2026-10-02 - Compactness Fix Missed the Ordinary Trait Renderer

- Task: Prevent excessively stretched invariant tiles across application modes.
- What happened: Tetrachotomy width tests passed, but ordinary trait diagrams still used unbounded grids. The user's next screenshot exposed the unchanged renderer.
- Root cause: The fix and regression coverage were scoped to one of two components displaying aspect/function mappings.
- Proposed harness change: Exercise actual renderer paths separately; assert bounded grid widths and orientation in both narrow viewports and narrow panels inside wide viewports, including the cycle-decorated variant.
- Acceptance test: A regression reproduces the 646 px aspect grid before implementation and passes after applying the 384/320 px grid caps.
- Status: accepted; verified on desktop and touch projects.

### 2026-10-02 - Remote Fonts Make Visual Tests Non-Deterministic

- What happened: A full run still hit a screenshot font-wait timeout with a single worker and no simultaneous build. An unchanged isolated rerun passed.
- Evidence: Failure trace records successful but slow requests to `fonts.googleapis.com` and `fonts.gstatic.com`; some requests take longer than the screenshot assertion's 5000 ms timeout.
- Proposed harness change: Provide deterministic local or test-cached copies of the same font assets; retain actual font rendering and pixel comparisons rather than disabling font waits or silently switching to fallback fonts.
- Status: proposed, not implemented in this width-only fix. Reduced worker counts mitigate load but do not remove the external-font dependency.
