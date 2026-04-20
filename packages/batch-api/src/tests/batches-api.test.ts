import nock from 'nock';
import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.js';
import { BatchesApi } from '../client/batch-service/index.js';
import type { BatchListResponse } from '../client/batch-service/index.js';

describe('batches api', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should list all batches', async () => {
    const expectedResponse: BatchListResponse = {
      count: 1,
      resources: [
        {
          id: '00000000-0000-0000-0000-000000000000',
          type: 'chat-completions',
          provider: 'openai',
          created_at: '2026-01-01T00:00:00.000Z',
          status: 'completed'
        }
      ]
    };

    nock(aiCoreDestination.url)
      .get('/v2/llm-batch-service/v1/batches')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: BatchListResponse = await BatchesApi.listBatches({
      'AI-Resource-Group': 'ai-sdk-js-e2e',
      'AI-Main-Tenant': 'tta-m-sap-internal'
    }).execute();

    expect(result).toEqual(expectedResponse);
  });
});
