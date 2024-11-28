import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  getResourceGroup,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import { type AwsAnthropicChatModel } from './model-types.js';
import { AwsAnthropicChatCompletionResponse } from './aws-anthropic-chat-completion-response.js';
import type { Anthropic } from '@anthropic-ai/sdk';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

/**
 * Representation of the 'AwsAnthropicMessageCreationRequest' type extending the imported Anthropic.MessageCreateParams schema. 'model' is omitted because AI Core does not require it.
 */
export type AwsAnthropicMessageCreationRequest = Omit<
  Anthropic.MessageCreateParams,
  'model'
> & {
  anthropic_version: string;
  max_tokens: number;
};

/**
 * AWS Anthropic client for chat completion.
 */
export class AwsAnthropicChatClient {
  /**
   * Creates an instance of the AWS Anthropic chat client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   */
  constructor(
    private modelDeployment: ModelDeployment<AwsAnthropicChatModel>
  ) {}

  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async run(
    data: AwsAnthropicMessageCreationRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<AwsAnthropicChatCompletionResponse> {
    const response = await this.executeRequest(data, requestConfig);
    return new AwsAnthropicChatCompletionResponse(response);
  }

  private async executeRequest(
    data: AwsAnthropicMessageCreationRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<HttpResponse> {
    const deploymentId = await getDeploymentId(
      this.modelDeployment,
      'aws-bedrock'
    );
    const resourceGroup = getResourceGroup(this.modelDeployment);
    return executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/invoke`,
        resourceGroup
      },
      data,
      requestConfig
    );
  }
}
