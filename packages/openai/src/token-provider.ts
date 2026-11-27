import { getAiCoreAuthToken } from '@sap-ai-sdk/core/internal.js';

import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * Creates a token provider function compatible with `AzureOpenAI`'s `azureADTokenProvider` option.
 * On each invocation, resolves the AI Core destination and returns the bearer token.
 * @param destination - Optional HTTP destination or fetch options for the AI Core service.
 * If omitted, falls back to the `aicore` service binding or the `AICORE_SERVICE_KEY` environment variable (local testing only).
 * @returns A function that returns a promise resolving to the bearer token string.
 * @experimental This function is experimental and may change at any time without prior notice.
 */
export function createTokenProvider(
  destination?: HttpDestinationOrFetchOptions
): () => Promise<string> {
  return function sapAiCoreTokenProvider() {
    return getAiCoreAuthToken(destination);
  };
}
