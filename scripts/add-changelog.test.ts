import { linkCommitHashes } from './add-changelog.js';

describe('link commit hashes', () => {
  it('links short commit hash references to full commit hashes', async () => {
    await expect(
      linkCommitHashes(
        '- [core] Add model support. (029f091)',
        async () => '029f0911234567890abcdef1234567890abcdef1'
      )
    ).resolves.toEqual(
      '- [core] Add model support. ([029f091](https://github.com/SAP/ai-sdk-js/commit/029f0911234567890abcdef1234567890abcdef1))'
    );
  });

  it('links full commit hash references', async () => {
    const commitHash = '029f0911234567890abcdef1234567890abcdef1';

    await expect(
      linkCommitHashes(
        `- [core] Add model support. (${commitHash})`,
        async hash => hash
      )
    ).resolves.toEqual(
      `- [core] Add model support. ([${commitHash}](https://github.com/SAP/ai-sdk-js/commit/${commitHash}))`
    );
  });

  it('leaves existing links unchanged', async () => {
    const changelog =
      '- [core] Add model support. ([029f091](https://github.com/SAP/ai-sdk-js/commit/029f091))';

    await expect(
      linkCommitHashes(changelog, async () => {
        throw new Error('Should not resolve existing links.');
      })
    ).resolves.toEqual(changelog);
  });
});
