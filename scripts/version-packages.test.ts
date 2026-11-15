import { execFile } from 'node:child_process';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { versionPackages } from './version-packages.ts';

interface FixturePackage {
  name: string;
  version: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

const execFileAsync = promisify(execFile);
const repository = resolve(import.meta.dirname, '..');
const cli = fileURLToPath(import.meta.resolve('@changesets/cli/bin.js'));
let cwd: string;

async function writeFixtureFile(file: string, content: string): Promise<void> {
  const destination = resolve(cwd, file);
  await mkdir(resolve(destination, '..'), { recursive: true });
  await writeFile(destination, content);
}

async function readPackage(directory = '.'): Promise<FixturePackage> {
  return JSON.parse(
    await readFile(resolve(cwd, directory, 'package.json'), 'utf8')
  );
}

async function writeChangeset(
  releases: string,
  summary: string
): Promise<void> {
  await writeFixtureFile(
    '.changeset/release.md',
    `---\n${releases}\n---\n\n${summary}\n`
  );
}

async function runCli(...args: string[]): Promise<void> {
  await execFileAsync(process.execPath, [cli, ...args], { cwd });
}

async function commitFixture(message: string): Promise<string> {
  await execFileAsync(
    'git',
    [
      '-c',
      'user.name=Release Test',
      '-c',
      'user.email=release-test@example.invalid',
      '-c',
      'commit.gpgsign=false',
      '-c',
      `core.hooksPath=${resolve(cwd, 'no-hooks')}`,
      'commit',
      '--allow-empty',
      '-qm',
      message
    ],
    { cwd }
  );
  const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd });
  return stdout.trim();
}

beforeEach(async () => {
  cwd = await mkdtemp(resolve(tmpdir(), 'ai-sdk-release-test-'));
  await writeFixtureFile(
    'pnpm-workspace.yaml',
    'packages:\n  - packages/*\n  - sample-code\n'
  );
  const packages: Record<string, FixturePackage> = {
    '.': { name: 'sap-ai-sdk', version: '2.17.0', private: true },
    'packages/core': { name: '@sap-ai-sdk/core', version: '2.18.0' },
    'packages/ai-api': {
      name: '@sap-ai-sdk/ai-api',
      version: '2.17.0',
      dependencies: { '@sap-ai-sdk/core': 'workspace:^' }
    },
    'sample-code': {
      name: '@sap-ai-sdk/sample-code',
      version: '1.0.0',
      private: true,
      peerDependencies: { '@sap-ai-sdk/core': '*' }
    }
  };
  await Promise.all(
    Object.entries(packages).map(([directory, packageJson]) =>
      writeFixtureFile(`${directory}/package.json`, JSON.stringify(packageJson))
    )
  );
  await writeFixtureFile(
    'CHANGELOG.md',
    '# Next\n\n# 2.17.0\n\n- Previously released change.\n'
  );
  await mkdir(resolve(cwd, '.changeset'), { recursive: true });
  await copyFile(
    resolve(repository, '.changeset/config.json'),
    resolve(cwd, '.changeset/config.json')
  );
  await symlink(
    resolve(repository, 'node_modules'),
    resolve(cwd, 'node_modules')
  );
  await execFileAsync('git', ['init', '-q', '-b', 'main'], { cwd });
  await commitFixture('Fixture baseline');
});

afterEach(async () => {
  await rm(cwd, { recursive: true, force: true });
});

describe('version-packages', () => {
  it('uses the fixed release target rather than incrementing the stale root version', async () => {
    await writeChangeset(
      "'@sap-ai-sdk/core': patch",
      '[fix] Preserve SDK behavior.'
    );

    await expect(versionPackages(cwd)).resolves.toBe('2.18.1');
    expect((await readPackage()).version).toBe('2.18.1');
    expect((await readPackage('packages/core')).version).toBe('2.18.1');
    expect((await readPackage('packages/ai-api')).version).toBe('2.18.1');
    expect((await readPackage('sample-code')).version).toBe('1.0.0');
  });

  it('merges package attribution and preserves multiline summaries without republishing old entries', async () => {
    await writeChangeset(
      "'@sap-ai-sdk/core': patch\n'@sap-ai-sdk/ai-api': patch",
      '[Improvement] Preserve release details.\n\n  - Keep the nested detail.'
    );
    await versionPackages(cwd);

    const changelog = await readFile(resolve(cwd, 'CHANGELOG.md'), 'utf8');
    const currentRelease = changelog
      .split('# 2.18.1\n')[1]
      .split('# 2.17.0\n')[0];
    expect(currentRelease).toContain('## Improvements');
    expect(currentRelease).toContain(
      '- [ai-api, core] Preserve release details.'
    );
    expect(currentRelease).toContain('  - Keep the nested detail.');
    expect(currentRelease).not.toContain('Previously released change.');
  });

  it('merges identical summaries with full commit hashes', async () => {
    await writeChangeset(
      "'@sap-ai-sdk/core': patch",
      '[fix] Preserve SDK behavior.'
    );
    await execFileAsync('git', ['add', '.changeset/release.md'], { cwd });
    const firstCommit = await commitFixture('Add first changeset');
    await writeFixtureFile(
      '.changeset/second.md',
      "---\n'@sap-ai-sdk/ai-api': patch\n---\n\n[fix] Preserve SDK behavior.\n"
    );
    await execFileAsync('git', ['add', '.changeset/second.md'], { cwd });
    const secondCommit = await commitFixture('Add second changeset');

    await versionPackages(cwd);

    const changelog = await readFile(resolve(cwd, 'CHANGELOG.md'), 'utf8');
    expect(firstCommit).toHaveLength(40);
    expect(secondCommit).toHaveLength(40);
    expect(changelog).toContain(
      `- [ai-api, core] Preserve SDK behavior. (${firstCommit}, ${secondCommit})`
    );
  });

  it('refuses an empty plan without changing the root version or changelog', async () => {
    const root = await readFile(resolve(cwd, 'package.json'), 'utf8');
    const changelog = await readFile(resolve(cwd, 'CHANGELOG.md'), 'utf8');

    await expect(versionPackages(cwd)).rejects.toThrow(
      'No changesets to release.'
    );
    expect(await readFile(resolve(cwd, 'package.json'), 'utf8')).toBe(root);
    expect(await readFile(resolve(cwd, 'CHANGELOG.md'), 'utf8')).toBe(
      changelog
    );
  });

  it('allows native major versioning for a Changesets Action version script', async () => {
    await writeChangeset(
      "'@sap-ai-sdk/core': major",
      '[compat] Change the SDK contract.'
    );

    await expect(versionPackages(cwd)).resolves.toBe('3.0.0');
    expect((await readPackage()).version).toBe('3.0.0');
    expect((await readPackage('packages/ai-api')).version).toBe('3.0.0');
  });

  it('preserves sample wildcard peers through canary versioning and a stable prerelease exit', async () => {
    await writeChangeset("'@sap-ai-sdk/core': patch", '[impr] Canary release.');
    await runCli('pre', 'enter', 'release-test');
    await runCli('version');
    expect((await readPackage('packages/core')).version).toBe(
      '2.18.1-release-test.0'
    );
    expect((await readPackage('packages/ai-api')).version).toBe(
      '2.18.1-release-test.0'
    );
    expect((await readPackage('sample-code')).peerDependencies).toEqual({
      '@sap-ai-sdk/core': '*'
    });
    await expect(versionPackages(cwd)).rejects.toThrow(
      'Exit Changesets prerelease mode'
    );

    await runCli('pre', 'exit');
    await expect(versionPackages(cwd)).resolves.toBe('2.18.1');
    expect((await readPackage('sample-code')).peerDependencies).toEqual({
      '@sap-ai-sdk/core': '*'
    });
  });
});
