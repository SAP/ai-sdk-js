import { executeRequest } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { createLogger } from '@sap-cloud-sdk/util';
import yaml from 'yaml';
import { registryControllerPromptControllerCreateUpdatePromptTemplateBody } from '@sap-ai-sdk/prompt-registry/internal.js';
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
  ChatCompletionRequest,
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
  private useClientHistory = true;
  private messagesHistory?: ChatMessages;
  /**
   * Creates an instance of the orchestration client.
   * @param config - Orchestration module configuration. This can either be an `OrchestrationModuleConfig` object or a JSON string obtained from AI Launchpad.
   * @param clientConfig - Client configuration for the orchestration client.
   * @param deploymentConfig - Deployment configuration.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private config: OrchestrationModuleConfig | string,
    clientConfig?: ClientConfig,
    private deploymentConfig?: ResourceGroupConfig,
    private destination?: HttpDestinationOrFetchOptions
  ) {
    if (typeof config === 'string') {
      this.validateJsonConfig(config);
    } else {
      this.config =
        typeof config.promptTemplating.prompt === 'string'
          ? this.parseAndMergeTemplating(config) // parse and assign if templating is a string
          : config;
    }
    if (clientConfig?.useClientHistory === false) {
      this.useClientHistory = false;
    } else {
      this.messagesHistory = clientConfig?.messagesHistory;
    }
  }

  async chatCompletion(
    request?: ChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    if (this.useClientHistory) {
      if (request?.messagesHistory) {
        throw new Error(
          'Providing a message history when client history is enabled is not supported. Please remove the `messagesHistory` property from the prompt.'
        );
      }
      request = {
        ...request,
        messagesHistory: this.messagesHistory
      };
    }
    const response = await this.executeRequest({
      request,
      requestConfig,
      stream: false
    });
    const orchestrationResponse = new OrchestrationResponse(response);
    if (this.useClientHistory) {
      this.messagesHistory = orchestrationResponse.getAllMessages();
    }
    return orchestrationResponse;
  }

  async stream(
    request?: ChatCompletionRequest,
    controller = new AbortController(),
    options?: StreamOptions,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    try {
      if (typeof this.config === 'string' && options) {
        logger.warn(
          'Stream options are not supported when using a JSON module config.'
        );
      }

      if (this.useClientHistory) {
        if (request?.messagesHistory) {
          throw new Error(
            'Providing a message history when client history is enabled is not supported. Please remove the `messagesHistory` property from the prompt.'
          );
        }
        request = {
          ...request,
          messagesHistory: this.messagesHistory
        };
      }

      const streamResponse = await this.createStreamResponse(
        {
          request,
          requestConfig,
          stream: true,
          streamOptions: options
        },
        controller
      );
      return streamResponse;
    } catch (error) {
      controller.abort();
      throw error;
    }
  }

  getMessageHistory(): ChatMessages | undefined {
    if (!this.useClientHistory) {
      throw new Error(
        'Message history is not enabled for this client. Please enable it by passing `useClientHistory: true` in the client configuration.'
      );
    }
    return this.messagesHistory;
  }

  private async *processStreamEnd(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    if (!response) {
      throw new Error('Response is required to process stream end.');
    }
    for await (const chunk of stream) {
      yield chunk;
    }

    response._openStream = false;

    if (this.useClientHistory) {
      this.messagesHistory = response.getAllMessages();
    }
  }

  private async executeRequest(options: RequestOptions): Promise<HttpResponse> {
    const { request, requestConfig, stream, streamOptions } = options;

    const body =
      typeof this.config === 'string'
        ? constructCompletionPostRequestFromJsonModuleConfig(
            JSON.parse(this.config),
            request,
            stream
          )
        : constructCompletionPostRequest(
            this.config,
            request,
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
        url: `/inference/deployments/${deploymentId}/v2/completion`,
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
      ._pipe(
        OrchestrationStream._processOrchestrationStreamChunkResponse,
        response
      )
      ._pipe(this.processStreamEnd.bind(this), response);

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
    if (
      typeof config.promptTemplating.prompt === 'string' &&
      !config.promptTemplating.prompt.trim()
    ) {
      throw new Error('Templating YAML string must be non-empty.');
    }
    try {
      parsedObject = yaml.parse(config.promptTemplating.prompt as string);
    } catch (error) {
      throw new Error(`Error parsing YAML: ${error}`);
    }

    const result =
      registryControllerPromptControllerCreateUpdatePromptTemplateBody.safeParse(
        parsedObject
      );
    if (!result.success) {
      throw new Error(
        `Prompt Template YAML does not conform to the defined type. Validation errors: ${result.error}`
      );
    }
    const { template, defaults, response_format, tools } = result.data.spec;
    return {
      ...config,
      promptTemplating: {
        ...config.promptTemplating,
        prompt: {
          template: template as TemplatingChatMessage,
          ...(defaults && { defaults }),
          ...(response_format && { response_format }),
          ...(tools && { tools })
        }
      }
    };
  }
}
