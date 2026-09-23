# PR #2247 — Context for New Session

## What this PR does

Migrates all GitHub Actions workflows from shared `sap/cloud-sdk-js/.github/actions/*@main` references to local inline actions within `sap/ai-sdk-js`. Also updates pnpm to v12 and adds `devEngines.packageManager` to `package.json`.

PR: https://github.com/SAP/ai-sdk-js/pull/2247  
Branch: `I753325-652`  
Opened by: BrigittaK307

---

## Key files changed

- `.github/workflows/*.yml` — all workflows now use local `$/.github/actions/*` references
- `.github/actions/setup/action.yml` — local setup action (replaces cloud-sdk-js version)
- `package.json` — added `devEngines.packageManager: { name: "pnpm", version: "^12.4.1" }`
- `pnpm-lock.yaml` — regenerated with pnpm v12
- `.github/workflows/fosstars.yml` — OWASP dependency check workflow

---

## Critical context: why `devEngines` causes trouble

Before this PR, the repo had no `devEngines` field in `package.json`. Adding it caused pnpm to track **itself** in the lockfile (as `pnpm@12.x.x` package entries) and apply the `minimumReleaseAge: 5760` (4-day maturity) policy to its own version. This never happened before.

**`minimumReleaseAge`** is set in `pnpm-workspace.yaml` and blocks installation of packages published less than 4 days ago. This is a supply-chain security policy.

If the lockfile is regenerated on the same day a new pnpm version is published, CI will fail with `ERR_PNPM_NO_MATURE_MATCHING_VERSION` for `pnpm@x.y.z`.

**Fix**: Wait until pnpm version in the lockfile is >4 days old, then regenerate. As of 2026-09-22, `pnpm@12.4.2` (published 2026-09-15) is 7 days old and passes the check.

---

## How CI determines which pnpm version to install

`pnpm/action-setup` (in `.github/actions/setup/action.yml`) reads `devEngines.packageManager.version` from `package.json` when no explicit `version:` input is given. Currently set to `^12.4.1`, which resolves to the latest `12.4.x` — in practice `12.4.1` or `12.4.2`.

---

## Branch lockfiles — disabled

`pnpm-workspace.yaml` originally had `gitBranchLockfile: true` (added by this PR). This was supposed to give each branch its own lockfile to avoid merge conflicts. However, it doesn't work as expected because the GitHub Actions `checkout` action uses a detached HEAD, not a named branch.

David Knaack merged a commit to `main` on 2026-09-22 disabling this:
```yaml
# gitBranchLockfile: true
# mergeGitBranchLockfilesBranchPattern:
#   - main
#   - renovate/*
```
This is now on `main` and was picked up by the rebase. The lockfile is now a standard shared lockfile again.

---

## Lockfile regeneration workflow

Because `main` moves forward with Renovate bumps constantly, the lockfile goes stale quickly. The correct process:

1. Rebase branch onto current `main` with `-X ours` to keep the branch lockfile through conflicts
2. Run `pnpm install --no-frozen-lockfile` with pnpm v12 to regenerate
3. Amend into the single feature commit
4. Force-push

**Important**: Always regenerate with pnpm v12 (not v10). The local PATH may still point to v10 after install — check with `which pnpm`. The v12 binary is at `~/Library/pnpm/.tools/pnpm/12.4.2/bin/pnpm`.

---

## fosstars.yml changes (David's review suggestions, applied)

Two changes applied to `.github/workflows/fosstars.yml`:

1. **Removed `--disablePnpmAudit`** from the OWASP Dependency Check args. Previously needed because OWASP ran in Docker without pnpm on PATH. Now that the workflow explicitly installs a pnpm binary for the container (`--pnpm /github/workspace/.local/pnpm/pnpm`), the audit can run properly.

2. **Replaced hardcoded `PNPM_VERSION: 12.4.0` env var** with `PNPM_VERSION="$(pnpm --version)"` inline in the run script. This auto-syncs with whatever pnpm version the setup action installs — no manual maintenance needed.

---

## check-pr job — sparse checkout issue

`.github/workflows/check-pr.yml` uses sparse checkout that only includes:
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/actions`
- `.changeset`

The `check-pr` action (`$/.github/actions/check-pr/action.yml`) runs `node index.ts` from `build-packages/check-pr` — but that directory is not included in the sparse checkout. This causes the job to fail with "No such file or directory".

**Status**: Not yet fixed as of this session.

---

## Current branch state (2026-09-22)

- 1 clean feature commit on top of `main`: `feat(ci): Migrate GitHub Actions from cloud-sdk and update pnpm version`
- Lockfile regenerated with pnpm v12.4.2, committed and pushed
- fosstars.yml changes included
- CI checks running — maturity issue should be resolved
- `check-pr` job still failing (sparse checkout missing `build-packages/check-pr`)

---

## David's outstanding review comments

- `CHANGES_REQUESTED` was raised on 2026-09-09 — the fosstars suggestions from 2026-09-21 have been applied
- Check if there are any remaining unresolved review threads before merging
