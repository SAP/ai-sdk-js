#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawnSync } from 'child_process';
import { existsSync, symlinkSync, readdirSync } from 'fs';

const pkgPath = fileURLToPath(import.meta.resolve('opencode-ai/package.json'));
const binDir = join(dirname(pkgPath), 'bin');
const postinstall = join(dirname(pkgPath), 'postinstall.mjs');

console.log('[install-opencode] running postinstall:', postinstall);
const result = spawnSync('node', [postinstall], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);

console.log('[install-opencode] binDir contents:', readdirSync(binDir).join(', '));

// Ensure the `opencode` symlink exists (pnpm may not preserve tarball symlinks)
const symlink = join(binDir, 'opencode');
const target = join(binDir, 'opencode.exe');
if (!existsSync(symlink) && existsSync(target)) {
  console.log('[install-opencode] creating opencode -> opencode.exe symlink');
  symlinkSync('opencode.exe', symlink);
}

console.log('[install-opencode] done');
