---
name: review-spec-update
description: >
  Review a spec-update branch for a generated client package (e.g., document-grounding, prompt-registry).
  Compares the updated generated client against main, classifies every breaking change by consumer impact,
  creates [compat] changesets for each breaking change, fixes or creates backward-compat patches when
  parameter order shifts, and adds apply-patches support when the package lacks it.
  Use this skill whenever you're on a spec-update/* branch, have just run pnpm generate, or want to audit
  what a spec update broke for downstream consumers.
---

<!-- vale Vale.Spelling = NO -->

# Review Spec Update

<!-- vale Vale.Terms = NO -->
You are reviewing a spec-update branch for a generated OpenAPI client package.
<!-- vale Vale.Terms = YES -->
Your goal: identify every change that breaks existing consumer code, create a `[compat]` changeset for each one, fix broken patches, and create new patches for parameter-order regressions.

## Step 1 — Establish the diff

```bash
# Identify which package(s) changed
git diff main...HEAD --name-only | grep 'packages/'

# For each affected package, get the full generated-client diff
git diff main...HEAD -- packages/<pkg>/src/client/
```

If the diff is empty, confirm that `pnpm <pkg> generate` was actually executed and commit.
If confirmed, output a summary stating no generated-client changes were detected and stop; no further steps are required.

Focus on `src/client/api/` (generated files).
Hand-written code in `src/` outside `client/` is NOT in scope unless it directly imports a type that was renamed, removed, or had its shape changed in this diff.
In that case, note the affected file but do not modify it; record it as a follow-up task.

## Step 2 — Classify changes

Work through the diff methodically.
For each changed type/function, decide:

### Request-side changes (consumer sends this → almost always breaking)

| Change | Breaking? | Why |
|--------|-----------|-----|
| New **required** parameter on a function | **YES** | Existing calls now missing argument |
| Parameter removed from a function | **YES** | Existing calls pass unknown argument |
| Parameter order changed | **YES** | Positional calls pass wrong value |
| Parameter type narrowed (e.g. `string` → `'a'\|'b'`) | **YES** | May reject previously-valid values |
| Parameter type widened | no | Consumers unaffected |
| New **optional** parameter on a function | no | Existing calls still valid |
| Required request body field becomes optional | no | Less strict |
| Optional request body field becomes required | **YES** | Existing objects now invalid |

### Response-side changes (consumer receives this → usually not breaking)

| Change | Breaking? | Why |
|--------|-----------|-----|
| New required field on a response type | no | Destructuring still works; extra field is fine |
| Field removed from a response type | **YES** | Code reading that field will get `undefined` |
| Field renamed | **YES** | Old name no longer exists |
| Type narrowed on a response field | **YES** | Code relying on broader type breaks |
| Type widened on a response field | no, unless it newly introduces `undefined` or `null` | Widening is safe unless consumers must now handle absence that was impossible before |
| New optional field on a response type | no | Safe addition |

### Schema / enum changes

<!-- vale SAP.Sentences = NO -->
| Change | Breaking? |
|--------|-----------|
| Open union `'A'\|'B'\|any` → strict `'A'\|'B'` | **YES** — previously-passing `any` values now rejected by TypeScript |
| Strict union → open (`| any`) | no |
| New enum member added | no |
| Enum member removed | **YES** |
| Type renamed | **YES** (if exported) — also check the new type's shape: a rename often comes with property changes (`id` → `resourceId`, removed fields, etc.).<br>Document each property-level breaking change in its own `[compat]` entry; do not just note the rename.<br>If the old type is entirely deleted and replaced by a structurally different new type with no shared name, treat it as a deletion of the old type plus introduction of a new type.<br>Create one `[compat]` entry for the deletion and list the migration target type by name if identifiable from the diff. |
| Type deleted | **YES** (if exported) |
<!-- vale SAP.Sentences = YES -->

## Step 3 — Check for parameter-order regressions

```bash
pnpm <pkg> generate
pnpm <pkg> run apply-patches
```

Then for every function where positional parameters reordered:

1. Check if a patch already exists:
   ```bash
   ls packages/<pkg>/patches/
   ```
2. **Patch exists** → leave it alone unless `pnpm <pkg> run apply-patches` reported that patch file as failing.
    If it failed, the context lines around the reorder changed (e.g. new parameters added nearby).
    Update the patch context to match the new generated output (see §Updating a patch below).
    Do NOT delete a parameter-order patch just because the working tree already looks correct.
3. **No patch exists** → create one (see §Creating a patch below).
4. **Patch is truly obsolete** → delete it only if the function no longer has both `headerParameters` and `queryParameters` (i.e., one was removed from the spec), making the ordering moot.

### Detecting parameter-order changes

The generated functions follow this shape:
```typescript
functionName: (
  param1: Type1,
  param2: Type2,
  ...
) => new OpenApiRequestBuilder(...)
```
<!-- vale SAP.Sentences = NO -->
If the spec reordered `headerParameters` vs `queryParameters`, the generator will flip their positions.
<!-- vale SAP.Sentences = YES -->
The old signature was the correct consumer-facing order; restore it via a patch.

### Creating a patch

```bash
# 1. Manually edit the generated file to restore the old parameter order
#    (swap back to the order consumers expect)
# 2. Stage only that file
git add packages/<pkg>/src/client/api/<api-file>.ts
# 3. Generate the patch against HEAD (which has the newly-generated code)
git diff --cached > packages/<pkg>/patches/backward-compat-<function-name>-order.patch
# 4. Unstage (the patch is the artifact, not the edit)
git restore --staged packages/<pkg>/src/client/api/<api-file>.ts
git restore packages/<pkg>/src/client/api/<api-file>.ts
```

Patch file naming: `backward-compat-<camelFunctionName>-order.patch`

### Updating a patch

If the patch context no longer matches (function body changed around the reorder):

```bash
# Inspect what changed
git diff main...HEAD -- packages/<pkg>/src/client/api/<api-file>.ts
# Open the patch file, update the context lines (the unchanged lines around the @@)
# to match the new generated code, keeping the - / + lines intact
# Then verify:
pnpm <pkg> generate
pnpm <pkg> run apply-patches
```

## Step 4 — Maintain apply-patches support

If you deleted a patch in Step 3 because it was truly obsolete, remove the patches directory if now empty and remove the `apply-patches` script from `package.json`.

Check whether the package has an `apply-patches` script:

```bash
cat packages/<pkg>/package.json | grep apply-patches
```

If missing, add it.
The migration target is a shared script at `scripts/apply-patches.ts`.
It takes the package root directory as its argument and resolves `<rootDir>/patches`.
It refuses to touch patch directories outside the repository root.
It skips patches that are already applied via `git apply --reverse --check`.
It applies the remaining `*.patch` files and exits non-zero listing any patch files that failed.
For packages moved to the shared runner, add this to `package.json` scripts:

```json
"apply-patches": "tsx ../../scripts/apply-patches.ts ."
```

The `.` argument passes the current package directory as `rootDir`, so the script looks for a `patches/` subdirectory at `./patches`.
When the root `apply-patches` command runs, it invokes each package's `apply-patches` script via pnpm recursion, so this package script is the entry point the repository-wide command will call.
No need to list individual patch files — the script picks them up automatically.
Adding a new patch is as simple as dropping a `.patch` file into `patches/`.

Also verify the root `package.json` runs `apply-patches` across the repository:
```bash
grep apply-patches package.json
# Should have: "apply-patches": "pnpm -r run --if-present apply-patches"
```

## Step 5 — Write [compat] changesets

For **each** breaking change, run `pnpm changeset --empty` once, then edit the generated file.

### Format

```markdown
---
'@sap-ai-sdk/<package-name>': minor
---

[compat] <TypeName(s)>: <what changed and what consumers need to do>.
```

Use `minor` for all `[compat]` entries (breaking changes in this project always bump minor).

### Examples from this repository

**Type narrowed:**
```markdown
[compat] `DocumentKeyValueListPair`, `RetrievalDocumentKeyValueListPair`, `VectorDocumentKeyValueListPair`: the `matchMode` property type was narrowed from an open union (`'ANY' | 'ALL' | any`) to the strict `FilterMatchModeEnum` (`'ANY' | 'ALL'`).
```

**Field removed from response:**
```markdown
[compat] `CollectionPendingResponse`: fields `Location` and `status` were removed.
A new `monitorURL` property was added instead.
```

**Required field added to request type:**
```markdown
[compat] `TextOnlyBaseChunk`: new required field `id: string` added and `metadata` is now optional.
```

**Field type changed:**
```markdown
[compat] `BaseDocument` / `DocumentInput`: `chunks` type changed from `TextOnlyBaseChunk[]` to `TextOnlyBaseChunkCreate[]`.
The `metadata` property is now optional.
```

**Optional became required:**
```markdown
[compat] `PromptTemplateSubstitutionRequest` now requires the `inputParams` property.
```

### What does not need a [compat] changeset

- New optional fields on response types
- New enum members added
- Type widened (e.g., `'a'|'b'` → `'a'|'b'|'c'`)
- New optional parameters on functions
- Fields on response types becoming optional

These get rolled into the `[feat]` changeset that should already exist for the spec update.

If no `[feat]` changeset exists yet for this spec update, create one with `pnpm changeset --empty`.
Label it `[feat] <package-name>: updated generated client to latest spec` before rolling in non-breaking changes.

## Step 6 — Verify

```bash
# Recreate raw generated output, then verify the shared patch runner succeeds
pnpm <pkg> generate
pnpm <pkg> run apply-patches

# TypeScript compiles
pnpm <pkg> compile

# Tests pass
pnpm <pkg> test

# List changesets created
ls .changeset/
```

If `pnpm <pkg> run apply-patches` fails, return to Step 3 §Updating a patch for each failing patch file.
Do not proceed to compile or test until all patches apply cleanly.
List each failing patch file by name in your output.

If compilation fails, inspect the error output to determine whether the failure is caused by a breaking change not yet covered by a `[compat]` changeset or patch.
If so, return to Step 2 or Step 3.
If the failure is unrelated to this spec update, note it as a pre-existing issue and do not block the review.
If tests fail, apply the same triage: attribute failures to this spec update or flag them as pre-existing.

## Quick checklist

- [ ] Diffed `src/client/` against main
- [ ] Every breaking request-side change has a `[compat]` changeset
- [ ] Every breaking response-side removal/rename/narrowing has a `[compat]` changeset
- [ ] Parameter-order regressions have patches (new or updated)
- [ ] All patches apply cleanly (`pnpm <pkg> apply-patches` from fresh generated output)
- [ ] Package has `apply-patches` script (added if missing)
- [ ] TypeScript compiles, tests pass
