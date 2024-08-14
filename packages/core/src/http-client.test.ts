import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockInference
} from '../../../test-util/mock-http.js';
import { dummyToken } from '../../../test-util/mock-jwt.js';
import { executeRequest } from './http-client.js';

describe('http-client', () => {
  beforeAll(() => {
    mockClientCredentialsGrantCall({ access_token: dummyToken }, 200);
  });
  afterEach(() => {
    nock.cleanAll();
  });
  it('should execute a request to the AI Core service', async () => {
    const mockPrompt = { prompt: 'some test prompt' };
    const mockPromptResponse = { completion: 'some test completion' };

    const scope = mockInference(
      {
        data: {
          deploymentConfiguration: { deploymentId: 'deployment_id' },
          prompt: 'some test prompt'
        }
      },
      {
        data: mockPromptResponse,
        status: 200
      }
    );
    const res = await executeRequest(
      { url: '/mock-endpoint', apiVersion: 'mock-api-version' },
      {
        deploymentConfiguration: { deploymentId: 'deployment_id' },
        ...mockPrompt
      }
    );

    expect(scope.isDone()).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockPromptResponse);
  }, 10000);
});
