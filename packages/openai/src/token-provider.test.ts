import nock from 'nock';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { mockClientCredentialsGrantCall } from '../../../test-util/mock-http.js';
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
    const coreMod = await import('@sap-ai-sdk/core');
    const spy = jest.spyOn(coreMod, 'getAiCoreDestination');
    spy.mockResolvedValueOnce({ url: 'https://api.ai.ml.hana.ondemand.com' } as any);

    await expect(createTokenProvider()()).rejects.toThrow(
      'Could not retrieve authentication token from AI Core destination.'
    );
    spy.mockRestore();
  });

  it('passes the destination to getAiCoreDestination', async () => {
    const coreMod = await import('@sap-ai-sdk/core');
    const spy = jest.spyOn(coreMod, 'getAiCoreDestination');
    spy.mockResolvedValueOnce({
      url: 'https://custom.example.com',
      authTokens: [
        {
          value: 'custom-token',
          type: 'bearer',
          http_header: { key: 'authorization', value: 'Bearer custom-token' },
          error: null
        }
      ]
    } as any);

    const destination = { url: 'https://custom.example.com' };
    const token = await createTokenProvider(destination)();

    expect(token).toBe('custom-token');
    expect(spy).toHaveBeenCalledWith(destination);
    spy.mockRestore();
  });
});
