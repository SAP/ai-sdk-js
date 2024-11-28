import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  getResourceGroup,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import { AwsAnthropicEmbeddingResponse } from './aws-anthropic-embedding-response.js';
import { type AwsAnthropicEmbeddingModel } from './model-types.js';
import type { AwsAnthropicEmbeddingParameters } from './aws-anthropic-embedding-types.js';

/**
 * AWS Anthropic client for embeddings.
 */
export class AwsAnthropicEmbeddingClient {
  /**
   * Creates an instance of the AWS Anthropic embedding client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   */

  constructor(
    private modelDeployment: ModelDeployment<AwsAnthropicEmbeddingModel>
  ) {}

  /**
   * Creates an embedding vector representing the given text.
   * @param data - The text to embed.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async run(
    data: AwsAnthropicEmbeddingParameters,
    requestConfig?: CustomRequestConfig
  ): Promise<AwsAnthropicEmbeddingResponse> {
    const deploymentId = await getDeploymentId(
      this.modelDeployment,
      'aws-bedrock'
    );
    const resourceGroup = getResourceGroup(this.modelDeployment);
    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/invoke`,
        resourceGroup
      },
      data,
      requestConfig
    );
    return new AwsAnthropicEmbeddingResponse(response);
  }
}
