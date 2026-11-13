import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { getReleasePlan } from '@changesets/get-release-plan';
import { getCommitsThatAddFiles } from '@changesets/git';

import { messageTypes } from '../.github/actions/check-pr/changeset-types.ts';

import type { ReleasePlan } from '@changesets/types';

type MessageType = (typeof messageTypes)[number];

interface ChangelogEntry {
  type: MessageType;
  summary: string;
  packages: Set<string>;
  commits: Set<string>;
}

const execFileAsync = promisify(execFile);

async function formatChangelog(
  releasePlan: ReleasePlan,
  version: string,
  cwd: string
): Promise<string> {
  const releasedPackages = new Set(
    releasePlan.releases.map(release => release.name)
  );
  const changesets = releasePlan.changesets.filter(changeset =>
    changeset.releases.some(release => releasedPackages.has(release.name))
  );
  const commits = await getCommitsThatAddFiles(
    changesets.map(changeset => `.changeset/${changeset.id}.md`),
    { cwd, short: true }
  );
  const entries = new Map<string, ChangelogEntry>();

  changesets.forEach((changeset, index) => {
    const match = changeset.summary.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
    const category = match?.[1].toLowerCase();
    const type = messageTypes.find(({ name, alternatives }) =>
      [name, ...alternatives].includes(category || '')
    );
    const summary = match?.[2].trim();
    if (!type || !summary) {
      throw new Error(`Invalid changeset summary in ${changeset.id}.`);
    }

    const key = `${type.name}\0${summary}`;
    const entry = entries.get(key) || {
      type,
      summary,
      packages: new Set<string>(),
      commits: new Set<string>()
    };
    changeset.releases
      .filter(release => releasedPackages.has(release.name))
      .forEach(release => {
        entry.packages.add(release.name.replace('@sap-ai-sdk/', ''));
      });
    if (commits[index]) {
      entry.commits.add(commits[index]);
    }
    entries.set(key, entry);
  });

  const sections = messageTypes.flatMap(type => {
    const messages = [...entries.values()]
      .filter(entry => entry.type.name === type.name)
      .map(entry => {
        const packages = [...entry.packages].sort().join(', ');
        const commit = entry.commits.size
          ? ` (${[...entry.commits].join(', ')})`
          : '';
        const [firstLine, ...remainingLines] = entry.summary.split('\n');
        return [
          `- [${packages}] ${firstLine}${commit}`,
          ...remainingLines
        ].join('\n');
      });
    return messages.length
      ? [`## ${type.title}\n\n${messages.join('\n')}`]
      : [];
  });
  return [`# ${version}`, ...sections].join('\n\n');
}

/**
 * Apply the native Changesets release plan and update the unified changelog and root version.
 * @param cwd - Workspace root directory.
 * @param releasePlan - Native release plan, if already loaded.
 * @returns The new fixed SDK version.
 */
export async function versionPackages(
  cwd = process.cwd(),
  releasePlan?: ReleasePlan
): Promise<string> {
  releasePlan ||= await getReleasePlan(cwd);
  if (releasePlan.preState?.mode === 'pre') {
    throw new Error(
      'Exit Changesets prerelease mode before making a stable release.'
    );
  }
  const releases = releasePlan.releases.filter(
    release => release.type !== 'none'
  );
  if (!releases.length) {
    throw new Error('No changesets to release.');
  }
  const versions = new Set(releases.map(release => release.newVersion));
  if (versions.size !== 1) {
    throw new Error('Expected one fixed SDK release version.');
  }
  const version = releases[0].newVersion;

  const rootPackagePath = resolve(cwd, 'package.json');
  const changelogPath = resolve(cwd, 'CHANGELOG.md');
  const rootChangelog = await readFile(changelogPath, 'utf8');
  const previousVersion = rootChangelog.match(/^# \d+\.\d+\.\d+$/m);
  if (previousVersion?.index === undefined) {
    throw new Error(
      'Could not find the first released version in CHANGELOG.md.'
    );
  }
  const changelog = await formatChangelog(releasePlan, version, cwd);
  const updatedChangelog = `${rootChangelog.slice(0, previousVersion.index).trimEnd()}\n\n${changelog}\n\n${rootChangelog.slice(previousVersion.index)}`;

  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    [fileURLToPath(import.meta.resolve('@changesets/cli/bin.js')), 'version'],
    { cwd }
  );
  process.stdout.write(stdout);
  process.stderr.write(stderr);
  const rootPackage = JSON.parse(await readFile(rootPackagePath, 'utf8'));
  await writeFile(
    rootPackagePath,
    `${JSON.stringify({ ...rootPackage, version }, null, 2)}\n`
  );
  await writeFile(changelogPath, updatedChangelog);
  return version;
}

if (process.argv[1] && import.meta.filename === resolve(process.argv[1])) {
  await versionPackages();
}
