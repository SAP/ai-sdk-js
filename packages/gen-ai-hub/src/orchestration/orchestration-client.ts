import { executeRequest, CustomRequestConfig } from '@sap-ai-sdk/core';
import { DeploymentResolver, resolveDeployment } from '../core.js';
import {
  CompletionPostRequest,
  CompletionPostResponse
} from './client/api/schema/index.js';
import { OrchestrationCompletionParameters } from './orchestration-types.js';

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param deploymentResolver - A deployment id or a function to retrieve it.
   * @param requestConfig - Request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: OrchestrationCompletionParameters,
    deploymentResolver: DeploymentResolver = () =>
      resolveDeployment({ scenarioId: 'orchestration' }),
    requestConfig?: CustomRequestConfig
  ): Promise<CompletionPostResponse> {
    const body = constructCompletionPostRequest(data);
    const deployment =
      typeof deploymentResolver === 'function'
        ? (await deploymentResolver()).id
        : deploymentResolver;

    const response = await executeRequest(
      {
        url: `/inference/deployments/${deployment}/completion`
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
  input: OrchestrationCompletionParameters
): CompletionPostRequest {
  return {
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: input.prompt.template
        },
        llm_module_config: input.llmConfig,
        ...(Object.keys(input?.filterConfig || {}).length && {
          filtering_module_config: input.filterConfig
        })
      }
    },
    ...(input.prompt.template_params && {
      input_params: input.prompt.template_params
    }),
    ...(input.prompt.messages_history && {
      messages_history: input.prompt.messages_history
    })
  };
}
