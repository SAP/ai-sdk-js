import nock from 'nock';
import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.js';
import { CollectionsApi, type CollectionsListResponse } from '../client/api/index.js';

describe('collections', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should get all collections', async () => {
    const expectedResponse: CollectionsListResponse = {
      resources: [
        {
          title: 'ai-sdk-js-demo',
          embeddingConfig: {
            modelName: 'text-embedding-ada-002-v2'
          },
          metadata: [],
          id: '7171c2b2-835b-4745-8824-ff5c7e98a416'
        }
      ],
      count: 1
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/v2/lm/document-grounding/vector/collections')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: CollectionsListResponse = await CollectionsApi.vectorV1VectorEndpointsGetAllCollections(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();

    expect(result).toEqual(expectedResponse);
  });
});
