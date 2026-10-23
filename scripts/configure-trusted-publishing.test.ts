import { describe, expect, it } from 'vitest';

import {
  getObsoleteTrustActions,
  getTrustActions,
  parseJsonObjectSequence,
  type TrustConfiguration,
  type TrustTarget
} from './configure-trusted-publishing.ts';

const releaseTarget: TrustTarget = {
  name: 'release',
  workflowFile: 'publish-release.yml',
  environment: 'release'
};

const canaryTarget: TrustTarget = {
  name: 'canary',
  workflowFile: 'publish-canary.yml',
  environment: 'canary-release'
};

describe('parse npm trust output', () => {
  it('parses multiple concatenated JSON objects', () => {
    const output = `{
  "id": "release-id",
  "type": "github",
  "file": "publish-release.yml",
  "permissions": ["createPackage"]
}
{
  "id": "canary-id",
  "type": "github",
  "file": "publish-canary.yml",
  "repository": "SAP/ai-sdk-js"
}`;

    expect(parseJsonObjectSequence(output)).toEqual([
      {
        id: 'release-id',
        type: 'github',
        file: 'publish-release.yml',
        permissions: ['createPackage']
      },
      {
        id: 'canary-id',
        type: 'github',
        file: 'publish-canary.yml',
        repository: 'SAP/ai-sdk-js'
      }
    ]);
  });
});

describe('release trust reconciliation', () => {
  it('replaces lowercase release repository casing without touching other publishers', () => {
    const configurations: TrustConfiguration[] = [
      {
        id: 'stale-release',
        type: 'github',
        file: 'publish-release.yml',
        repository: 'sap/ai-sdk-js',
        environment: 'release',
        permissions: ['createPackage']
      },
      {
        id: 'canary',
        type: 'github',
        file: 'publish-canary.yml',
        repository: 'sap/ai-sdk-js',
        environment: 'canary-release',
        permissions: ['createPackage']
      },
      {
        id: 'gitlab-release',
        type: 'gitlab',
        file: 'publish-release.yml',
        repository: 'sap/ai-sdk-js',
        environment: 'release',
        permissions: ['createPackage']
      }
    ];

    expect(getTrustActions(configurations, releaseTarget)).toEqual([
      { type: 'create' },
      { type: 'revoke', id: 'stale-release' }
    ]);
  });

  it('keeps one valid publisher and removes stale release environments', () => {
    const configurations: TrustConfiguration[] = [
      {
        id: 'valid-release',
        type: 'github',
        file: 'publish-release.yml',
        repository: 'SAP/ai-sdk-js',
        environment: 'release',
        permissions: ['createPackage']
      },
      {
        id: 'stale-release',
        type: 'github',
        file: 'publish-release.yml',
        repository: 'sap/ai-sdk-js',
        environment: 'release',
        permissions: ['createPackage']
      },
      {
        id: 'wrong-environment',
        type: 'github',
        file: 'publish-release.yml',
        repository: 'SAP/ai-sdk-js',
        environment: 'canary-release',
        permissions: ['createPackage']
      },
      {
        id: 'missing-environment',
        type: 'github',
        file: 'publish-release.yml',
        repository: 'SAP/ai-sdk-js',
        permissions: ['createPackage']
      }
    ];

    expect(getTrustActions(configurations, releaseTarget)).toEqual([
      { type: 'revoke', id: 'stale-release' },
      { type: 'revoke', id: 'wrong-environment' },
      { type: 'revoke', id: 'missing-environment' }
    ]);
  });

  it('revokes identical claims before recreating missing publish permission', () => {
    expect(
      getTrustActions(
        [
          {
            id: 'stage-only',
            type: 'github',
            file: 'publish-release.yml',
            repository: 'SAP/ai-sdk-js',
            environment: 'release',
            permissions: ['createStagedPackage']
          }
        ],
        releaseTarget
      )
    ).toEqual([{ type: 'revoke', id: 'stage-only' }, { type: 'create' }]);
  });

  it('explicitly recreates an already-matching publisher', () => {
    expect(
      getTrustActions(
        [
          {
            id: 'expired-release',
            type: 'github',
            file: 'publish-release.yml',
            repository: 'SAP/ai-sdk-js',
            environment: 'release',
            permissions: ['createPackage']
          }
        ],
        releaseTarget,
        true
      )
    ).toEqual([{ type: 'revoke', id: 'expired-release' }, { type: 'create' }]);
  });

  it('creates canary only when its desired publisher is absent', () => {
    const releaseConfiguration: TrustConfiguration = {
      id: 'release',
      type: 'github',
      file: 'publish-release.yml',
      repository: 'SAP/ai-sdk-js',
      environment: 'release',
      permissions: ['createPackage']
    };
    const canaryConfiguration: TrustConfiguration = {
      id: 'canary',
      type: 'github',
      file: 'publish-canary.yml',
      repository: 'SAP/ai-sdk-js',
      environment: 'canary-release',
      permissions: ['createPackage']
    };

    expect(getTrustActions([releaseConfiguration], canaryTarget)).toEqual([
      { type: 'create' }
    ]);
    expect(
      getTrustActions([releaseConfiguration, canaryConfiguration], canaryTarget)
    ).toEqual([]);
  });

  it('revokes obsolete GitHub publish.yml publishers only', () => {
    const configurations: TrustConfiguration[] = [
      {
        id: 'obsolete-publish',
        type: 'github',
        file: 'publish.yml',
        repository: 'SAP/ai-sdk-js',
        permissions: ['createPackage']
      },
      {
        id: 'gitlab-publish',
        type: 'gitlab',
        file: 'publish.yml',
        repository: 'SAP/ai-sdk-js',
        permissions: ['createPackage']
      },
      {
        id: 'other-workflow',
        type: 'github',
        file: 'other-publish.yml',
        repository: 'SAP/ai-sdk-js',
        permissions: ['createPackage']
      }
    ];

    expect(getObsoleteTrustActions(configurations)).toEqual([
      { type: 'revoke', id: 'obsolete-publish' }
    ]);
  });
});
