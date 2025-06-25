import { executeRequest } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { createLogger } from '@sap-cloud-sdk/util';
import yaml from 'yaml';
import { promptTemplatePostRequestSchema } from '@sap-ai-sdk/prompt-registry';
import { OrchestrationStream } from './orchestration-stream.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import { OrchestrationResponse } from './orchestration-response.js';
import {
  constructCompletionPostRequest,
  constructCompletionPostRequestFromJsonModuleConfig
} from './util/index.js';
import type {
  ChatMessages,
  TemplatingChatMessage
} from './client/api/schema/index.js';
import type {
  HttpResponse,
  CustomRequestConfig
} from '@sap-cloud-sdk/http-client';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api/internal.js';
import type {
  ClientConfig,
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
  private openStream = false;
  private history: ChatMessages = [];
  /**
   * Creates an instance of the orchestration client.
   * @param config - Orchestration module configuration. This can either be an `OrchestrationModuleConfig` object or a JSON string obtained from AI Launchpad.
   * @param clientConfig - Client configuration, which defines the clients behavior.
   * @param deploymentConfig - Deployment configuration.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private config: OrchestrationModuleConfig | string,
    private clientConfig: ClientConfig,
    private deploymentConfig?: ResourceGroupConfig,
    private destination?: HttpDestinationOrFetchOptions
  ) {
    if (typeof config === 'string') {
      this.validateJsonConfig(config);
    } else {
      this.config =
        typeof config.templating === 'string'
          ? this.parseAndMergeTemplating(config) // parse and assign if templating is a string
          : config;
    }
  }

  async chatCompletion(
    prompt?: Prompt,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    if (this.clientConfig.enableHistory) {
      if (!prompt) {
        throw new Error('Prompt is required when history is enabled.');
      }
      // what if an old conversation is instantiated?
      if (prompt.messagesHistory) {
        throw new Error(
          'Prompt should not contain messagesHistory when history is enabled.'
        );
      }
      prompt.messagesHistory = this.history;
    }
    const response = await this.executeRequest({
      prompt,
      requestConfig,
      stream: false
    });
    const orchestrationResponse = new OrchestrationResponse(response);
    this.history = orchestrationResponse.getAllMessages();
    return orchestrationResponse;
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

    if (this.openStream) {
      throw new Error(
        'Stream is already open. Please close the previous stream before opening a new one.'
      );
    }

    this.openStream = true;
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
      ._pipe(OrchestrationStream._processToolCalls, response)
      ._pipe(OrchestrationStream._processFinishReason, response)
      ._pipe(OrchestrationStream._processTokenUsage, response);

    return response;
  }

  /**
   * Validate if a string is valid JSON.
   * @param config - The JSON string to validate.
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
   * @param config - The orchestration module configuration with templating either as object or string.
   * @returns The updated and merged orchestration module configuration.
   * @throws Error if the YAML parsing fails or if the parsed object does not conform to the expected schema.
   */
  private parseAndMergeTemplating(
    config: OrchestrationModuleConfig
  ): OrchestrationModuleConfig {
    let parsedObject;
    if (typeof config.templating === 'string' && !config.templating.trim()) {
      throw new Error('Templating YAML string must be non-empty.');
    }
    try {
      parsedObject = yaml.parse(config.templating as string);
    } catch (error) {
      throw new Error(`Error parsing YAML: ${error}`);
    }

    const result = promptTemplatePostRequestSchema.safeParse(parsedObject);
    if (!result.success) {
      throw new Error(
        `Prompt Template YAML does not conform to the defined type. Validation errors: ${result.error}`
      );
    }
    const { template, defaults, response_format, tools } = result.data.spec;
    return {
      ...config,
      templating: {
        template: template as TemplatingChatMessage,
        ...(defaults && { defaults }),
        ...(response_format && { response_format }),
        ...(tools && { tools })
      }
    };
  }
}
