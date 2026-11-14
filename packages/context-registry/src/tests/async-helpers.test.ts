import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.ts';
import {
  createDataDestinationAndWait,
  deleteDataDestinationAndWait
} from '../async-helpers.ts';

import type { CreateDataDestination } from '../client/context-registry/index.ts';

const resourceGroup = 'default';
const headers = { 'AI-Resource-Group': resourceGroup } as const;
const basePath = '/v2/tcr';
const name = 'my-destination';
const path = `${basePath}/dataDestinations/${name}`;

describe('context-registry async helpers', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('createDataDestinationAndWait polls until ACTIVE', async () => {
    const resource = {
      type: 'AZURE',
      name,
      createdAt: '2024-02-15T12:45:00.000Z',
      updatedAt: '2024-02-15T12:45:00.000Z'
    };

    const scope = nock(aiCoreDestination.url)
      .put(path)
      .reply(202, { name })
      .get(path)
      .reply(200, { ...resource, status: 'PROCESSING' })
      .get(path)
      .reply(200, { ...resource, status: 'ACTIVE' });

    const result = await createDataDestinationAndWait(
      name,
      { type: 'AZURE' } as unknown as CreateDataDestination,
      headers,
      { intervalMs: 0 }
    );

    expect(result.outcome).toBe('success');
    expect(result.resource).toMatchObject({ status: 'ACTIVE' });
    expect(scope.isDone()).toBe(true);
  });

  it('createDataDestinationAndWait reports a failure outcome on ERROR', async () => {
    const scope = nock(aiCoreDestination.url)
      .put(path)
      .reply(202, { name })
      .get(path)
      .reply(200, {
        type: 'AZURE',
        name,
        status: 'ERROR',
        errorMessage: 'credential validation failed',
        createdAt: '2024-02-15T12:45:00.000Z',
        updatedAt: '2024-02-15T12:45:00.000Z'
      });

    const result = await createDataDestinationAndWait(
      name,
      { type: 'AZURE' } as unknown as CreateDataDestination,
      headers,
      { intervalMs: 0 }
    );

    expect(result).toMatchObject({
      outcome: 'failure',
      reason: 'credential validation failed'
    });
    expect(scope.isDone()).toBe(true);
  });

  it('deleteDataDestinationAndWait polls until the status read returns 404', async () => {
    const scope = nock(aiCoreDestination.url)
      .delete(path)
      .reply(202, { name })
      .get(path)
      .reply(200, {
        type: 'AZURE',
        name,
        status: 'ACTIVE',
        createdAt: '2024-02-15T12:45:00.000Z',
        updatedAt: '2024-02-15T12:45:00.000Z'
      })
      .get(path)
      .reply(404, { error: 'not found' });

    const result = await deleteDataDestinationAndWait(name, headers, {
      intervalMs: 0
    });

    expect(result).toEqual({ outcome: 'success', resource: undefined });
    expect(scope.isDone()).toBe(true);
  });
});
