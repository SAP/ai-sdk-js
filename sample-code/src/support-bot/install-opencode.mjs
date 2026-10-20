#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, symlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgPath = fileURLToPath(import.meta.resolve('opencode-ai/package.json'));
const binDir = join(dirname(pkgPath), 'bin');
const postinstall = join(dirname(pkgPath), 'postinstall.mjs');

const result = spawnSync('node', [postinstall], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);

// Ensure the `opencode` symlink exists on non-Windows (pnpm may not preserve tarball symlinks)
const symlink = join(binDir, 'opencode');
const target = join(binDir, 'opencode.exe');
if (
  process.platform !== 'win32' &&
  !existsSync(symlink) &&
  existsSync(target)
) {
  symlinkSync('opencode.exe', symlink);
}
