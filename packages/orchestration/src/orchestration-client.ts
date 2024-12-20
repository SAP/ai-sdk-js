import { executeRequest } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { OrchestrationResponse } from './orchestration-response.js';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api/internal.js';
import type { CompletionPostRequest } from './client/api/schema/index.js';
import type {
  OrchestrationModuleConfig,
  Prompt
} from './orchestration-types.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

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
  ) {}

  /**
   * Creates a completion for the chat messages.
   * @param prompt - Prompt configuration.
   * @param requestConfig - Request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    prompt?: Prompt,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    const body =
      typeof this.config === 'string'
        ? constructCompletionPostRequestFromJson(this.config, prompt)
        : constructCompletionPostRequest(this.config, prompt);

    const deploymentId = await resolveDeploymentId({
      scenarioId: 'orchestration',
      resourceGroup: this.deploymentConfig?.resourceGroup
    });

    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/completion`,
        resourceGroup: this.deploymentConfig?.resourceGroup
      },
      body,
      requestConfig,
      this.destination
    );

    return new OrchestrationResponse(response);
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

/**
 * @internal
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig,
  prompt?: Prompt
): CompletionPostRequest {
  return {
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: config.templating.template
        },
        llm_module_config: config.llm,
        ...(Object.keys(config?.filtering || {}).length && {
          filtering_module_config: config.filtering
        }),
        ...(Object.keys(config?.masking || {}).length && {
          masking_module_config: config.masking
        }),
        ...(Object.keys(config?.grounding || {}).length && {
          grounding_module_config: config.grounding
        })
      }
    },
    ...(prompt?.inputParams && {
      input_params: prompt.inputParams
    }),
    ...(prompt?.messagesHistory && {
      messages_history: prompt.messagesHistory
    })
  };
}
