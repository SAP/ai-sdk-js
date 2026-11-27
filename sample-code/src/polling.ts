import {
  contextRegistryStatus,
  DataDestinationsApi
} from '@sap-ai-sdk/context-registry';
import { waitUntilDone } from '@sap-ai-sdk/core';
import { PipelinesApi, VectorApi } from '@sap-ai-sdk/document-grounding';

import type {
  CreateDataDestination,
  GetDataDestination
} from '@sap-ai-sdk/context-registry';
import type { PollStatus } from '@sap-ai-sdk/core';
import type {
  CollectionCreatedResponse,
  CollectionPendingResponse,
  CollectionRequest,
  GetPipelineExecutionById,
  ManualPipelineTrigger
} from '@sap-ai-sdk/document-grounding';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

// Replace with your own resource group; 'ai-sdk-js-e2e' is this repo's test group.
const headers = { 'AI-Resource-Group': 'ai-sdk-js-e2e' } as const;

/**
 * Extracts the id following `segment` from the `Location` header of a `202` response,
 * e.g. the execution id in `.../pipelines/{p}/executions/{id}` or the collection id in
 * `.../collections/{id}/creationStatus`.
 * @param created - The `202 Accepted` response.
 * @param segment - The path segment the id follows (a trusted literal, not user input).
 * @returns The extracted id.
 */
function idFromLocation(created: HttpResponse, segment: string): string {
  const location = created.headers?.location;
  if (typeof location !== 'string') {
    throw new Error(`Expected a Location header for the ${segment} id`);
  }
  const match = new RegExp(`${segment}/([^/?#]+)`).exec(location);
  if (!match) {
    throw new Error(`Unexpected Location header: ${location}`);
  }
  return match[1];
}

type CollectionStatus = CollectionCreatedResponse | CollectionPendingResponse;

/**
 * Create a vector collection and wait until it is ready.
 *
 * The collection id is server-assigned, so the status request is derived from the trigger's
 * `202` `Location` header via the factory form of `statusRequest`.
 * @param body - The collection to create.
 * @returns The created collection status.
 */
export async function createCollectionAndWait(
  body: CollectionRequest
): Promise<CollectionStatus> {
  return waitUntilDone<CollectionStatus>(
    VectorApi.createCollection(body, headers),
    {
      statusRequest: created =>
        VectorApi.getCollectionCreationStatus(
          idFromLocation(created, 'collections'),
          headers
        ),
      checkStatus: status => ('collectionURL' in status ? 'done' : 'pending')
    }
  );
}

const PIPELINE_FAILURES = new Set([
  'TIMEOUT',
  'CREATION_FAILED',
  'DELETION_FAILED'
]);

/**
 * Trigger a grounding pipeline and wait until the triggered execution finishes.
 *
 * The execution id is taken from the trigger's `202` `Location` header (factory form), so
 * polling follows the run that was just triggered rather than pipeline-wide status.
 * `FINISHEDWITHERRORS` completes (the caller inspects the returned status for partial success).
 * @param body - The pipeline trigger payload.
 * @returns The terminal pipeline execution status.
 */
export async function runPipelineAndWait(
  body: ManualPipelineTrigger
): Promise<GetPipelineExecutionById> {
  const pipelineId = body.pipelineId;
  if (!pipelineId) {
    throw new Error('runPipelineAndWait requires body.pipelineId');
  }
  return waitUntilDone<GetPipelineExecutionById>(
    PipelinesApi.manualTriggerPipeline(body, headers),
    {
      statusRequest: created =>
        PipelinesApi.getExecutionDetailsByIdForPipelineExecution(
          pipelineId,
          idFromLocation(created, 'executions'),
          headers
        ),
      checkStatus: (status): PollStatus => {
        if (
          status.status === 'FINISHED' ||
          status.status === 'FINISHEDWITHERRORS'
        ) {
          return 'done';
        }
        if (status.status && PIPELINE_FAILURES.has(status.status)) {
          return { failed: String(status.status) };
        }
        return 'pending';
      }
    }
  );
}

/**
 * Create (or update) a data destination and wait until it is active.
 *
 * The caller already knows the destination name, so the status request is passed directly, and
 * the shared `contextRegistryStatus` preset handles the ACTIVE/ERROR lifecycle.
 * @param name - The data destination name.
 * @param body - The data destination to create.
 * @returns The data destination in its final state.
 */
export async function createDataDestinationAndWait(
  name: string,
  body: CreateDataDestination
): Promise<GetDataDestination> {
  return waitUntilDone<GetDataDestination>(
    DataDestinationsApi.createUpdateDataDestination(name, body, headers),
    {
      statusRequest: DataDestinationsApi.getDataDestinationByName(
        name,
        headers
      ),
      checkStatus: contextRegistryStatus
    }
  );
}

/**
 * Delete a data destination and wait until it is gone (the status read returns a `404`).
 * @param name - The data destination name.
 */
export async function deleteDataDestinationAndWait(
  name: string
): Promise<void> {
  await waitUntilDone<GetDataDestination>(
    DataDestinationsApi.deleteDataDestinationByName(name, headers),
    {
      statusRequest: DataDestinationsApi.getDataDestinationByName(
        name,
        headers
      ),
      // No terminal success state for delete; completion is the 404 below.
      checkStatus: () => 'pending',
      notFound: 'resolve'
    }
  );
}
