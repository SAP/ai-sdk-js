import { execFile } from 'child_process';
import { readdir, readFile, writeFile } from 'fs/promises';
import { promisify } from 'util';
import { getPackageVersion } from './get-package-version.ts';

const COMMIT_LINK_PREFIX = 'https://github.com/SAP/ai-sdk-js/commit/';
const COMMIT_HASH_REFERENCE = /\(([0-9a-f]{7,40})\)$/gm;
const execFileAsync = promisify(execFile);

async function expandCommitHash(commitHash: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync('git', ['rev-parse', commitHash]);
    return stdout.trim();
  } catch {
    return null;
  }
}

/**
 * Converts changelog commit hash references to GitHub commit links.
 * @param changelog - Changelog content.
 * @param resolveCommitHash - Resolver that expands short commit hashes.
 * @returns Changelog content with linked commit hashes.
 */
export async function linkCommitHashes(
  changelog: string,
  resolveCommitHash = expandCommitHash
): Promise<string> {
  const replacements = await Promise.all(
    [...changelog.matchAll(COMMIT_HASH_REFERENCE)].map(async match => {
      let expandedCommitHash: string | null;

      try {
        expandedCommitHash = await resolveCommitHash(match[1]);
      } catch {
        expandedCommitHash = null;
      }

      return {
        match: match[0],
        commitHash: match[1],
        expandedCommitHash
      };
    })
  );

  return changelog.replace(COMMIT_HASH_REFERENCE, () => {
    const replacement = replacements.shift();
    if (!replacement) {
      throw new Error('Could not find replacement for commit hash.');
    }
    if (!replacement.expandedCommitHash) {
      return replacement.match;
    }

    return `([${replacement.commitHash}](${COMMIT_LINK_PREFIX}${replacement.expandedCommitHash}))`;
  });
}

async function getChangelogWithVersion(v?: string): Promise<string> {
  v = v || (await getPackageVersion());
  const changelog = await readFile('CHANGELOG.md', { encoding: 'utf8' });
  const [, olderLogs] = changelog.split(`\n# ${v}`);
  if (!olderLogs) {
    throw new Error(`Can not find version ${v} in CHANGELOG.md`);
  }
  let logs = olderLogs.split('\n# ')[0];
  logs = '\n' + logs.slice(logs.indexOf('\n##') + 1);
  logs = logs.replace(/## /g, '### ');

  const date = new Date();
  const day = date.toLocaleString('default', { day: '2-digit' });
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const headerWithVersion = `\n## ${v} - ${month} ${day}, ${year}`;

  return [headerWithVersion, await linkCommitHashes(logs)].join('\n');
}

async function getReleaseNotesFilePath(): Promise<string> {
  const majorVersion = (await getPackageVersion()).split('.')[0];

  if (await isVersioned(majorVersion)) {
    return `./ai-sdk-docs/docs-js_versioned_docs/version-v${majorVersion}/release-notes.mdx`;
  }
  return './ai-sdk-docs/docs-js/release-notes.mdx';
}

async function isVersioned(majorVersion: string): Promise<boolean> {
  try {
    const versionedInDocusaurus = await readdir(
      './ai-sdk-docs/docs-js_versioned_docs/'
    );
    // The docusaurus folders are called version-v1, version-v2 so match regex for ends with v1, v2, ...
    return !!versionedInDocusaurus.find(folder =>
      folder.match(new RegExp(`v${majorVersion}$`))
    );
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

/**
 * Adds the current changelog entry to the release notes file.
 * @returns Promise that resolves when the changelog is added.
 */
export async function addCurrentChangelog(): Promise<void> {
  const changelog = await getChangelogWithVersion();
  const releaseNotesFilePath = await getReleaseNotesFilePath();
  const releaseNotes = await readFile(releaseNotesFilePath, {
    encoding: 'utf8'
  });

  const releaseNotesArray = releaseNotes.split(
    '<!-- This line is used for our release notes automation -->\n'
  );
  const newContent = changelog + releaseNotesArray[1];
  releaseNotesArray[1] = newContent;
  const newReleaseNotes = releaseNotesArray.join(
    '<!-- This line is used for our release notes automation -->\n'
  );
  await writeFile(releaseNotesFilePath, newReleaseNotes);
}
