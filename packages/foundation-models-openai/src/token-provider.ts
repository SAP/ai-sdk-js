import { getAiCoreDestination } from '@sap-ai-sdk/core';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * Creates a token provider function compatible with `AzureOpenAI`'s `azureADTokenProvider` option.
 * On each invocation, resolves the AI Core destination and returns the bearer token.
 */
export function createTokenProvider(
  destination?: HttpDestinationOrFetchOptions
): () => Promise<string> {
  return async () => {
    const dest = await getAiCoreDestination(destination);
    const token = dest.authTokens?.[0]?.value;
    if (!token) {
      throw new Error(
        'Could not retrieve authentication token from AI Core destination. Ensure the service binding or AICORE_SERVICE_KEY is configured correctly.'
      );
    }
    return token;
  };
}
