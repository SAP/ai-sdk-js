import { ErrorWithCause } from '@sap-cloud-sdk/util';

import { getAiCoreDestination } from './context.ts';

import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

const defaultAuthErrorMessage =
  'Could not retrieve authentication token from AI Core destination. Ensure the destination, service binding, or AICORE_SERVICE_KEY (local testing only) is configured correctly.';

/**
 * Resolve the current bearer token from the AI Core destination.
 * @param destination - Optional HTTP destination or fetch options for the AI Core service.
 * @param errorMessage - The message to use when the destination has no valid authentication token.
 * @returns The bearer token.
 * @internal
 */
export async function getAiCoreAuthToken(
  destination?: HttpDestinationOrFetchOptions,
  errorMessage = defaultAuthErrorMessage
): Promise<string> {
  const aiCoreDestination = await getAiCoreDestination(destination);
  const authToken = aiCoreDestination.authTokens?.[0];
  if (!authToken?.value || authToken.error) {
    throw authToken?.error
      ? new ErrorWithCause(errorMessage, new Error(authToken.error))
      : new Error(errorMessage);
  }
  return authToken.value;
}

/**
 * Format the AI Core `ai-client-type` header value.
 * @param clientType - Optional additional client identifier.
 * @returns The default SDK client type, followed by the optional client identifier.
 * @internal
 */
export function formatAiClientTypeHeader(clientType?: string): string {
  return ['AI SDK JavaScript', clientType].filter(Boolean).join(',');
}
