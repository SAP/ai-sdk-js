import type { PollStatus } from '@sap-ai-sdk/core';

/**
 * The lifecycle fields the Context Registry create/update resources share
 * (data destinations, scenario configurations, tabular artifacts).
 */
export interface ContextRegistryLifecycle {
  status?: string;
  errorMessage?: string | null;
}

/**
 * A reusable `checkStatus` preset for Context Registry create/update polling: the resource is
 * done once its `status` is `ACTIVE`, failed on `ERROR` (surfacing `errorMessage`), and still
 * pending otherwise. The three resource types share this lifecycle, so pass this directly to
 * `waitUntilDone` instead of repeating the check per call.
 * @param resource - The polled status resource.
 * @returns The {@link PollStatus} for the resource.
 */
export function contextRegistryStatus(
  resource: ContextRegistryLifecycle
): PollStatus {
  if (resource.status === 'ACTIVE') {
    return 'done';
  }
  if (resource.status === 'ERROR') {
    return { failed: resource.errorMessage || 'resource creation failed' };
  }
  return 'pending';
}
