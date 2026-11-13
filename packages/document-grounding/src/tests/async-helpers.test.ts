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
const executionId = 'exec-1';
const triggerPath = `${basePath}/pipelines/trigger`;
const executionLocation = `${basePath}/pipelines/${pipelineId}/executions/${executionId}`;
const executionPath = `${basePath}/pipelines/${pipelineId}/executions/${executionId}`;

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
    it('polls the triggered execution (from the Location header), not pipeline-wide status', async () => {
      const scope = nock(aiCoreDestination.url)
        .post(triggerPath)
        .reply(202, {}, { Location: executionLocation })
        .get(executionPath)
        .reply(200, { id: executionId, status: 'INPROGRESS' })
        .get(executionPath)
        .reply(200, { id: executionId, status: 'FINISHED' });

      const result = await runPipelineAndWait({ pipelineId }, headers, {
        intervalMs: 0
      });

      expect(result.outcome).toBe('success');
      expect(scope.isDone()).toBe(true);
    });

    it('reports a partial outcome when the execution finishes with errors', async () => {
      nock(aiCoreDestination.url)
        .post(triggerPath)
        .reply(202, {}, { Location: executionLocation })
        .get(executionPath)
        .reply(200, { id: executionId, status: 'FINISHEDWITHERRORS' });

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
        .post(triggerPath)
        .reply(202, {}, { Location: executionLocation })
        .get(executionPath)
        .reply(200, { id: executionId, status: 'TIMEOUT' });

      const result = await runPipelineAndWait({ pipelineId }, headers, {
        intervalMs: 0
      });

      expect(result).toMatchObject({ outcome: 'failure', reason: 'TIMEOUT' });
    });

    it('throws when the trigger response has no Location header', async () => {
      nock(aiCoreDestination.url).post(triggerPath).reply(202, {});

      await expect(
        runPipelineAndWait({ pipelineId }, headers, { intervalMs: 0 })
      ).rejects.toThrow(/Location header/);
    });

    it('throws when pipelineId is missing', () => {
      expect(() => runPipelineAndWait({}, headers)).toThrow(/pipelineId/);
    });
  });
});
