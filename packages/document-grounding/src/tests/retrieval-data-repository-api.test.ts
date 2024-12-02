import nock from 'nock';
import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.js';
import { RetrievalDataRepositoryApi } from '../client/api/index.js';
import type { DataRepositories } from '../../internal.js';

describe('retrieval data repository', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should get all data repositories', async () => {
    const expectedResponse: DataRepositories = {
      resources: [
        {
          id: '717dc2b3-835b-4725-8854-fa5c7698a416',
          title: 'ai-sdk-js-demo',
          metadata: [],
          type: 'vector'
        }
      ],
      count: 1
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/v2/lm/document-grounding/retrieval/dataRepositories')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: DataRepositories = await RetrievalDataRepositoryApi.retrievalV1RetrievalEndpointsGetDataRepositories(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();

    expect(result).toEqual(expectedResponse);
  });
});
