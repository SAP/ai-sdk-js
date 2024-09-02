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
import { OrchestrationResponse } from './orchestration-response-wrapper.js';

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

  // Update the API function to return the class instance
  async chatCompletionProposal2(
    data: OrchestrationCompletionParameters,
    deploymentResolver: DeploymentResolver = () => resolveDeployment({ scenarioId: 'orchestration' }),
    requestConfig?: CustomRequestConfig
  ): Promise<OrchestrationResponse> {
    const body = constructCompletionPostRequest(data);
    const deployment =
      typeof deploymentResolver === 'function' ? (await deploymentResolver()).id : deploymentResolver;
  
    const response = await executeRequest(
      {
        url: `/inference/deployments/${deployment}/completion`
      },
      body,
      requestConfig
    );
    return new OrchestrationResponse(response); // Return instance of the new class
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

export interface MessageContent {
  content: string;
  finish_reason: string;
}

/**
 * Parses the orchestration response and returns the content and finish reason of the choice.
 * @param response - The orchestration response.
 * @param choiceIndex - The index of the choice to parse.
 * @returns The content and finish reason of the choice.
 */
export function parseMessageContent(response: CompletionPostResponse, choiceIndex?: number): MessageContent[] {
  const choices = response.orchestration_result.choices;

  if(choiceIndex === undefined) {
    return choices.map(choice => ({
      content: choice.message.content,
      finish_reason: choice.finish_reason
    }));
  }

  if (choiceIndex < 0 || choiceIndex >= choices.length) {
    throw new Error('Invalid choice index.');
  }

  const choice = choices[choiceIndex];
  return [{ 
    content: choice.message.content,
    finish_reason: choice.finish_reason 
  }];
}

