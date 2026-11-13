import { createAndWait } from '@sap-ai-sdk/core';
import { PipelinesApi, VectorApi } from './client/api/index.ts';

import type { CreateAndWaitOptions, PollResult } from '@sap-ai-sdk/core';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type {
  CollectionCreatedResponse,
  CollectionPendingResponse,
  CollectionRequest,
  GetPipelineStatus,
  ManualPipelineTrigger
} from './client/api/index.ts';

type ResourceGroupHeaders = { 'AI-Resource-Group': string };

type CollectionStatus = CollectionCreatedResponse | CollectionPendingResponse;

function collectionIdFromLocation(created: HttpResponse): string {
  const location = created.headers?.location as string | undefined;
  if (!location) {
    throw new Error('createCollection did not return a Location header');
  }
  // Location points at /vector/collections/{id}/creationStatus
  const segments = location.split('/').filter(Boolean);
  return segments[segments.length - 2];
}

/**
 * Creates a vector collection and polls its creation status until the collection is ready.
 * The collection id is taken from the `Location` header of the `202` response.
 * @param body - The collection to create.
 * @param headers - Request headers, including the AI resource group.
 * @param options - Polling and request configuration.
 * @returns The terminal poll result with the created collection status.
 */
export function createCollectionAndWait(
  body: CollectionRequest,
  headers: ResourceGroupHeaders,
  options?: CreateAndWaitOptions
): Promise<PollResult<CollectionStatus>> {
  return createAndWait<CollectionStatus>(
    VectorApi.createCollection(body, headers),
    {
      statusRead: created =>
        VectorApi.getCollectionCreationStatus(
          collectionIdFromLocation(created),
          headers
        ),
      isComplete: status => 'collectionURL' in status
    },
    options
  );
}

/**
 * Triggers a grounding pipeline and polls its execution status until it finishes.
 * A `FINISHEDWITHERRORS` status is reported as a partial outcome; `TIMEOUT` and the
 * `*_FAILED` states are reported as failures.
 * @param body - The pipeline trigger payload (must include `pipelineId`).
 * @param headers - Request headers, including the AI resource group.
 * @param options - Polling and request configuration.
 * @returns The terminal poll result with the pipeline status.
 */
export function runPipelineAndWait(
  body: ManualPipelineTrigger,
  headers: ResourceGroupHeaders,
  options?: CreateAndWaitOptions
): Promise<PollResult<GetPipelineStatus>> {
  const pipelineId = body.pipelineId;
  if (!pipelineId) {
    throw new Error('runPipelineAndWait requires body.pipelineId');
  }
  return createAndWait<GetPipelineStatus>(
    PipelinesApi.manualTriggerPipeline(body, headers),
    {
      statusRead: () => PipelinesApi.getPipelineStatus(pipelineId, headers),
      isComplete: status =>
        status.status === 'FINISHED' || status.status === 'FINISHEDWITHERRORS',
      getFailure: status =>
        status.status === 'FINISHEDWITHERRORS'
          ? { outcome: 'partial', reason: 'pipeline finished with errors' }
          : status.status === 'TIMEOUT' ||
              status.status === 'CREATION_FAILED' ||
              status.status === 'DELETION_FAILED'
            ? { outcome: 'failure', reason: String(status.status) }
            : undefined
    },
    options
  );
}
