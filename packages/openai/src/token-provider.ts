import { getAiCoreDestination } from '@sap-ai-sdk/core';
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
  return async function sapAiCoreTokenProvider() {
    const dest = await getAiCoreDestination(destination);
    const token = dest.authTokens?.[0]?.value;
    if (!token) {
      throw new Error(
        'Could not retrieve authentication token from AI Core destination. Ensure the destination, service binding, or AICORE_SERVICE_KEY (local testing only) is configured correctly.'
      );
    }
    return token;
  };
}
