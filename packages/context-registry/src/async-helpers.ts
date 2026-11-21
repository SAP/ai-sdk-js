import { createAndWait, deleteAndWait } from '@sap-ai-sdk/core';

import { DataDestinationsApi } from './client/context-registry/index.ts';

import type {
  CreateAndWaitOptions,
  DeleteAndWaitOptions,
  PollResult
} from '@sap-ai-sdk/core';

import type {
  CreateDataDestination,
  GetDataDestination
} from './client/context-registry/index.ts';

interface ResourceGroupHeaders {
  'AI-Resource-Group': string;
}

/**
 * Creates (or updates) a data destination and polls until it is active.
 * @param dataDestinationName - Unique identifier for the data destination.
 * @param body - The data destination to create.
 * @param headers - Request headers, including the AI resource group.
 * @param options - Polling and request configuration.
 * @returns The terminal poll result with the data destination in its final state.
 */
export function createDataDestinationAndWait(
  dataDestinationName: string,
  body: CreateDataDestination,
  headers: ResourceGroupHeaders,
  options?: CreateAndWaitOptions
): Promise<PollResult<GetDataDestination>> {
  return createAndWait<GetDataDestination>(
    DataDestinationsApi.createUpdateDataDestination(
      dataDestinationName,
      body,
      headers
    ),
    {
      statusRead: () =>
        DataDestinationsApi.getDataDestinationByName(
          dataDestinationName,
          headers
        ),
      isComplete: status => status.status === 'ACTIVE',
      getFailure: status =>
        status.status === 'ERROR'
          ? { outcome: 'failure', reason: status.errorMessage || 'ERROR' }
          : undefined
    },
    options
  );
}

/**
 * Deletes a data destination and polls until it is gone (the status read returns a 404).
 * @param dataDestinationName - The data destination to delete.
 * @param headers - Request headers, including the AI resource group.
 * @param options - Polling and request configuration.
 * @returns The terminal poll result; the resource is `undefined` once deletion completed.
 */
export function deleteDataDestinationAndWait(
  dataDestinationName: string,
  headers: ResourceGroupHeaders,
  options?: DeleteAndWaitOptions
): Promise<PollResult<GetDataDestination | undefined>> {
  return deleteAndWait<GetDataDestination>(
    DataDestinationsApi.deleteDataDestinationByName(
      dataDestinationName,
      headers
    ),
    {
      statusRead: () =>
        DataDestinationsApi.getDataDestinationByName(
          dataDestinationName,
          headers
        ),
      // There is no terminal status for deletion; completion is observed as a 404.
      isComplete: () => false,
      getFailure: status =>
        status.status === 'ERROR'
          ? { outcome: 'failure', reason: status.errorMessage || 'ERROR' }
          : undefined
    },
    { notFoundMeansDeleted: true, ...options }
  );
}
