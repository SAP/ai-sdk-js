import {
  getFoundationModelDeploymentId,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';
import { getAiCoreDestination } from '@sap-ai-sdk/core';
import { createTokenProvider } from './token-provider.js';
import type { AzureClientOptions } from 'openai/azure';
import type { SapAzureOpenAIOptions } from './types.js';

const apiVersion = '2024-10-21';

/**
 * Creates a configuration object that can be passed directly to `new AzureOpenAI(config)`.
 * Resolves the deployment URL and sets up token-based authentication for SAP AI Core.
 *
 * @example
 * ```ts
 * import { AzureOpenAI } from 'openai';
 * import { createOpenAIConfig } from '@sap-ai-sdk/foundation-models-openai';
 *
 * const config = await createOpenAIConfig({ modelDeployment: 'gpt-4.1' });
 * const client = new AzureOpenAI(config);
 * await client.chat.completions.create({
 *   model: 'gpt-4.1',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */
export async function createOpenAIConfig(
  options: SapAzureOpenAIOptions
): Promise<AzureClientOptions> {
  const { modelDeployment, destination } = options;

  const deploymentId = await getFoundationModelDeploymentId(
    modelDeployment,
    'azure-openai',
    destination
  );
  const resourceGroup = getResourceGroup(modelDeployment) ?? 'default';
  const dest = await getAiCoreDestination(destination);
  const baseURL = `${dest.url.replace(/\/+$/, '')}/v2/inference/deployments/${deploymentId}`;

  return {
    baseURL,
    apiVersion,
    azureADTokenProvider: createTokenProvider(destination),
    defaultHeaders: {
      'ai-resource-group': resourceGroup,
      'ai-client-type': 'AI SDK JavaScript'
    }
  };
}
