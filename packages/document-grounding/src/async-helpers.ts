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

interface ResourceGroupHeaders {
  'AI-Resource-Group': string;
}

type CollectionStatus = CollectionCreatedResponse | CollectionPendingResponse;

// Manually mirrors the failure states of the generated PipelineExecutionStatus enum.
// A new generated failure state not listed here falls through to maxWaitTime (reported
// as a PollTimeoutError) until it is added.
const PIPELINE_FAILURE_STATES = new Set([
  'TIMEOUT',
  'CREATION_FAILED',
  'DELETION_FAILED'
]);

function collectionIdFromLocation(created: HttpResponse): string {
  const location = created.headers?.location;
  if (typeof location !== 'string') {
    throw new Error('createCollection did not return a Location header');
  }
  // We only rely on a `collections/{id}` segment; the full creation-status path is
  // `.../vector/collections/{id}/creationStatus` but may drift if the client changes.
  const match = /collections\/([^/?#]+)/.exec(location);
  if (!match) {
    throw new Error(`Unexpected createCollection Location header: ${location}`);
  }
  return match[1];
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
      // The generated creation-status schema models only pending (`monitorURL`) and
      // created (`collectionURL`) responses — there is no terminal failure state, so
      // `getFailure` cannot be defined. A server-side failure that never yields
      // `collectionURL` is bounded by `maxWaitTime` and surfaces as a PollTimeoutError.
      // Follow-up (#659, grounding service team): confirm the failure representation
      // and add `getFailure` once one exists.
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
      getFailure: status => {
        if (status.status === 'FINISHEDWITHERRORS') {
          return {
            outcome: 'partial',
            reason: 'pipeline finished with errors'
          };
        }
        if (status.status && PIPELINE_FAILURE_STATES.has(status.status)) {
          return { outcome: 'failure', reason: String(status.status) };
        }
        return undefined;
      }
    },
    options
  );
}
