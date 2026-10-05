# Project Harness

This folder holds the repo-local AI harness: validation entrypoints, failure notes, and future workflow helpers.

Current harness:

- `npm run validate` runs all deterministic checks.
- `npm run smoke:render` renders the React app through `react-dom/server` and verifies the default UI/data surface.
- `npm run smoke` starts the Vite dev server, requests the local page, and verifies the app root is present.
- `npm run audit:tetra-docx` extracts direct `->` tetrachotomy source rows from `harness/theory/tetrachotomy-source.docx` and compares current `sourceBlocks` with the DOCX rows.
- `npm run test:e2e` opens the app in Chromium desktop and mobile viewports, checks key UI controls, captures a screenshot snapshot, and fails on browser console errors.
- `harness/failure-log.md` records recurring agent failures and proposed harness fixes.

Tetrachotomy DOCX audit rule:

- Run `npm run audit:tetra-docx` after editing `scripts/audit-tetrachotomy-docx.ts` or any `TetrachotomyFormulaRecord.sourceBlocks` in `src/data/tetrachotomies.ts`.
- `docx-ok` means every current source block for that formula has a matching DOCX direct-row group and matching row signatures within that formula's own section. Paired-formula references do not change section ownership; matches in another formula cannot satisfy this check.
- `groups-ok` means the current source block type groups match the formula's extracted `typeIds` groups.
- `tetra-07` and `tetra-13` use extract groups explicitly confirmed by the author on 2026-10-02. `sourceGroupCorrection` preserves the literal DOCX group, confirmed group, formula ID and confirmation attribution/date. Only the two registered corrections are allowed; the audit still requires exact rows in the original formula section and literal source group.
- `docx-rows-ok; author-confirmed-groups=1` distinguishes corrected group binding from literal group equality. The separately printed extract/DOCX differences are retained intentionally for these approved cases. Never normalize the extractor output to conceal a correction.
- `docx-mismatch`, `groups-mismatch`, or unapproved source-group differences mean stop before binding those rows. Do not infer a basis/source mapping from similar-looking groups.
- Model A placement diagnostics are independent of `docx-ok`. All 32 transferred formulas have zero placement mismatches: 13 simple formulas, seven cracy formulas, and twelve order-dependent `(2×4)×4` formulas. The three remaining fallbacks are `05`, `26`, `27`; membership in a structural class alone does not certify literal transfer.
- The author approved direct correction of four rational `tetra-28` row left sides on 2026-10-03; the original DOCX was verified in Git `70acb99` and the repeatable check is `plans/roadmap/tetra-28-review/verify.ts`. On 2026-10-04 the author also approved correcting `tetra-31`'s third group from `ЭСЭ ЛСЭ ИЛИ ИЭЭ` to `ЭСЭ ЛСИ ИЛИ ИЭЭ` in the primary DOCX. Its pre-correction document is preserved in Git `3ee9391`; only that heading token and `word/document.xml` changed. Both direct corrections agree with app data and require no new application-only correction metadata.
- Order-dependent source rows preserve four disjoint aspect dyads and four overlapping function tetrads. The two-position image of a dyad is contained in its four-position block; it is not equal to that block. Retain all row memberships of a shared function in highlighting and accessibility text. Show the process cycle or both positivism/asking equivalences separately after the source diagram.
- The audit CLI prints diagnostics; exit zero alone does not establish semantic correctness. Read the placement report and run `npm test` before claiming readiness.

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
