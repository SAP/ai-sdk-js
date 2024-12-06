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

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  /**
   * Creates an instance of the orchestration client.
   * @param config - Orchestration module configuration.
   * @param deploymentConfig - Deployment configuration.
   */
  constructor(
    private config: OrchestrationModuleConfig,
    private deploymentConfig?: ResourceGroupConfig
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
    const body = constructCompletionPostRequest(this.config, prompt);
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
      requestConfig
    );

    return new OrchestrationResponse(response);
  }

  /**
   * Executes the orchestration service using a JSON configuration.
   * @param jsonConfig - The JSON configuration as an input string.
   * @param prompt - Prompt configuration.
   * @param requestConfig - Optional request configuration.
   * @param deploymentConfig - Deployment configuration.
   * @returns The orchestration response.
   */
  /* eslint-disable @typescript-eslint/member-ordering */
  static async executeFromJson(
    jsonConfig: string,
    prompt?: Prompt,
    requestConfig?: CustomRequestConfig,
    deploymentConfig?: ResourceGroupConfig
  ): Promise<OrchestrationResponse> {
    let moduleConfig: Record<string, any>;
    try {
      moduleConfig = JSON.parse(jsonConfig);
    } catch {
      throw new Error(
        `The provided configuration is not valid JSON: ${jsonConfig}`
      );
    }

    const body: Record<string, any> = {
      messages_history: prompt?.messagesHistory || [],
      input_params: prompt?.inputParams || {},
      orchestration_config: moduleConfig
    };

    const deploymentId = await resolveDeploymentId({
      scenarioId: 'orchestration',
      resourceGroup: deploymentConfig?.resourceGroup
    });

    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/completion`,
        resourceGroup: deploymentConfig?.resourceGroup
      },
      body,
      requestConfig
    );

    return new OrchestrationResponse(response);
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
