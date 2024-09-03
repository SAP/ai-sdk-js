import { executeRequest, CustomRequestConfig } from '@sap-ai-sdk/core';
import { pickValueIgnoreCase } from '@sap-cloud-sdk/util';
import { resolveDeploymentId } from '../utils/deployment-resolver.js';
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
   * @param deploymentId - A deployment ID or undefined to retrieve it based on the given model.
   * @param requestConfig - Request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: OrchestrationCompletionParameters,
    deploymentId?: string,
    requestConfig?: CustomRequestConfig
  ): Promise<CompletionPostResponse> {
    const body = constructCompletionPostRequest(data);
    deploymentId =
      deploymentId ??
      (await resolveDeploymentId({
        scenarioId: 'orchestration',
        resourceGroup: pickValueIgnoreCase(
          requestConfig?.headers,
          'ai-resource-group'
        )
      }));

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
