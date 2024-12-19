import nock from 'nock';
import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.js';
import { DocumentsApi } from '../client/api/index.js';
import type { Documents } from '../client/api/index.js';

describe('documents', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should get all documents', async () => {
    const collectionId = '7171c2b2-835b-4745-8824-ff5c7e98a416';
    const expectedResponse: Documents = {
      resources: [
        {
          metadata: [
            {
              key: 'url',
              value: ['http://hello.com', '123'],
              matchMode: 'ANY'
            }
          ],
          id: '500d1e93-270e-479e-abbd-83a2291e4f6d'
        }
      ],
      count: 1
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get(
        `/v2/lm/document-grounding/vector/collections/${collectionId}/documents`
      )
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: Documents =
      await DocumentsApi.vectorV1VectorEndpointsGetAllDocuments(
        collectionId,
        {},
        { 'AI-Resource-Group': 'default' }
      ).execute();

    expect(result).toEqual(expectedResponse);
  });
});
