import { executeRequest, CustomRequestConfig } from '@sap-ai-sdk/core';
import { resolveDeploymentId } from '../utils/deployment-resolver.js';
import {
  CompletionPostRequest,
  CompletionPostResponse
} from './client/api/schema/index.js';
import { OrchestrationModuleConfig, Prompt } from './orchestration-types.js';

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  // TODO: document constructor
  constructor(
    private config: OrchestrationModuleConfig,
    private deploymentIdConfig?: { resourceGroup: string } // DeploymentIdConfiguration
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
  ): Promise<CompletionPostResponse> {
    const body = constructCompletionPostRequest(this.config, prompt);
    const deploymentId = await resolveDeploymentId({
      scenarioId: 'orchestration',
      resourceGroup: this.deploymentIdConfig?.resourceGroup
    });

    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/completion`
      },
      body,
      requestConfig
    );
    return response.data;
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
          template: config.templatingConfig.template
        },
        llm_module_config: config.llmConfig,
        ...(Object.keys(config?.filterConfig || {}).length && {
          filtering_module_config: config.filterConfig
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
