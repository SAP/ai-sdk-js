import { executeRequest } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { OrchestrationResponse } from './orchestration-response.js';
import { OrchestrationStream } from './orchestration-stream.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import type {
  HttpResponse,
  CustomRequestConfig
} from '@sap-cloud-sdk/http-client';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api/internal.js';
import type {
  CompletionPostRequest,
  ModuleConfigs,
  OrchestrationConfig
} from './client/api/schema/index.js';
import type {
  OrchestrationModuleConfig,
  Prompt
} from './orchestration-types.js';
import type { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

interface RequestOptions {
  prompt?: Prompt;
  requestConfig?: CustomRequestConfig;
  stream?: boolean;
  streamOptions?: StreamOptions;
  jsonModuleConfig?: string;
  deploymentConfig?: ResourceGroupConfig;
  destination?: HttpDestinationOrFetchOptions;
  config?: OrchestrationModuleConfig;
}

interface ConfigurationOptions {
  deploymentConfig?: ResourceGroupConfig;
  destination?: HttpDestinationOrFetchOptions;
  requestConfig?: CustomRequestConfig;
}

interface StreamOptions {
  chunkSize?: number;
  llm?: { includeUsage?: boolean; [key: string]: any };
  // Add more options as they are implemented
  // masking?: { };
  // grounding?: { };
  // inputFiltering?: { };
  outputFiltering?: { overlap?: number };
}

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  static async chatCompletionWithJsonModuleConfig(
    jsonModuleConfig: string,
    prompt?: Prompt,
    options?: ConfigurationOptions
  ): Promise<OrchestrationResponse> {
    const response = await OrchestrationClient.executeRequest({
      jsonModuleConfig,
      prompt,
      ...options
    });
    return new OrchestrationResponse(response);
  }

  static async streamWithJsonModuleConfig(
    jsonModuleConfig: string,
    prompt?: Prompt,
    controller = new AbortController(),
    options?: ConfigurationOptions
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    return OrchestrationClient.createStreamResponse(
      {
        jsonModuleConfig,
        prompt,
        ...options
      },
      controller
    );
  }

  private static async executeRequest(
    options: RequestOptions
  ): Promise<HttpResponse> {
    const {
      prompt,
      requestConfig,
      stream,
      streamOptions,
      jsonModuleConfig,
      deploymentConfig,
      destination,
      config
    } = options;

    const body = jsonModuleConfig
      ? constructCompletionPostRequestFromJsonModuleConfig(
          jsonModuleConfig,
          prompt
        )
      : constructCompletionPostRequest(config!, prompt, stream, streamOptions);

    const deploymentId = await resolveDeploymentId({
      scenarioId: 'orchestration',
      ...deploymentConfig
    });

    return executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/completion`,
        ...deploymentConfig
      },
      body,
      requestConfig,
      destination
    );
  }

  private static async createStreamResponse(
    options: RequestOptions,
    controller: AbortController
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    const response =
      new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>();

    const streamResponse = await OrchestrationClient.executeRequest({
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

  constructor(
    private config: OrchestrationModuleConfig,
    private deploymentConfig?: ResourceGroupConfig,
    private destination?: HttpDestinationOrFetchOptions
  ) {}

  async chatCompletion(
    prompt?: Prompt,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    const response = await OrchestrationClient.executeRequest({
      prompt,
      requestConfig,
      stream: false,
      config: this.config,
      deploymentConfig: this.deploymentConfig,
      destination: this.destination
    });
    return new OrchestrationResponse(response);
  }

  async stream(
    prompt?: Prompt,
    controller = new AbortController(),
    options?: StreamOptions,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    return OrchestrationClient.createStreamResponse(
      {
        prompt,
        requestConfig,
        streamOptions: options,
        stream: true,
        config: this.config,
        deploymentConfig: this.deploymentConfig,
        destination: this.destination
      },
      controller
    );
  }
}

/**
 * @internal
 */
export function constructCompletionPostRequestFromJsonModuleConfig(
  config: string,
  prompt?: Prompt
): Record<string, any> {
  try {
    return {
      messages_history: prompt?.messagesHistory || [],
      input_params: prompt?.inputParams || {},
      orchestration_config: JSON.parse(config)
    };
  } catch (error) {
    throw new Error(`Could not parse JSON: ${error}`);
  }
}

function addStreamOptions(
  moduleConfigs: ModuleConfigs,
  streamOptions?: StreamOptions
): OrchestrationConfig {
  const llm = streamOptions?.llm ?? {};
  const outputFiltering = streamOptions?.outputFiltering ?? {};
  const chunkSize = streamOptions?.chunkSize;

  return {
    stream: true,
    stream_options: {
      chunk_size: chunkSize
    },
    module_configurations: {
      ...moduleConfigs,
      llm_module_config: {
        ...moduleConfigs.llm_module_config,
        stream_options: {
          include_usage: llm.includeUsage ?? true,
          ...llm
        }
      },
      ...(Object.keys(outputFiltering).length && {
        filtering_module_config: {
          ...moduleConfigs.filtering_module_config,
          output: {
            ...(moduleConfigs.filtering_module_config?.output || {}),
            stream_options: outputFiltering
          }
        }
      })
    }
  } as OrchestrationConfig; // TODO: Remove typecast when types are re-generated;
}

/**
 * @internal
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig,
  prompt?: Prompt,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest {
  const moduleConfigurations = {
    templating_module_config: {
      template: config.templating.template
    },
    llm_module_config: config.llm,
    ...(config?.filtering &&
      Object.keys(config.filtering).length && {
        filtering_module_config: config.filtering
      }),
    ...(config?.masking &&
      Object.keys(config.masking).length && {
        masking_module_config: config.masking
      }),
    ...(config?.grounding &&
      Object.keys(config.grounding).length && {
        grounding_module_config: config.grounding
      })
  };

  return {
    orchestration_config: stream
      ? addStreamOptions(moduleConfigurations, streamOptions)
      : { module_configurations: moduleConfigurations, stream: false },
    ...(prompt?.inputParams && {
      input_params: prompt.inputParams
    }),
    ...(prompt?.messagesHistory && {
      messages_history: prompt.messagesHistory
    })
  };
}
