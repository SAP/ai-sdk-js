import { executeRequest } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { createLogger } from '@sap-cloud-sdk/util';
import { OrchestrationStream } from './orchestration-stream.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import { OrchestrationResponse } from './orchestration-response.js';
import {
  constructCompletionPostRequest,
  constructCompletionPostRequestFromJsonModuleConfig
} from './util/index.js';
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
import { parse } from 'yaml';
import { promptTemplatePostRequestSchema } from '@sap-ai-sdk/prompt-registry';
import { TemplatingModuleConfig } from './client/api/schema/templating-module-config.js';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-client'
});

export type OrchestrationModuleConfigWithStringTemplating = Omit<OrchestrationModuleConfig, 'templating'> & {
  templating: TemplatingModuleConfig | string;
}
/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  private config: OrchestrationModuleConfig | string;
  /**
   * Creates an instance of the orchestration client.
   * @param config - Orchestration module configuration. This can either be an `OrchestrationModuleConfig` object or a JSON string obtained from AI Launchpad.
   * @param deploymentConfig - Deployment configuration.
   * @param destination - The destination to use for the request.
   */
  constructor(
    config: OrchestrationModuleConfigWithStringTemplating | string,
    private deploymentConfig?: ResourceGroupConfig,
    private destination?: HttpDestinationOrFetchOptions
  )  {
    if (typeof config === 'string') {
      this.validateJsonConfig(config);
      this.config = config; // Keep as string if it's a JSON string
    } else if (typeof config.templating === 'string') {
      this.config = this.parseAndMergeTemplating(config); // Process and assign if templating is a string
    } else {
      // Assert the type because TypeScript cannot guarantee that templating is not a string here
      this.config = config as OrchestrationModuleConfig;
    }
  }

/**
 * Validate if a string is valid JSON.
 */
  private validateJsonConfig(config: string): void {
    try {
      JSON.parse(config);
    } catch (error) {
      throw new Error(`Could not parse JSON: ${error}`);
    }
  }

 /**
   * Parse and merge templating into the config object.
   */
 private parseAndMergeTemplating(config: OrchestrationModuleConfigWithStringTemplating): OrchestrationModuleConfig {
  try {
    const parsedObject = parse(config.templating as string); // We are sure it's a string here
    const result = promptTemplatePostRequestSchema.safeParse(parsedObject);

    if (result.success) {
      return {
        ...config,
        templating: result.data.spec as TemplatingModuleConfig // Merge parsed templating into config
      };
    } else {
      throw new Error(`Prompt Template YAML does not conform to the defined type: ${result.error}`);
    }
  } catch (error) {
    throw new Error(`Error parsing YAML: ${error}`);
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

    return executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/completion`,
        ...(this.deploymentConfig ?? {})
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
