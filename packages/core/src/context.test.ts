import nock from 'nock';
import { mockClientCredentialsGrantCall } from '../../../test-util/mock-http.js';
import { getAiCoreDestination } from './context.js';

describe('context', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should throw if client credentials are not fetched', async () => {
    mockClientCredentialsGrantCall(
      {
        error: 'unauthorized',
        error_description: 'Bad credentials'
      },
      401
    );
    await expect(getAiCoreDestination()).rejects.toThrow(
      /Could not fetch client credentials token for service of type "AICORE_SERVICE_KEY"/
    );
  });
});
