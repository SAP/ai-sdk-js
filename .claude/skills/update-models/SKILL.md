---
name: update-models
description: Sync model types from SAP Notes 3437766. Use when model-types.ts needs updating from the latest SAP AI model availability table.
argument-hint: "[no arguments needed]"
---

# Update Model Types from SAP Notes

Syncs `packages/core/src/model-types.ts` and the deprecated models table in the SAP/ai-sdk docs with the current model table on SAP Notes (me.sap.com/notes/3437766).

## Steps

1. **Navigate to the SAP Notes page** using the Playwright MCP tool:
   - Use `browser_navigate` to go to `https://me.sap.com/notes/3437766`
   - Use `browser_wait_for` to wait for `Availability of Generative AI Models`
   - If the page shows a login screen, tell the user to log in to me.sap.com in the Playwright browser window and wait for their confirmation, then retry.

2. **Extract the model tables** (then close the browser tab when done):
   - Read `scripts/extract-model-table.js` and pass its contents as the function body to `browser_evaluate`.
   - The script returns either `{ active: [...], retired: [...] }` (success) or `{ error: '...' }` (failure).
    - If the result is an error or `result.active` is empty, the session has expired — tell the user to log in to me.sap.com in the Playwright browser window and wait for their confirmation, then retry.
    - On success, **sync models into `scripts/sap-models.json`**:
       - For each model in `result.active`: update the existing entry matched by `model` field (update all fields), or append it if not already present.
         **Clear** the `retired` field (set to `""`) if it was previously set.
       - For each model in `result.retired`: if already present in `sap-models.json`, set `retired: "yes"` and update `suggestedReplacement` from `result.retired`. If not present at all, **append** a new entry with `retired: "yes"` and the fields from `result.retired` (set `availableInOrchestration: ""`, `deprecated: ""`, `retirementDate: ""`).
       - **Do not remove** any entries from `sap-models.json` — retired models stay in the file with `retired: "yes"`.
       - If both `result.active` and `result.retired` list a model, treat it as retired.
   - **Close the browser tab** using `browser_close` to avoid stale session issues on future runs.

3. **Patch model-types.ts** by running the sync script:
   ```bash
   pnpm tsx scripts/sync-model-types.ts
   ```
   If the output ends with a `⚠ Skipped N model(s)` warning, show the user the listed model names and their `executableId` values and ask whether they want to add a mapping.
   If yes, add the appropriate entry to `EXECUTABLE_ID_TO_TYPE` in `scripts/sync-model-types.ts` and re-run the script before proceeding.
   The script also checks which synced models are available in your landscape using the foundation-models API.

4. **Sync the deprecated models table in `docs-js/overview.mdx` (SAP/ai-sdk repository):**

   a. Clone the SAP/ai-sdk repository into a temp directory:
      ```bash
      DOCS_DIR=$(mktemp -d)
      git clone --depth=1 https://github.com/SAP/ai-sdk "$DOCS_DIR"
      ```

   b. Using the Edit tool, make the following targeted changes to `$DOCS_DIR/docs-js/overview.mdx`:
      - **Remove** rows where the model has `retired: "yes"` in `sap-models.json` — note removed models to the user.
        Only list models that are still active (not retired) but deprecated (`deprecated: "yes"` or retirement date set in `sap-models.json`). Fully retired models must be removed from the table.
      - **Update** the replacement cell of any existing row whose replacement differs from the script output.
      If the replacement is not listed in `sap-models.json` add it as `<!-- MODEL_NAME -->` in the cell so the user can decide how to handle it.
      - **Append** rows for newly deprecated models (not yet in the table) to the bottom, one per line.
      Preserve existing row order — new entries go at the end.

   c. Use the Edit tool to replace the entire markdown table (header row through last data row) in `$DOCS_DIR/docs-js/overview.mdx`. Write rows without padding — `lint:fix` will normalize column widths.

   d. Run install, lint fix, and build to verify:
      ```bash
      cd "$DOCS_DIR" && npm ci && npm run lint:fix && npm run build
      ```
      If any step fails, show the error to the user and stop.

   e. Show the diff:
      ```bash
      git -C "$DOCS_DIR" diff docs-js/overview.mdx
      ```

5. **Check for deprecated model usage** in the ai-sdk-js codebase:
   - From `scripts/sap-models.json`, collect names of all models where `retired` is `"yes"`, `deprecated` is `"yes"`, or a retirement date is set.
   - Grep the repository for any of those model names (exclude `scripts/sap-models.json` itself, `packages/core/src/model-types.ts`, OpenAPI specs and generated files like `packages/*/src/client/**/*.ts`).
   - If matches are found, report them to the user so they can decide whether to update or remove those usages.

6. **Show the ai-sdk-js diff** to the user:
   ```bash
   git diff packages/core/src/model-types.ts
   ```
   If neither file changed, tell the user everything is already up to date and stop.

7. **Ask the user** if they want to open PRs with these changes.

8. If yes, **create branches and open PRs** — one per repository:

   **ai-sdk-js** (model types):
   ```bash
   git checkout -b model-types-update/$(date +%Y-%m-%d)
   git add scripts/sap-models.json packages/core/src/model-types.ts
   git commit -m "chore: sync model types from SAP Notes 3437766"
   gh pr create --draft --base main --title "chore: Sync model types from SAP Notes" --body "Automated sync of model types from [SAP Notes 3437766](https://me.sap.com/notes/3437766).\n\n## Changes\n\nUpdated LiteralUnion type blocks in \`packages/core/src/model-types.ts\` to reflect current model availability.\n\n## Definition of Done\n- [ ] Model names are correct\n- [ ] Compilation passes\n- [ ] Release notes / Changeset updated if needed"
   ```

   **SAP/ai-sdk** (docs), if `docs-js/overview.mdx` changed:
   ```bash
   BRANCH="docs/update-deprecated-models-js-$(date +%Y-%m-%d)"
   git -C "$DOCS_DIR" checkout -b "$BRANCH"
   git -C "$DOCS_DIR" add docs-js/overview.mdx
   git -C "$DOCS_DIR" commit -m "docs: update deprecated models table"
   git -C "$DOCS_DIR" push origin "$BRANCH"
   gh pr create --draft --repo SAP/ai-sdk --base main --head "$BRANCH" \
     --title "docs: Update deprecated models table" \
     --body "Sync of the deprecated models table in \`docs-js/overview.mdx\` from [SAP Notes 3437766](https://me.sap.com/notes/3437766).\n\n## Changes\n\n- Added newly deprecated models\n- Removed retired models (no longer listed in SAP Notes)\n- Updated replacement suggestions\n\n## Definition of Done\n- [ ] Table entries are correct\n- [ ] Retired models removed\n- [ ] Replacement suggestions accurate"
   ```

## Prerequisites

- `playwright@claude-plugins-official` must be enabled as a Claude Code plugin — install it via `/plugin` in Claude Code
- `gh` CLI must be authenticated: run `gh auth login` if not already done
- **First run:** me.sap.com credentials required for manual login in the Playwright browser window (the session is saved automatically for future runs)
