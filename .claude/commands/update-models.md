# Update Model Types from SAP Notes

Syncs `packages/core/src/model-types.ts` with the current model table on SAP Notes (me.sap.com/notes/3437766).

## Steps

1. **Navigate to the SAP Notes page** using the Playwright MCP tool:
   - Use `browser_navigate` to go to `https://me.sap.com/notes/3437766`
   - Use `browser_wait_for` to wait for `Availability of Generative AI Models`
   - If the page shows a login screen, tell the user to log in to me.sap.com in the Playwright browser window and wait for their confirmation, then retry.

2. **Extract the model table**:
   - Read `scripts/extract-model-table.js` and pass its contents as the function body to `browser_evaluate`.
   - The script returns either a JSON array of model rows (success) or `{ error: '...' }` (failure).
   - If the result is an error or empty array, the session has expired — tell the user to log in to me.sap.com in the Playwright browser window and wait for their confirmation, then retry.
   - On success, **merge** the extracted rows into `scripts/sap-models.json`: read the existing file first, then update existing entries (matched by `model` field) and append any new ones.
     Do NOT replace the whole file — use the Edit tool to apply targeted changes or add new entries.

3. **Patch model-types.ts** by running the sync script:
   ```bash
   pnpm tsx scripts/sync-model-types.ts
   ```
   If the output ends with a `⚠ Skipped N model(s)` warning, show the user the listed model names and their `executableId` values and ask whether they want to add a mapping.
   If yes, add the appropriate entry to `EXECUTABLE_ID_TO_TYPE` in `scripts/sync-model-types.ts` and re-run the script before proceeding.

4. **Show the diff** to the user:
   ```bash
   git diff packages/core/src/model-types.ts
   ```
   If there is no diff, tell the user the file is already up to date and stop.

5. **Ask the user** if they want to open a PR with these changes.

6. If yes, **create a branch and open a PR**:
   ```bash
   git checkout -b model-types-update/$(date +%Y-%m-%d)
   git add scripts/sap-models.json packages/core/src/model-types.ts
   git commit -m "chore: sync model types from SAP Notes 3437766"
   gh pr create --base main --title "chore: Sync model types from SAP Notes" --body "Automated sync of model types from [SAP Notes 3437766](https://me.sap.com/notes/3437766).\n\n## Changes\n\nUpdated LiteralUnion type blocks in \`packages/core/src/model-types.ts\` to reflect current model availability.\n\n## Definition of Done\n- [ ] Model names are correct\n- [ ] Compilation passes\n- [ ] Release notes / Changeset updated if needed"
   ```

## Prerequisites

- `playwright@claude-plugins-official` must be enabled as a Claude Code plugin — install it via `/plugin` in Claude Code
- `gh` CLI must be authenticated: run `gh auth login` if not already done
- **First run:** me.sap.com credentials required for manual login in the Playwright browser window (the session is saved automatically for future runs)
