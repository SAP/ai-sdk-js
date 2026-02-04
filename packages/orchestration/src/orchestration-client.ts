import { executeRequest } from '@sap-ai-sdk/core';
import { createLogger } from '@sap-cloud-sdk/util';
import yaml from 'yaml';
import { RegistryControllerPromptControllerCreateUpdatePromptTemplateBody } from '@sap-ai-sdk/prompt-registry/internal.js';
import { getOrchestrationDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { OrchestrationStream } from './orchestration-stream.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import { OrchestrationResponse } from './orchestration-response.js';
import {
  constructCompletionPostRequest,
  constructCompletionPostRequestFromJsonModuleConfig,
  constructCompletionPostRequestFromConfigReference
} from './util/index.js';
import {
  isConfigReference,
  isOrchestrationModuleConfigList,
  assertIsOrchestrationModuleConfigList
} from './orchestration-types.js';
import type { TemplatingChatMessage } from './client/api/schema/index.js';
import type {
  HttpResponse,
  CustomRequestConfig
} from '@sap-cloud-sdk/http-client';
import type {
  DeploymentIdConfig,
  ResourceGroupConfig
} from '@sap-ai-sdk/ai-api/internal.js';
import type {
  OrchestrationModuleConfig,
  OrchestrationModuleConfigList,
  OrchestrationConfigRef,
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
  /**
   * Creates an instance of the orchestration client.
   * @param config - Orchestration configuration. Can be:
   * - An `OrchestrationModuleConfig` object for inline configuration
   * - An `OrchestrationModuleConfigList` array for module fallback (tries each config in order until one succeeds)
   * - A JSON string obtained from AI Launchpad
   * - An object of type`OrchestrationConfigRef` to reference a stored configuration by ID or name.
   * @param deploymentConfig - Deployment configuration.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private config:
      | OrchestrationModuleConfig
      | OrchestrationModuleConfigList
      | string
      | OrchestrationConfigRef,
    private deploymentConfig?: ResourceGroupConfig | DeploymentIdConfig,
    private destination?: HttpDestinationOrFetchOptions
  ) {
    if (typeof config === 'string') {
      this.validateJsonConfig(config);
    } else if (Array.isArray(config)) {
      this.config = this.parseModuleConfigList(config);
    } else if (!isConfigReference(config)) {
      this.config = this.parseTemplatingModule(config);
    }
  }

  async chatCompletion(
    request?: ChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    if (isConfigReference(this.config) && request?.messages?.length) {
      logger.warn(
        'The messages field in request is not supported when using an orchestration config reference. Messages should be part of the referenced configuration or provided via messagesHistory. The messages field will be ignored.'
      );
    }
    const response = await this.executeRequest({
      request,
      requestConfig,
      stream: false
    });
    return new OrchestrationResponse(response);
  }

  async stream(
    request?: ChatCompletionRequest,
    signal?: AbortSignal,
    options?: StreamOptions,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    if (isOrchestrationModuleConfigList(this.config)) {
      throw new Error(
        'Streaming is not supported when using multiple orchestration module configurations for fallback. Please use a single configuration.'
      );
    }

    const controller = new AbortController();
    if (signal) {
      signal.addEventListener('abort', () => {
        controller.abort();
      });
    }

    try {
      if (typeof this.config === 'string' && options) {
        logger.warn(
          'Stream options are not supported when using a JSON module config.'
        );
      }
      if (isConfigReference(this.config)) {
        if (options) {
          logger.warn(
            'Stream options are not supported when using an orchestration config reference. Streaming is only supported if the referenced config has streaming configured.'
          );
        }
        if (request?.messages?.length) {
          logger.warn(
            'The messages field in request is not supported when using an orchestration config reference. Messages should be part of the referenced configuration or provided via messagesHistory. The messages field will be ignored.'
          );
        }
      }

      return await this.createStreamResponse(
        {
          request,
          requestConfig,
          stream: true,
          streamOptions: options
        },
        controller
      );
    } catch (error) {
      controller.abort();
      throw error;
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
        : isConfigReference(this.config)
          ? constructCompletionPostRequestFromConfigReference(
              this.config,
              request
            )
          : constructCompletionPostRequest(
              this.config,
              request,
              stream,
              streamOptions
            );

    const deploymentId = await getOrchestrationDeploymentId(
      this.deploymentConfig || {},
      this.destination
    );

    if (!deploymentId) {
      throw new Error('Failed to resolve deployment ID');
    }

    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/v2/completion`,
        ...(this.deploymentConfig ?? {})
      },
      body,
      requestConfig,
      this.destination
    );

    // Log summary when fallbacks were used
    if (!stream && response.data?.intermediate_failures) {
      const failureCount = response.data.intermediate_failures.length;
      const successModel = response.data.final_result?.model;
      logger.info(
        `Orchestration used ${failureCount} fallback(s) before success${successModel ? `. Succeeded with model: ${successModel}` : ''}.`
      );
    }

    return response;
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
      ._pipe(OrchestrationStream._processStreamEnd, response);

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
      RegistryControllerPromptControllerCreateUpdatePromptTemplateBody.safeParse(
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

  /**
   * Parse a single orchestration module config, handling YAML prompt templates.
   * @param config - The orchestration module configuration.
   * @returns The parsed configuration.
   */
  private parseTemplatingModule(
    config: OrchestrationModuleConfig
  ): OrchestrationModuleConfig {
    return typeof config.promptTemplating.prompt === 'string'
      ? this.parseAndMergeTemplating(config)
      : config;
  }

  /**
   * Parse and validate a list of orchestration module configs for fallback.
   * @param config - The array of configurations.
   * @returns The validated and parsed configuration list.
   * @throws {Error} If the array is empty or contains invalid elements.
   */
  private parseModuleConfigList(
    config:
      | OrchestrationModuleConfig
      | OrchestrationModuleConfigList
      | string
      | OrchestrationConfigRef
  ): OrchestrationModuleConfigList {
    // Validate and assert it's a proper config list (throws if invalid)
    assertIsOrchestrationModuleConfigList(config);

    // Parse each config in the list
    const parsedConfigs = (config as OrchestrationModuleConfig[]).map(c =>
      this.parseTemplatingModule(c)
    ) as OrchestrationModuleConfigList;

    // Warn about duplicate models in fallback chain
    const models = parsedConfigs.map(c => c.promptTemplating.model.name);
    const uniqueModels = new Set(models);
    if (uniqueModels.size < models.length) {
      logger.warn(
        `Fallback configurations contain duplicate models: [${models.join(', ')}]. ` +
          'Consider using different models for meaningful fallback behavior.'
      );
    }

    return parsedConfigs;
  }
}
