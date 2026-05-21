/* eslint-disable no-console */
import { readdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { join } from 'node:path';
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

const patchDir = join(rootDir, 'patches');

const files = await readdir(patchDir).catch(() => []);
const patches = files.filter(f => f.endsWith('.patch'));
const failedPatches: string[] = [];

for (const file of patches) {
  const patch = join(patchDir, file);
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
