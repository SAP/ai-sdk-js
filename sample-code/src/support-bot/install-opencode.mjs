#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawnSync } from 'child_process';

const pkgPath = fileURLToPath(import.meta.resolve('opencode-ai/package.json'));
const postinstall = join(dirname(pkgPath), 'postinstall.mjs');
console.log('Running', postinstall);
const result = spawnSync('node', [postinstall], { stdio: 'inherit' });
process.exit(result.status ?? 1);
