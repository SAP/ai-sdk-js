import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { registerDestination } from '@sap-cloud-sdk/connectivity';
import {
  mockClientCredentialsGrantCall,
  createDestinationTokens
} from '../../../test-util/mock-http.js';
import { createTokenProvider } from './token-provider.js';

describe('createTokenProvider', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('returns a function', () => {
    expect(typeof createTokenProvider()).toBe('function');
  });

  it('returned function resolves to the bearer token', async () => {
    const provider = createTokenProvider();
    const token = await provider();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('throws when no auth tokens are available on the destination', async () => {
    registerDestination({
      name: 'no-token-dest',
      url: 'https://api.ai.ml.hana.ondemand.com'
    });

    await expect(
      createTokenProvider({
        destinationName: 'no-token-dest',
        useCache: false
      })()
    ).rejects.toThrow(
      'Could not retrieve authentication token from AI Core destination.'
    );
  });

  it('passes the destination to getAiCoreDestination', async () => {
    const customToken = 'custom-token-value';
    registerDestination({
      name: 'custom-dest',
      url: 'https://custom.example.com',
      ...createDestinationTokens(customToken)
    });

    const token = await createTokenProvider({
      destinationName: 'custom-dest'
    })();

    expect(token).toBe(customToken);
  });
});
