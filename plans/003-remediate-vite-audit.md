# Plan 003: Remediate Vite and PostCSS audit findings

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report instead of improvising.
>
> **Drift check (run first)**: `git status --short -- package.json package-lock.json vite.config.ts`
> Baseline is "unborn HEAD / no commits" on 2026-06-11. If the cited current-state excerpts below no longer match, stop and refresh this plan before editing.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-add-characterization-tests.md` recommended
- **Category**: security
- **Planned at**: no commit, unborn HEAD, 2026-06-11

## Why This Matters

`npm audit` reports a high-severity Vite dev-server arbitrary file read issue for the installed dependency tree. This app's dev server is configured with `--host=0.0.0.0`, so local network exposure matters more than it would for a loopback-only dev server. The available `vite@6.4.3` is within the existing package range, so remediation should be a small lockfile update rather than a major migration.

## Current State

- `package.json:7` exposes the dev server on all interfaces:

```json
"dev": "vite --configLoader runner --port=3000 --host=0.0.0.0"
```

- `package.json:29` allows Vite `^6.2.0`:

```json
"vite": "^6.2.0"
```

- `package-lock.json:2614-2616` currently resolves Vite to the vulnerable installed version:

```json
"node_modules/vite": {
  "version": "6.4.1",
```

- Advisor ran `npm.cmd audit --json`. It reported:
  - `vite` high severity via "Vite Vulnerable to Arbitrary File Read via Vite Dev Server WebSocket", range `>=6.0.0 <=6.4.1`
  - `vite` moderate severity via optimized deps `.map` path traversal, range `<=6.4.1`
  - `postcss` moderate severity, range `<8.5.10`
- Advisor ran `npm.cmd outdated --json`. It reported `vite` current `6.4.1`, wanted `6.4.3`, latest `8.0.16`; `@tailwindcss/vite` wanted `4.3.0`; `tailwindcss` wanted `4.3.0`; `autoprefixer` wanted `10.5.0`.

## Commands You Will Need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Update within current ranges | `npm.cmd update vite postcss @tailwindcss/vite tailwindcss autoprefixer` | exit 0; lockfile changes |
| Audit | `npm.cmd audit --audit-level=high` | exit 0, no high or critical vulnerabilities |
| Typecheck | `npm.cmd run lint` | exit 0, no TypeScript errors |
| Tests | `npm.cmd test` | exit 0, all tests pass |
| Build | `npm.cmd run build` | exit 0; writes `dist/` |

## Scope

**In scope**:
- `package.json`
- `package-lock.json`
- `vite.config.ts` only if Vite 6.4.x requires a small config adjustment

**Out of scope**:
- Do not migrate to Vite 8 in this plan.
- Do not change React, Motion, or Lucide major versions.
- Do not redesign the dev server workflow unless the audit cannot be cleared by patch/minor updates.
- Do not edit application source files.

## Git Workflow

- Branch: `codex/003-remediate-vite-audit`
- Commit message style: no existing history. Use a clear imperative message such as `chore: update vite toolchain for audit`.
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Update the vulnerable toolchain within existing ranges

Run:

```powershell
npm.cmd update vite postcss @tailwindcss/vite tailwindcss autoprefixer
```

Check `package-lock.json` afterward. Vite should be above `6.4.1`; PostCSS should be at or above `8.5.10`.

**Verify**: `npm.cmd audit --audit-level=high` exits 0. If moderate PostCSS advisories remain but high Vite advisories are gone, record the remaining moderate advisory in this plan's status update and continue only if the maintainer accepts that residual risk.

### Step 2: Re-run project checks

Run the normal project checks after the dependency update.

**Verify**:

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

All three exit 0.

### Step 3: Reconsider dev server host exposure

Because the current `dev` script binds to `0.0.0.0`, decide whether this is intentional. If the app is only developed locally, change it to host `127.0.0.1`. If LAN testing is required, keep it but add a clear README note that the dev server is network-accessible.

Prefer the smallest change:

- local-only: `"dev": "vite --configLoader runner --port=3000 --host=127.0.0.1"`
- LAN-needed: keep the script and document the exposure

**Verify**: `npm.cmd run lint` exits 0.

## Test Plan

- This is a dependency/security plan, so the test plan is the existing verification baseline.
- Required final checks: `npm.cmd audit --audit-level=high`, `npm.cmd run lint`, `npm.cmd test`, and `npm.cmd run build`.

## Done Criteria

- [ ] `package-lock.json` no longer resolves Vite to `6.4.1` or any version in the vulnerable Vite ranges.
- [ ] `package-lock.json` no longer resolves PostCSS below `8.5.10`, unless npm cannot resolve a non-vulnerable version and the maintainer accepts the residual moderate advisory.
- [ ] `npm.cmd audit --audit-level=high` exits 0.
- [ ] `npm.cmd run lint` exits 0.
- [ ] `npm.cmd test` exits 0.
- [ ] `npm.cmd run build` exits 0.
- [ ] `git status --short` shows only in-scope files changed.
- [ ] `plans/README.md` status row for 003 is updated.

## STOP Conditions

Stop and report if:

- Clearing the audit requires a major Vite migration.
- Vite 6.4.x breaks the existing `vite.config.ts` behavior.
- `npm.cmd update` changes broad unrelated production dependencies.
- The maintainer requires `--host=0.0.0.0` and no documentation change is acceptable.

## Maintenance Notes

Keep `npm audit --audit-level=high` in the release checklist or CI once CI exists. Dev-server vulnerabilities still matter when scripts bind to all interfaces.
