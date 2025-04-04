import { readdir, readFile, writeFile } from 'fs/promises';
import { getPackageVersion } from './get-package-version.js';

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

  const headerWithVersion = `\n## ${v} [Core Modules] - ${month} ${day}, ${year}`;

  return [headerWithVersion, logs].join('\n');
}

async function getReleaseNotesFilePath(): Promise<string> {
  const majorVersion = (await getPackageVersion()).split('.')[0];

  if (await isVersioned(majorVersion)) {
    return `./ai-sdk/docs-js_versioned_docs/version-v${majorVersion}/release-notes.mdx`;
  }
  return './ai-sdk/docs-js/release-notes.mdx';
}

async function isVersioned(majorVersion: string): Promise<boolean> {
  const versionedInDocusaurus = await readdir(
    './ai-sdk/docs-js_versioned_docs/'
  );
  // The docusaurus folders are called version-v1, version-v2 so match regex for ends with v1, v2, ...
  return !!versionedInDocusaurus.find(folder =>
    folder.match(new RegExp(`v${majorVersion}$`))
  );
}

/**
 * Adds the current changelog entry to the release notes file.
 * @returns Promise that resolves when the changelog is added.
 */
export async function addCurrentChangelog(): Promise<void> {
  const changelog = await getChangelogWithVersion();
  const releaseNotesFilePath = await getReleaseNotesFilePath();
  let releaseNotes: string;

  try {
    releaseNotes = await readFile(releaseNotesFilePath, {
      encoding: 'utf8'
    });
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      console.log(
        `Target release notes file not found at ${releaseNotesFilePath}. Using fallback.`
      );
      releaseNotes = await readFile('scripts/release-notes.mdx', {
        encoding: 'utf8'
      });
    } else {
      throw error;
    }
  }

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
