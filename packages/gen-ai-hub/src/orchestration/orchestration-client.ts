import { DeploymentApi } from '@sap-ai-sdk/ai-core';
import { executeRequest, CustomRequestConfig, DeploymentResolver, AiDeployment, resolveDeployment } from '../core/index.js';
import { CompletionPostRequest, OrchestrationConfig } from './api/schema/index.js';
import { OrchestrationCompletionParameters, OrchestrationResponse } from './orchestration-types.js';

/**
 * A client for the orchestration service.
 */
export class OrchestrationService {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - Request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: OrchestrationCompletionParameters,
    deploymentResolver: DeploymentResolver = () => resolveDeployment({ scenarioId: 'orchestration' }),
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    const dataWithInputParams = {
      ...constructCompletionPostRequest(data)
    };

    const deployment =  typeof deploymentResolver === 'function' ? await deploymentResolver() : deploymentResolver;
    
    const response = await executeRequest(
      { deploymentId: deployment.id, path: '/completion' },
      dataWithInputParams,
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
        llm_module_config: input.llmConfig
      },
      ...(input.prompt.template_params && {
        input_params: input.prompt.template_params
      }),
      ...(input.prompt.messages_history && {
        messages_history: input.prompt.messages_history
      })
    }
  };
}