/* oxlint-disable no-console */

import { access, appendFile, mkdtempDisposable } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { x } from 'tinyexec';

const workspaceRoot = resolve(import.meta.dirname, '..', '..', '..');
const appName = '@sap-ai-sdk/smoke-tests';

await using tmpDir = await mkdtempDisposable(
  resolve(tmpdir(), 'cf-deploy-smoke-tests-')
);
console.log(`Temp dir: ${tmpDir.path}`);

console.log('Running pnpm deploy...');
const deployResult = await x(
  'pnpm',
  [
    '--filter',
    appName,
    'deploy',
    '--config.inject-workspace-packages=true',
    '--prod',
    tmpDir.path
  ],
  { throwOnError: true, nodeOptions: { cwd: workspaceRoot } }
);
if (deployResult.stdout) {
  console.log(deployResult.stdout);
}
if (deployResult.stderr) {
  console.error(deployResult.stderr);
}
await access(
  resolve(tmpDir.path, 'node_modules', '.bin', 'sap-ai-sdk-sample-server')
);

console.log('Enabling trustLockfile in deployment pnpm-workspace.yaml...');
await appendFile(
  resolve(tmpDir.path, 'pnpm-workspace.yaml'),
  'trustLockfile: true\n'
);

console.log(`Running cf push from ${tmpDir.path}...`);
const cfResult = await x('cf', ['push'], {
  throwOnError: true,
  nodeOptions: { cwd: tmpDir.path }
});
if (cfResult.stdout) {
  console.log(cfResult.stdout);
}
if (cfResult.stderr) {
  console.error(cfResult.stderr);
}
console.log('cf push complete.');
