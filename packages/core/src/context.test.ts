import nock from 'nock';
import { mockClientCredentialsGrantCall } from '../../../test-util/mock-http.js';
import { dummyToken } from '../../../test-util/mock-jwt.js';
import { getAiCoreDestination } from './context.js';

describe('context', () => {
  afterAll(() => {
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
      /Could not fetch client credentials token for service of type "aicore"/
    );
  });

  it('should verify environment variable is updated aiCoreServiceBinding global var every time', async () => {
    const mockServiceKey1 = {
      clientid: 'clientid1',
      clientsecret: 'clientsecret1',
      url: 'https://example1.authentication.eu12.hana.ondemand.com',
      identityzone: 'examplezone1',
      identityzoneid: 'examplezoneid1',
      appname: 'appname1',
      serviceurls: {
        AI_API_URL: 'https://api1.ai.ml.hana.ondemand.com'
      }
    };

    const mockServiceKey2 = {
      clientid: 'clientid2',
      clientsecret: 'clientsecret2',
      url: 'https://example2.authentication.eu12.hana.ondemand.com',
      identityzone: 'examplezone2',
      identityzoneid: 'examplezoneid2',
      appname: 'appname2',
      serviceurls: {
        AI_API_URL: 'https://api2.ai.ml.hana.ondemand.com'
      }
    };

    // First call with first service key
    process.env.AICORE_SERVICE_KEY = JSON.stringify(mockServiceKey1);

    // Mock the OAuth token call for first service key
    nock('https://example1.authentication.eu12.hana.ondemand.com')
      .post('/oauth/token')
      .reply(200, {
        access_token: dummyToken,
        token_type: 'Bearer',
        expires_in: 3600
      });

    const result1 = await getAiCoreDestination();
    expect(result1).toBeDefined();
    expect(result1.url).toBe('https://api1.ai.ml.hana.ondemand.com');

    // Second call with different service key - this proves env var is checked every time
    process.env.AICORE_SERVICE_KEY = JSON.stringify(mockServiceKey2);

    // Mock the OAuth token call for second service key
    nock('https://example2.authentication.eu12.hana.ondemand.com')
      .post('/oauth/token')
      .reply(200, {
        access_token: dummyToken,
        token_type: 'Bearer',
        expires_in: 3600
      });

    const result2 = await getAiCoreDestination();
    expect(result2).toBeDefined();
    expect(result2.url).toBe('https://api2.ai.ml.hana.ondemand.com');
  });
});
