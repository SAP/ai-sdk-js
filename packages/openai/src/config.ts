import {
  resolveDeploymentUrl,
  getResourceGroup,
  translateToFoundationModel,
  isDeploymentIdConfig
} from '@sap-ai-sdk/ai-api/internal.js';
import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import { createTokenProvider } from './token-provider.js';
import type { AzureClientOptions } from 'openai/azure';
import type { SapAzureOpenAIOptions } from './types.js';

const defaultApiVersion = '2024-10-21';

/**
 * Creates a configuration object that can be passed directly to `new AzureOpenAI(config)`.
 * Resolves the deployment URL and sets up token-based authentication for SAP AI Core.
 * @param options - The options for creating the OpenAI configuration.
 * @returns A promise that resolves to an AzureClientOptions object.
 * @experimental This function is experimental and may change at any time without prior notice.
 * @example
 * ```ts
 * import { AzureOpenAI } from 'openai';
 * import { createOpenAIConfig } from '@sap-ai-sdk/openai';
 *
 * const config = await createOpenAIConfig({ modelDeployment: 'gpt-5.4' });
 * const client = new AzureOpenAI(config);
 * await client.chat.completions.create({
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */
export async function createOpenAIConfig(
  options: SapAzureOpenAIOptions
): Promise<AzureClientOptions> {
  const { modelDeployment, destination, apiVersion, clientType } = options;

  const resourceGroup = getResourceGroup(modelDeployment) ?? 'default';

  const baseURL = isDeploymentIdConfig(modelDeployment)
    ? (
        await DeploymentApi.deploymentGet(
          modelDeployment.deploymentId,
          {},
          { 'AI-Resource-Group': resourceGroup }
        ).execute(destination)
      ).deploymentUrl
    : await resolveDeploymentUrl({
        scenarioId: 'foundation-models',
        executableId: 'azure-openai',
        model: translateToFoundationModel(modelDeployment),
        resourceGroup,
        destination
      });

  if (!baseURL) {
    const identifier = isDeploymentIdConfig(modelDeployment)
      ? `ID '${modelDeployment.deploymentId}'`
      : `model '${translateToFoundationModel(modelDeployment).name}'`;
    throw new Error(
      `Deployment for ${identifier} has no deployment URL. Ensure the deployment is running.`
    );
  }

  return {
    baseURL,
    apiVersion: apiVersion ?? defaultApiVersion,
    azureADTokenProvider: createTokenProvider(destination),
    defaultHeaders: {
      'ai-resource-group': resourceGroup,
      'ai-client-type': ['AI SDK JavaScript', clientType]
        .filter(Boolean)
        .join(',')
    }
  };
}
