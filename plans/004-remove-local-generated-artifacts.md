# Plan 004: Remove local and generated artifacts from repo scope

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report instead of improvising.
>
> **Drift check (run first)**: `git status --short -- .gitignore .claude assets index.html package.json vite.config.ts`
> Baseline is "unborn HEAD / no commits" on 2026-06-11. If the cited current-state excerpts below no longer match, stop and refresh this plan before editing.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: none
- **Category**: security / dx
- **Planned at**: no commit, unborn HEAD, 2026-06-11

## Why This Matters

The repo currently contains local Claude settings and root-level generated assets. The local settings include broad command allow rules and machine-specific paths; those should not become part of shared source control. The root `assets/` bundle can drift from `src/` and `dist/`, making it unclear which files are source, build output, or deployment output.

## Current State

- `.gitignore:1-8` ignores common generated files but not `.claude/` or root `assets/`:

```gitignore
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example
```

- `.claude/settings.local.json:6-7` allows broad npm commands:

```json
"Bash(npm run *)",
"Bash(npm install *)",
```

- `.claude/settings.local.json:23-34` includes local machine paths and destructive/copy deployment commands, including `rm -rf assets`, `rm -f index.html`, and copies from `C:\\Serge\\...` / `/c/Temp/...`.
- `.claude/launch.json:5-14` is a small launcher config for Vite dev/preview and may or may not be intended as shared project config.
- Root `assets/` contains generated bundle files:
  - `assets/index-CNIit8k9.js` about 362 KB
  - `assets/index-Cva5YbJP.css` about 32 KB
- `README.md` states the build output is `dist/`, not root `assets/`.

## Commands You Will Need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Inspect status | `git status --short -- .claude assets .gitignore` | shows intended ignore/removal state |
| Typecheck | `npm.cmd run lint` | exit 0, no TypeScript errors |
| Tests | `npm.cmd test` | exit 0, all tests pass if Plan 001 landed |
| Build | `npm.cmd run build` | exit 0; writes `dist/` |

## Scope

**In scope**:
- `.gitignore`
- `.claude/settings.local.json`
- `.claude/launch.json` only if deciding whether to keep or ignore it
- `assets/`
- Optional: `README.md` if documenting deployment source of truth

**Out of scope**:
- Do not change app behavior.
- Do not change `index.html` unless you confirm root `assets/` was being used by a deployment process and needs a documented replacement.
- Do not add a full CI/deployment workflow in this plan.
- Do not delete files outside `.claude/settings.local.json` and root `assets/`.

## Git Workflow

- Branch: `codex/004-remove-local-generated-artifacts`
- Commit message style: no existing history. Use a clear imperative message such as `chore: ignore local settings and generated assets`.
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Decide the intended source-control policy for `.claude/`

Recommended policy:

- Keep `CLAUDE.md` at the repo root because it contains shared contributor guidance.
- Do not track `.claude/settings.local.json`.
- Either ignore only `.claude/settings.local.json`, or ignore `.claude/` entirely if `.claude/launch.json` is also personal tooling.

Update `.gitignore` with the narrowest rule that matches the decision. A safe default is:

```gitignore
.claude/settings.local.json
```

If `.claude/launch.json` is not intentionally shared, use:

```gitignore
.claude/
```

**Verify**: `git status --short -- .claude .gitignore` shows `.claude/settings.local.json` no longer as a trackable new file after ignore rules are applied.

### Step 2: Remove local settings from tracked candidates

If `.claude/settings.local.json` is already tracked, remove it from the index but keep the local file:

```powershell
git rm --cached .claude/settings.local.json
```

If the file is untracked, do not delete it unless the maintainer asked you to; the ignore rule is enough.

**Verify**: `git status --short -- .claude/settings.local.json` does not show a staged or unstaged tracked change for that file.

### Step 3: Decide the source of truth for generated root assets

Recommended policy:

- Treat `dist/` as build output, because README already says `npm run build` writes to `dist/`.
- Treat root `assets/` as generated deployment output and do not track it.

Add `assets/` to `.gitignore` only if the maintainer confirms root `assets/` is not a required committed GitHub Pages artifact. If it is required for GitHub Pages, stop and ask for a deployment plan instead of deleting or ignoring it.

**Verify**: `git status --short -- assets .gitignore` shows root `assets/` no longer as trackable source if ignored.

### Step 4: Document deployment source of truth if needed

If there was confusion about root `assets/`, update `README.md` with one sentence under build/deploy explaining that generated output comes from `npm run build` into `dist/` and root `assets/` is not source. Skip this step if the `.gitignore` change is self-explanatory for the maintainer.

**Verify**: `npm.cmd run lint` exits 0.

## Test Plan

- This plan should not change app runtime behavior.
- Run `npm.cmd run lint`.
- If Plan 001 has landed, also run `npm.cmd test`.
- If root assets policy changed, run `npm.cmd run build` to confirm generated output still goes to `dist/`.

## Done Criteria

- [ ] `.claude/settings.local.json` is ignored or otherwise removed from source-control scope.
- [ ] Root `assets/` policy is explicit: ignored as generated output, or preserved with documented reason.
- [ ] `.gitignore` reflects the chosen policy.
- [ ] No local-only command allowlist is staged for commit.
- [ ] `npm.cmd run lint` exits 0.
- [ ] `npm.cmd test` exits 0 if Plan 001 has landed.
- [ ] `npm.cmd run build` exits 0 if root asset policy changed.
- [ ] `plans/README.md` status row for 004 is updated.

## STOP Conditions

Stop and report if:

- The maintainer says root `assets/` is the required production deployment target.
- `.claude/settings.local.json` contains secrets. Do not quote secret values; report only the file path and credential type.
- Removing or ignoring local artifacts requires changing deployment behavior.
- The code at the cited current-state locations no longer matches this plan.

## Maintenance Notes

Local tool settings should stay local unless intentionally documented as shared project configuration. Generated deployment output should have one source of truth; if GitHub Pages needs root files, prefer an explicit deploy workflow over copying build artifacts into source by hand.
