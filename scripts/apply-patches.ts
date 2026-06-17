/* eslint-disable no-console */
import { readdir, realpath } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { join, sep } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function execCheckSuccess(command: string, args: string[]) {
  return execFileAsync(command, args).then(
    () => true,
    () => false
  );
}

// Entry point: Get the root directory from command-line arguments
const rootDir = process.argv[2];

if (!rootDir) {
  console.error('Please provide the root directory as an argument.');
  process.exit(1);
}

const baseDir = (await realpath(join(import.meta.dirname, '..'))) + sep;
const canonicalPatchDir = await realpath(join(rootDir, 'patches')).catch(
  () => undefined
);
if (!canonicalPatchDir || !canonicalPatchDir.startsWith(baseDir)) {
  console.error(
    'Access denied: patch directory is outside the repository root.'
  );
  process.exit(1);
}

const files = await readdir(canonicalPatchDir).catch(() => []);
const patches = files.filter(f => f.endsWith('.patch'));
const failedPatches: string[] = [];

for (const file of patches) {
  const patch = join(canonicalPatchDir, file);
  const alreadyApplied = await execCheckSuccess('git', [
    'apply',
    '--reverse',
    '--check',
    patch
  ]);

  if (alreadyApplied) {
    console.log(`Skipping already-applied patch: ${file}`);
    continue;
  }
  const success = await execCheckSuccess('git', ['apply', patch]);
  if (!success) {
    failedPatches.push(file);
    continue;
  }
  console.log(`Applied patch: ${file}`);
}

if (failedPatches.length) {
  console.error(
    `Failed to apply the following patches: ${failedPatches.join(', ')}`
  );
  process.exit(1);
}
