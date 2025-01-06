import { executeRequest } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { createLogger } from '@sap-cloud-sdk/util';
import { OrchestrationStream } from './orchestration-stream.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import { OrchestrationResponse } from './orchestration-response.js';
import {
  constructCompletionPostRequest,
  constructCompletionPostRequestFromJsonModuleConfig
} from './orchestration-utils.js';
import type {
  HttpResponse,
  CustomRequestConfig
} from '@sap-cloud-sdk/http-client';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api/internal.js';
import type {
  OrchestrationModuleConfig,
  Prompt,
  RequestOptions,
  StreamOptions
} from './orchestration-types.js';
import type { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

const logger = createLogger({ messageContext: 'orchestration-client' });

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  private readonly moduleConfig: Partial<OrchestrationModuleConfig>;

  constructor(
    private config: OrchestrationModuleConfig | string,
    private deploymentConfig?: ResourceGroupConfig,
    private destination?: HttpDestinationOrFetchOptions
  ) {
    if (typeof config === 'string') {
      try {
        this.moduleConfig = JSON.parse(config);
      } catch (error) {
        throw new Error(`Could not parse JSON: ${error}`);
      }
    }
    else {
      this.moduleConfig = config;
    }
  }

  async chatCompletion(
    prompt?: Prompt,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    const response = await this.executeRequest({
      prompt,
      requestConfig
    });
    return new OrchestrationResponse(response);
  }

  async stream(
    prompt?: Prompt,
    controller = new AbortController(),
    options?: StreamOptions,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    return this.createStreamResponse(
      {
        prompt,
        requestConfig,
        streamOptions: options
      },
      controller
    );
  }

  private async executeRequest(options: RequestOptions): Promise<HttpResponse> {
    const { prompt, requestConfig, streamOptions } = options;

    const body = constructCompletionPostRequest(
            this.moduleConfig,
            prompt,
            streamOptions
          );

    const deploymentId = await resolveDeploymentId({
      scenarioId: 'orchestration',
      ...(this.deploymentConfig || {})
    });

    return executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/completion`,
        ...(this.deploymentConfig || {})
      },
      body,
      requestConfig,
      this.destination
    );
  }

  private async createStreamResponse(
    options: RequestOptions,
    controller: AbortController
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    const response =
      new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();

    const streamResponse = await this.executeRequest({
      ...options,
      requestConfig: {
        ...options.requestConfig,
        responseType: 'stream',
        signal: controller.signal
      }
    });

    const stream = OrchestrationStream._create(streamResponse, controller);
    response.stream = stream
      ._pipe(OrchestrationStream._processChunk)
      ._pipe(OrchestrationStream._processFinishReason, response)
      ._pipe(OrchestrationStream._processTokenUsage, response);

    return response;
  }
}
