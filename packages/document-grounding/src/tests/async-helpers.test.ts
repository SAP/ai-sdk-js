import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.ts';
import {
  createCollectionAndWait,
  runPipelineAndWait
} from '../async-helpers.ts';

import type { CollectionRequest } from '../client/api/index.ts';

const headers = { 'AI-Resource-Group': 'default' } as const;
const basePath = '/v2/lm/document-grounding';
const collectionId = 'col-123';
const creationStatusPath = `${basePath}/vector/collections/${collectionId}/creationStatus`;
const pipelineId = 'pipe-1';
const statusPath = `${basePath}/pipelines/${pipelineId}/status`;

describe('document-grounding async helpers', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('createCollectionAndWait', () => {
    it('resolves the collection id from the Location header and polls until created', async () => {
      const scope = nock(aiCoreDestination.url)
        .post(`${basePath}/vector/collections`)
        .reply(202, {}, { Location: creationStatusPath })
        .get(creationStatusPath)
        .reply(200, { monitorURL: 'https://example.test/monitor' })
        .get(creationStatusPath)
        .reply(200, {
          collectionURL: `https://example.test/collections/${collectionId}`,
          status: 'CREATED'
        });

      const result = await createCollectionAndWait(
        { title: 'my-collection' } as unknown as CollectionRequest,
        headers,
        { intervalMs: 0 }
      );

      expect(result.outcome).toBe('success');
      expect(result.resource).toMatchObject({
        collectionURL: `https://example.test/collections/${collectionId}`
      });
      expect(scope.isDone()).toBe(true);
    });

    it('throws when the create response has no Location header', async () => {
      nock(aiCoreDestination.url)
        .post(`${basePath}/vector/collections`)
        .reply(202, {});

      await expect(
        createCollectionAndWait(
          { title: 'my-collection' } as unknown as CollectionRequest,
          headers,
          { intervalMs: 0 }
        )
      ).rejects.toThrow(/Location header/);
    });
  });

  describe('runPipelineAndWait', () => {
    it('reports success when the pipeline finishes', async () => {
      const scope = nock(aiCoreDestination.url)
        .post(`${basePath}/pipelines/trigger`)
        .reply(202, {})
        .get(statusPath)
        .reply(200, { status: 'INPROGRESS' })
        .get(statusPath)
        .reply(200, { status: 'FINISHED' });

      const result = await runPipelineAndWait({ pipelineId }, headers, {
        intervalMs: 0
      });

      expect(result.outcome).toBe('success');
      expect(scope.isDone()).toBe(true);
    });

    it('reports a partial outcome when the pipeline finishes with errors', async () => {
      nock(aiCoreDestination.url)
        .post(`${basePath}/pipelines/trigger`)
        .reply(202, {})
        .get(statusPath)
        .reply(200, { status: 'FINISHEDWITHERRORS' });

      const result = await runPipelineAndWait({ pipelineId }, headers, {
        intervalMs: 0
      });

      expect(result).toMatchObject({
        outcome: 'partial',
        reason: 'pipeline finished with errors'
      });
    });

    it('reports a failure outcome on a terminal failure status', async () => {
      nock(aiCoreDestination.url)
        .post(`${basePath}/pipelines/trigger`)
        .reply(202, {})
        .get(statusPath)
        .reply(200, { status: 'TIMEOUT' });

      const result = await runPipelineAndWait({ pipelineId }, headers, {
        intervalMs: 0
      });

      expect(result).toMatchObject({ outcome: 'failure', reason: 'TIMEOUT' });
    });

    it('throws when pipelineId is missing', () => {
      expect(() => runPipelineAndWait({}, headers)).toThrow(/pipelineId/);
    });
  });
});
