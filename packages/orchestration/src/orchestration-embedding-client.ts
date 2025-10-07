import { executeRequest } from '@sap-ai-sdk/core';
import { createLogger } from '@sap-cloud-sdk/util';
import { getOrchestrationDeploymentId } from './deployment-resolver.js';
import { OrchestrationEmbeddingResponse } from './orchestration-embedding-response.js';
import { constructEmbeddingPostRequest } from './util/index.js';
import type {
  HttpResponse,
  CustomRequestConfig
} from '@sap-cloud-sdk/http-client';
import type {
  DeploymentIdConfig,
  ResourceGroupConfig
} from '@sap-ai-sdk/ai-api/internal.js';
import type {
  EmbeddingModuleConfig,
  EmbeddingRequest
} from './orchestration-types.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-embedding-client'
});

/**
 * Orchestration embedding client for generating embeddings with optional orchestration modules.
 */
export class OrchestrationEmbeddingClient {
  /**
   * Creates an instance of the orchestration embedding client.
   * @param config - Embedding module configuration.
   * @param deploymentConfig - Deployment configuration.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private config: EmbeddingModuleConfig,
    private deploymentConfig?: ResourceGroupConfig | DeploymentIdConfig,
    private destination?: HttpDestinationOrFetchOptions
  ) {}

  /**
   * Generate embeddings for the given input.
   * @param request - Embedding request configuration.
   * @param requestConfig - Custom request configuration.
   * @returns Promise resolving to embedding response.
   */
  async embed(
    request: EmbeddingRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationEmbeddingResponse> {
    logger.debug('Generating embeddings', {
      inputType: typeof request.input,
      inputLength: Array.isArray(request.input) ? request.input.length : 1,
      type: request.type
    });

    const response = await this.executeRequest(request, requestConfig);
    return new OrchestrationEmbeddingResponse(response);
  }

  private async executeRequest(
    request: EmbeddingRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<HttpResponse> {
    const body = constructEmbeddingPostRequest(this.config, request);

    const deploymentId = await getOrchestrationDeploymentId(
      this.deploymentConfig ?? {},
      this.destination
    );

    if (!deploymentId) {
      throw new Error('Failed to resolve deployment ID');
    }

    logger.debug('Executing request', {
      deploymentId,
      endpoint: '/embeddings'
    });

    return executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/v2/embeddings`,
        ...(this.deploymentConfig ?? {})
      },
      body,
      requestConfig,
      this.destination
    );
  }
}
