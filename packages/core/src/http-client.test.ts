import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination
} from '../../../test-util/mock-http.js';
import { executeRequest } from './http-client.js';

describe('http-client', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should execute a request to the AI Core service', async () => {
    const mockPrompt = { prompt: 'some test prompt' };
    const mockPromptResponse = { completion: 'some test completion' };

    const scope = nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-resource-group': 'default',
        'ai-client-type': 'AI SDK JavaScript'
      }
    })
      .post('/v2/some/endpoint', mockPrompt)
      .query({ 'api-version': 'mock-api-version' })
      .reply(200, mockPromptResponse);

    const res = await executeRequest(
      { url: '/some/endpoint', apiVersion: 'mock-api-version' },
      mockPrompt
    );
    expect(scope.isDone()).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockPromptResponse);
  }, 10000);
});
