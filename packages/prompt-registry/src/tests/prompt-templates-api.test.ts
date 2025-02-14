import nock from 'nock';
import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.js';
import { PromptTemplatesApi } from '../client/prompt-registry/index.js';
import type { PromptTemplateListResponse } from '../client/prompt-registry/index.js';

describe('prompt templates', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should get all prompt templates', async () => {
    const expectedResponse: PromptTemplateListResponse = {
      count: 1,
      resources: [
        {
          id: '00000000-0000-0000-0000-000000000000',
          name: 'test',
          version: '0.0.1',
          scenario: 'test',
          creationTimestamp: '2025-01-14T21:34:12.862000',
          managedBy: 'imperative',
          isVersionHead: true
        }
      ]
    };

    nock(aiCoreDestination.url)
      .get('/v2/lm/promptTemplates')
      .query({
        scenario: 'test'
      })
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: PromptTemplateListResponse =
      await PromptTemplatesApi.listPromptTemplates({
        scenario: 'test'
      }).execute();

    expect(result).toEqual(expectedResponse);
  });
});
