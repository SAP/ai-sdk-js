import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { describe, expect, it, vi } from 'vitest';

import { linkCommitHashes } from './add-changelog.ts';

const execFileAsync = promisify(execFile);
const commitLinkPrefix = 'https://github.com/SAP/ai-sdk-js/commit/';
const firstHash = 'abc1234';
const secondHash = 'def5678';
const firstFullHash = firstHash.padEnd(40, '0');
const secondFullHash = secondHash.padEnd(40, '0');

function resolveCommitHash(commitHash: string): Promise<string | null> {
  return Promise.resolve(
    commitHash === firstHash ? firstFullHash : secondFullHash
  );
}

describe('linkCommitHashes', () => {
  it('links a single commit reference', async () => {
    await expect(
      linkCommitHashes('- Fix a bug. (abc1234)', resolveCommitHash)
    ).resolves.toBe(
      `- Fix a bug. ([abc1234](${commitLinkPrefix}${firstFullHash}))`
    );
  });

  it('links every commit in a grouped reference', async () => {
    const resolver = vi.fn<typeof resolveCommitHash>(resolveCommitHash);

    await expect(
      linkCommitHashes('- Fix a bug. (abc1234, def5678)', resolver)
    ).resolves.toBe(
      `- Fix a bug. ([abc1234](${commitLinkPrefix}${firstFullHash}), [def5678](${commitLinkPrefix}${secondFullHash}))`
    );
    expect(resolver.mock.calls).toEqual([[firstHash], [secondHash]]);
  });

  it('links grouped full-length hashes with Git-abbreviated labels', async () => {
    const expandHash = vi.fn<typeof resolveCommitHash>();
    const shortenHash = vi.fn<typeof resolveCommitHash>(async commitHash =>
      commitHash === firstFullHash ? firstHash : secondHash
    );

    await expect(
      linkCommitHashes(
        `- Fix a bug. (${firstFullHash}, ${secondFullHash})`,
        expandHash,
        shortenHash
      )
    ).resolves.toBe(
      `- Fix a bug. ([${firstHash}](${commitLinkPrefix}${firstFullHash}), [${secondHash}](${commitLinkPrefix}${secondFullHash}))`
    );
    expect(expandHash).not.toHaveBeenCalled();
    expect(shortenHash.mock.calls).toEqual([[firstFullHash], [secondFullHash]]);
  });

  it('uses Git to abbreviate full hashes by default', async () => {
    const { stdout: fullHash } = await execFileAsync('git', [
      'rev-parse',
      'HEAD'
    ]);
    const { stdout: shortHash } = await execFileAsync('git', [
      'rev-parse',
      '--short',
      fullHash.trim()
    ]);

    await expect(
      linkCommitHashes(`- Fix a bug. (${fullHash.trim()})`)
    ).resolves.toBe(
      `- Fix a bug. ([${shortHash.trim()}](${commitLinkPrefix}${fullHash.trim()}))`
    );
  });

  it('preserves a full hash when Git cannot abbreviate it', async () => {
    await expect(
      linkCommitHashes(
        `- Fix a bug. (${firstFullHash}, ${secondFullHash})`,
        resolveCommitHash,
        async commitHash => {
          if (commitHash === secondFullHash) {
            throw new Error('Could not abbreviate commit.');
          }
          return firstHash;
        }
      )
    ).resolves.toBe(
      `- Fix a bug. ([${firstHash}](${commitLinkPrefix}${firstFullHash}), ${secondFullHash})`
    );
  });

  it('links grouped and single references on separate lines', async () => {
    await expect(
      linkCommitHashes(
        '- Fix a bug. (abc1234, def5678)\n- Add a feature. (def5678)',
        resolveCommitHash
      )
    ).resolves.toBe(
      `- Fix a bug. ([abc1234](${commitLinkPrefix}${firstFullHash}), [def5678](${commitLinkPrefix}${secondFullHash}))\n- Add a feature. ([def5678](${commitLinkPrefix}${secondFullHash}))`
    );
  });

  it.each(['unresolved', 'rejected'])(
    'preserves a hash that is %s while linking other commits in the group',
    async failure => {
      const resolver = vi.fn<typeof resolveCommitHash>(async commitHash => {
        if (commitHash === secondHash) {
          if (failure === 'rejected') {
            throw new Error('Could not resolve commit.');
          }
          return null;
        }
        return firstFullHash;
      });

      await expect(
        linkCommitHashes('- Fix a bug. (abc1234, def5678)', resolver)
      ).resolves.toBe(
        `- Fix a bug. ([abc1234](${commitLinkPrefix}${firstFullHash}), def5678)`
      );
    }
  );

  it('preserves a group when none of its hashes resolve', async () => {
    const changelog = '- Fix a bug. (abc1234, def5678)';

    await expect(linkCommitHashes(changelog, async () => null)).resolves.toBe(
      changelog
    );
  });

  it('ignores non-reference text and already linked commits', async () => {
    const changelog = [
      '- Text (abc1234, def5678) within a summary.',
      '- Text (abc1234, not-a-hash)',
      '- Text (abc123)',
      `- Linked ([abc1234](${commitLinkPrefix}${firstFullHash}))`
    ].join('\n');
    const resolver = vi.fn<typeof resolveCommitHash>(resolveCommitHash);

    await expect(linkCommitHashes(changelog, resolver)).resolves.toBe(
      changelog
    );
    expect(resolver).not.toHaveBeenCalled();
  });
});
