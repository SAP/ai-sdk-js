import { executeRequest } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { OrchestrationResponse } from './orchestration-response.js';
import { OrchestrationChatCompletionStream } from './orchestration-chat-completion-stream.js';
import { OrchestrationChatCompletionStreamResponse } from './orchestration-chat-completion-stream-response.js';
import type {
  HttpResponse,
  CustomRequestConfig
} from '@sap-cloud-sdk/http-client';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api/internal.js';
import type { CompletionPostRequest } from './client/api/schema/index.js';
import type {
  LlmModuleConfig,
  OrchestrationModuleConfig,
  Prompt
} from './orchestration-types.js';
import type { OrchestrationChatCompletionStreamChunkResponse } from './orchestration-chat-completion-stream-chunk-response.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

interface RequestOptions {
  prompt?: Prompt;
  requestConfig?: CustomRequestConfig;
  streaming?: boolean;
  jsonConfig?: string;
  deploymentConfig?: ResourceGroupConfig;
  destination?: HttpDestinationOrFetchOptions;
  config?: OrchestrationModuleConfig;
}

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  static async chatCompletionWithJson(
    jsonConfig: string,
    prompt?: Prompt,
    deploymentConfig?: ResourceGroupConfig,
    destination?: HttpDestinationOrFetchOptions,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    const response = await OrchestrationClient.executeRequest({
      prompt,
      requestConfig,
      jsonConfig,
      deploymentConfig,
      destination
    });
    return new OrchestrationResponse(response);
  }

  static async streamWithJson(
    jsonConfig: string,
    prompt?: Prompt,
    controller = new AbortController(),
    deploymentConfig?: ResourceGroupConfig,
    destination?: HttpDestinationOrFetchOptions,
    requestConfig?: CustomRequestConfig
  ): Promise<
    OrchestrationChatCompletionStreamResponse<OrchestrationChatCompletionStreamChunkResponse>
  > {
    return OrchestrationClient.createStreamResponse(
      {
        prompt,
        requestConfig,
        streaming: true,
        jsonConfig,
        deploymentConfig,
        destination
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
      streaming = false,
      jsonConfig,
      deploymentConfig: { resourceGroup } = {},
      destination
    } = options;

    const body = jsonConfig
      ? constructCompletionPostRequestFromJson(jsonConfig, prompt)
      : constructCompletionPostRequest(options.config!, prompt, streaming);

    const deploymentId = await resolveDeploymentId({
      scenarioId: 'orchestration',
      resourceGroup
    });

    return executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/completion`,
        resourceGroup
      },
      body,
      requestConfig,
      destination
    );
  }

  private static async createStreamResponse(
    options: RequestOptions,
    controller: AbortController
  ): Promise<
    OrchestrationChatCompletionStreamResponse<OrchestrationChatCompletionStreamChunkResponse>
  > {
    const response =
      new OrchestrationChatCompletionStreamResponse<OrchestrationChatCompletionStreamChunkResponse>();

    const streamResponse = await OrchestrationClient.executeRequest({
      ...options,
      requestConfig: {
        ...options.requestConfig,
        responseType: 'stream',
        signal: controller.signal
      }
    });

    const stream = await OrchestrationChatCompletionStream._create(
      streamResponse,
      controller
    );
    response.stream = stream
      ._pipe(OrchestrationChatCompletionStream._processChunk)
      ._pipe(OrchestrationChatCompletionStream._processFinishReason, response)
      ._pipe(OrchestrationChatCompletionStream._processTokenUsage, response);

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
      config: this.config,
      deploymentConfig: this.deploymentConfig,
      destination: this.destination
    });
    return new OrchestrationResponse(response);
  }

  async stream(
    prompt?: Prompt,
    controller = new AbortController(),
    requestConfig?: CustomRequestConfig
  ): Promise<
    OrchestrationChatCompletionStreamResponse<OrchestrationChatCompletionStreamChunkResponse>
  > {
    return OrchestrationClient.createStreamResponse(
      {
        prompt,
        requestConfig,
        streaming: true,
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
export function constructCompletionPostRequestFromJson(
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

function configureLLM(llm: LlmModuleConfig, stream: boolean): LlmModuleConfig {
  if (stream) {
    llm.model_params = {
      ...llm.model_params,
      stream_options: { include_usage: true }
    };
  }
  return llm;
}

/**
 * @internal
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig,
  prompt?: Prompt,
  stream = false
): CompletionPostRequest {
  const moduleConfigurations = {
    templating_module_config: {
      template: config.templating.template
    },
    llm_module_config: configureLLM(config.llm, stream),
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
    orchestration_config: {
      stream,
      module_configurations: moduleConfigurations
    },
    ...(prompt?.inputParams && {
      input_params: prompt.inputParams
    }),
    ...(prompt?.messagesHistory && {
      messages_history: prompt.messagesHistory
    })
  };
}
