import { executeRequest } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { createLogger, ErrorWithCause } from '@sap-cloud-sdk/util';
import { OrchestrationStream } from './orchestration-stream.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import { OrchestrationResponse } from './orchestration-response.js';
import {
  constructCompletionPostRequest,
  constructCompletionPostRequestFromJsonModuleConfig
} from './util/index.js';
import type { ErrorResponse } from './client/api/schema/index.js';
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

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-client'
});

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  /**
   * Creates an instance of the orchestration client.
   * @param config - Orchestration module configuration. This can either be an `OrchestrationModuleConfig` object or a JSON string obtained from AI Launchpad.
   * @param deploymentConfig - Deployment configuration.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private config: OrchestrationModuleConfig | string,
    private deploymentConfig?: ResourceGroupConfig,
    private destination?: HttpDestinationOrFetchOptions
  ) {
    try {
      if (typeof config === 'string') {
        JSON.parse(config);
      }
    } catch (error) {
      throw new Error(`Could not parse JSON: ${error}`);
    }
  }

  async chatCompletion(
    prompt?: Prompt,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    const response = await this.executeRequest({
      prompt,
      requestConfig,
      stream: false
    });
    return new OrchestrationResponse(response);
  }

  async stream(
    prompt?: Prompt,
    controller = new AbortController(),
    options?: StreamOptions,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    if (typeof this.config === 'string' && options) {
      logger.warn(
        'Stream options are not supported when using a JSON module config.'
      );
    }

    return this.createStreamResponse(
      {
        prompt,
        requestConfig,
        stream: true,
        streamOptions: options
      },
      controller
    );
  }

  private async executeRequest(options: RequestOptions): Promise<HttpResponse> {
    const { prompt, requestConfig, stream, streamOptions } = options;

    const body =
      typeof this.config === 'string'
        ? constructCompletionPostRequestFromJsonModuleConfig(
            JSON.parse(this.config),
            prompt,
            stream
          )
        : constructCompletionPostRequest(
            this.config,
            prompt,
            stream,
            streamOptions
          );

    const deploymentId = await resolveDeploymentId({
      scenarioId: 'orchestration',
      ...(this.deploymentConfig ?? {}),
      destination: this.destination
    });

    try {
      const response = await executeRequest(
        {
          url: `/inference/deployments/${deploymentId}/completion`,
          ...(this.deploymentConfig ?? {})
        },
        body,
        requestConfig,
        this.destination
      );
      return response;
    } catch(error: any) {
      const errorMessage: ErrorResponse = error.response?.data?.message;
      throw new ErrorWithCause(`Request failed with status code ${error.status}. ${errorMessage}`, error);
    }
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
