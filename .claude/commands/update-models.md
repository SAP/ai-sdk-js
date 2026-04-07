# Update Model Types from SAP Notes

Syncs `packages/core/src/model-types.ts` with the current model table on SAP Notes (me.sap.com/notes/3437766).

## Steps

1. **Launch Chrome with a persistent SAP profile** by running the appropriate command for your OS:

   **macOS:**
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --remote-debugging-port=9222 \
     --user-data-dir=$HOME/.sap-chrome-profile \
     --no-first-run \
     --no-default-browser-check &
   sleep 2
   ```

   **Linux:**
   ```bash
   google-chrome \
     --remote-debugging-port=9222 \
     --user-data-dir=$HOME/.sap-chrome-profile \
     --no-first-run \
     --no-default-browser-check &
   sleep 2
   ```
   (Use `chromium-browser` instead of `google-chrome` if that is what is installed.)

   **Windows** (run in PowerShell):
   ```powershell
   Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" `
     --remote-debugging-port=9222 `
     --user-data-dir="$env:USERPROFILE\.sap-chrome-profile" `
     --no-first-run `
     --no-default-browser-check
   Start-Sleep 2
   ```

   The `--user-data-dir` flag saves the SAP login session so you only need to log in manually on the first run.

2. **Navigate to the SAP Notes page** using the chrome-devtools MCP tool:
   - Use `navigate_page` to go to `https://me.sap.com/notes/3437766`

3. **Extract the model table**:
   - Read `scripts/extract-model-table.js` and pass its contents as the function body to `evaluate_script`.
   - The script returns either a JSON array of model rows (success) or `{ error: '...' }` (failure).
   - If the result is an error or empty array, the session has expired — tell the user to log in to me.sap.com in the Chrome window and wait for their confirmation, then retry `navigate_page` + `evaluate_script`.
   - On success, **merge** the extracted rows into `scripts/sap-models.json`: read the existing file first, then update existing entries (matched by `model` field) and append any new ones.
     Do NOT replace the whole file — use the Edit tool to apply targeted changes or add new entries.

4. **Patch model-types.ts** by running the sync script:
   ```bash
   pnpm tsx scripts/sync-model-types.ts
   ```
   If the output ends with a `⚠ Skipped N model(s)` warning, show the user the listed model names and their `executableId` values and ask whether they want to add a mapping.
   If yes, add the appropriate entry to `EXECUTABLE_ID_TO_TYPE` in `scripts/sync-model-types.ts` and re-run the script before proceeding.

5. **Show the diff** to the user:
   ```bash
   git diff packages/core/src/model-types.ts
   ```
   If there is no diff, tell the user the file is already up to date and stop.

6. **Ask the user** if they want to open a PR with these changes.

7. If yes, **create a branch and open a PR**:
   ```bash
   git checkout -b model-types-update/$(date +%Y-%m-%d)
   git add scripts/sap-models.json packages/core/src/model-types.ts
   git commit -m "chore: sync model types from SAP Notes 3437766"
   gh pr create --base main --title "chore: Sync model types from SAP Notes" --body "Automated sync of model types from [SAP Notes 3437766](https://me.sap.com/notes/3437766).\n\n## Changes\n\nUpdated LiteralUnion type blocks in \`packages/core/src/model-types.ts\` to reflect current model availability.\n\n## Definition of Done\n- [ ] Model names are correct\n- [ ] Compilation passes\n- [ ] Release notes / Changeset updated if needed"
   ```

## Prerequisites

- **Google Chrome (or Chromium) must be installed.**
  See step 1 for the launch command on your OS.
- `chrome-devtools-mcp` must be enabled as a Claude Code plugin — install it from the Claude Code plugin marketplace (`chrome-devtools-mcp@claude-plugins-official`) or see [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) for manual MCP server setup
- `gh` CLI must be authenticated: run `gh auth login` if not already done
- **First run:** me.sap.com credentials required for manual login in Chrome (cookies are saved to `~/.sap-chrome-profile` for future runs)
- Node.js 20.19.0+ required for `chrome-devtools-mcp` (check with `node --version`)
