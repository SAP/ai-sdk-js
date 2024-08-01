import { DeploymentApi } from '@sap-ai-sdk/ai-core';
import { executeRequest, CustomRequestConfig } from '../core/index.js';
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
    data: OrchestrationConfig,
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    const dataWithInputParams = {
      deploymentConfiguration: data.deploymentConfiguration,
      ...constructCompletionPostRequest(data)
    };
    const deploymentList = await DeploymentApi.deploymentQuery({scenarioId: 'orchestrtation'}, {"AI-Resource-Group": "default" })
      .execute({destinationName: "aicore"});
    const deploymentId = deploymentList['resources'][0].id;
    const response = await executeRequest(
      { deploymentId: deploymentId, path: '/completion' },
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
