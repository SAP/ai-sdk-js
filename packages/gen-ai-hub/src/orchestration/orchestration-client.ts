import { executeRequest, CustomRequestConfig } from '@sap-ai-sdk/core';
import {
  DeploymentResolver,
  resolveDeployment
} from '../utils/deployment-resolver.js';
import {
  CompletionPostRequest,
  CompletionPostResponse
} from './client/api/schema/index.js';
import { OrchestrationCompletionParameters } from './orchestration-types.js';
import { OrchestrationResponse } from './orchestration-response.js';

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param deploymentResolver - A deployment ID or a function to retrieve it.
   * @param requestConfig - Request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: OrchestrationCompletionParameters,
    deploymentResolver: DeploymentResolver = () =>
      resolveDeployment({ scenarioId: 'orchestration' }),
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
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

    return new OrchestrationResponse(response);
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

