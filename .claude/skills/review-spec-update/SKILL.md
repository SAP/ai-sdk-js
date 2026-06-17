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

# Review Spec Update

You are reviewing a spec-update branch for a generated OpenAPI client package.
Your goal: identify every change that breaks existing consumer code, create a `[compat]` changeset for each one, fix broken patches, and create new patches for parameter-order regressions.

## Step 1 — Establish the diff

```bash
# Identify which package(s) changed
git diff main...HEAD --name-only | grep 'packages/'

# For each affected package, get the full generated-client diff
git diff main...HEAD -- packages/<pkg>/src/client/
```

Focus on `src/client/api/` (generated files). Hand-written code in `src/` outside `client/` is NOT in scope unless you find it affected by a type change.

## Step 2 — Classify changes

Work through the diff methodically. For each changed type/function, decide:

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
| Type widened on a response field | borderline | Note it but usually no changeset needed |
| New optional field on a response type | no | Safe addition |

### Schema / enum changes

| Change | Breaking? |
|--------|-----------|
| Open union `'A'\|'B'\|any` → strict `'A'\|'B'` | **YES** — previously-passing `any` values now rejected by TypeScript |
| Strict union → open (`| any`) | no |
| New enum member added | no |
| Enum member removed | **YES** |
| Type renamed | **YES** (if exported) — also check the new type's shape: a rename often comes with property changes (`id` → `resourceId`, removed fields, etc.).<br>Document each property-level breaking change in its own `[compat]` entry, don't just note the rename. |
| Type deleted | **YES** (if exported) |

## Step 3 — Check for parameter-order regressions

**Important**: always test patches against freshly-generated code, not hand-edited files.
If the working tree has manual edits, regenerate first:

```bash
pnpm <pkg> generate
pnpm <pkg> run apply-patches   # run existing patches so the tree is in the "released" state
```

Then for every function where positional parameters reordered:

1. Check if a patch already exists:
   ```bash
   ls packages/<pkg>/patches/
   ```
2. If a patch exists, test whether it still applies cleanly. **Do not test against the working tree** — `pnpm apply-patches` may have already been run (it is idempotent via `--reverse --check`), making the working tree look correct even though the patch is still needed. Regenerate to get the raw pre-patch state before checking:
   ```bash
   pnpm <pkg> generate           # restores raw generated output
   git apply --check packages/<pkg>/patches/<patch-file>.patch
   ```
3. **Patch applies cleanly** → nothing to do for this function.
4. **Patch fails** → the context lines around the reorder changed (e.g. new parameters added nearby). The generator always emits `headerParameters` before `queryParameters` (or vice versa) based on spec order — this does not self-correct. Update the patch context to match the new generated output (see §Updating a patch below). Do NOT delete a parameter-order patch just because the working tree already shows the correct order.
   - A patch is only truly obsolete if the function no longer has both `headerParameters` and `queryParameters` (i.e., one was removed from the spec), making the ordering moot.
5. **No patch exists** → create one (see §Creating a patch below).

### Detecting parameter-order changes

The generated functions follow this shape:
```typescript
functionName: (
  param1: Type1,
  param2: Type2,
  ...
) => new OpenApiRequestBuilder(...)
```
If the spec reordered `headerParameters` vs `queryParameters`, the generator will flip their positions.
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
git apply --check packages/<pkg>/patches/<patch-file>.patch
```

## Step 4 — Maintain apply-patches support

If you deleted a patch in Step 3, remove the patches directory if now empty and remove the `apply-patches` script from `package.json`.

Check whether the package has an `apply-patches` script:

```bash
cat packages/<pkg>/package.json | grep apply-patches
```

If missing, add it. All packages use a shared script at `scripts/apply-patches.ts` that iterates over all `*.patch` files in the package's `patches/` directory and applies each one (skips if already applied). Just add to `package.json` scripts:

```json
"apply-patches": "tsx ../../scripts/apply-patches.ts ."
```

The `.` argument tells the script to look for a `patches/` subdirectory relative to the current package directory.
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

## Step 6 — Verify

```bash
# All patches apply cleanly
git apply --check packages/<pkg>/patches/*.patch

# TypeScript compiles
pnpm <pkg> compile

# Tests pass
pnpm <pkg> test

# List changesets created
ls .changeset/
```

## Quick checklist

- [ ] Diffed `src/client/` against main
- [ ] Every breaking request-side change has a `[compat]` changeset
- [ ] Every breaking response-side removal/rename/narrowing has a `[compat]` changeset
- [ ] Parameter-order regressions have patches (new or updated)
- [ ] All patches apply cleanly (`git apply --check`)
- [ ] Package has `apply-patches` script (added if missing)
- [ ] TypeScript compiles, tests pass
