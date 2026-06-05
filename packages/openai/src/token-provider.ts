import { getAiCoreDestination } from '@sap-ai-sdk/core';
import { ErrorWithCause } from '@sap-cloud-sdk/util';
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
    const authTokenFirst = dest.authTokens?.[0];
    const token = authTokenFirst?.value;
    const error = authTokenFirst?.error;
    if (!token || error) {
      const msg =
        'Could not retrieve authentication token from AI Core destination. Ensure the destination, service binding, or AICORE_SERVICE_KEY (local testing only) is configured correctly.';

      throw error ? new ErrorWithCause(msg, new Error(error)) : new Error(msg);
    }
    return token;
  };
}
