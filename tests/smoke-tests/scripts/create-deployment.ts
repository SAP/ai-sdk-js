/* oxlint-disable no-console */

import {
  access,
  copyFile,
  mkdtempDisposable,
  readFile,
  writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { x } from 'tinyexec';

const workspaceRoot = resolve(import.meta.dirname, '..', '..', '..');
const appDir = resolve(import.meta.dirname, '..');
const appName = '@sap-ai-sdk/smoke-tests';

await using tmpDir = await mkdtempDisposable(
  resolve(tmpdir(), 'cf-deploy-smoke-tests-')
);
const deployDir = resolve(tmpDir.path, 'deploy');
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
    deployDir
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
  resolve(deployDir, 'node_modules', '.bin', 'sap-ai-sdk-sample-server')
);

console.log('Writing .npmrc...');
await writeFile(resolve(deployDir, '.npmrc'), 'ignore-scripts=true\n');

console.log('Copying manifest.yml...');
await copyFile(
  resolve(import.meta.dirname, '..', 'manifest.yml'),
  resolve(tmpDir.path, 'manifest.yml')
);

console.log('Writing wrapper package.json...');
const appPkg = JSON.parse(
  await readFile(resolve(appDir, 'package.json'), 'utf-8')
);
const forwardedScripts = Object.fromEntries(
  Object.keys(appPkg.scripts ?? {}).map(name => [
    name,
    `cd deploy && npm run ${name} -- "$@"`
  ])
);
await writeFile(
  resolve(tmpDir.path, 'package.json'),
  JSON.stringify(
    {
      ...appPkg,
      dependencies: {},
      devDependencies: {},
      scripts: forwardedScripts
    },
    null,
    2
  ) + '\n'
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
