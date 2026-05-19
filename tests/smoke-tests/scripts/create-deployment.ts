/* eslint-disable no-console */
import { execFile } from 'node:child_process';
import { copyFile, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const pExecFile = promisify(execFile);

const workspaceRoot = resolve(import.meta.dirname, '..', '..', '..');
const appDir = resolve(import.meta.dirname, '..');
const appName = '@sap-ai-sdk/smoke-tests';

async function prepareDeployment(): Promise<string> {
  const tmpDir = await mkdtemp(resolve(tmpdir(), 'cf-deploy-smoke-tests-'));
  const deployDir = resolve(tmpDir, 'deploy');
  console.log(`Temp dir: ${tmpDir}`);

  console.log('Running pnpm deploy...');
  const deployResult = await pExecFile(
    'pnpm',
    [
      '--filter',
      appName,
      'deploy',
      '--config.inject-workspace-packages=true',
      deployDir
    ],
    { cwd: workspaceRoot }
  );
  if (deployResult.stdout) {
    console.log(deployResult.stdout);
  }
  if (deployResult.stderr) {
    console.error(deployResult.stderr);
  }

  console.log('Writing .npmrc...');
  await writeFile(resolve(deployDir, '.npmrc'), 'ignore-scripts=true\n');

  console.log('Copying manifest.yml...');
  await copyFile(
    resolve(import.meta.dirname, '..', 'manifest.yml'),
    resolve(tmpDir, 'manifest.yml')
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
    resolve(tmpDir, 'package.json'),
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

  return tmpDir;
}

const tempDeployDir = await prepareDeployment();
console.log(`Running cf push from ${tempDeployDir}...`);
const cfResult = await pExecFile('cf', ['push'], { cwd: tempDeployDir });
if (cfResult.stdout) {
  console.log(cfResult.stdout);
}
if (cfResult.stderr) {
  console.error(cfResult.stderr);
}
console.log('cf push complete.');
