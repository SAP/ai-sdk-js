import {
  resolveDeploymentUrlForModel,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';
import { createTokenProvider } from './token-provider.js';
import type { AzureClientOptions } from 'openai/azure';
import type { SapOpenAiInput, SapOpenAiOptions } from './types.js';

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
 * import { createOpenAiConfig } from '@sap-ai-sdk/openai';
 *
 * const config = await createOpenAiConfig('gpt-5.4');
 * const client = new AzureOpenAI(config);
 * await client.chat.completions.create({
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */
export async function createOpenAiConfig(
  options: SapOpenAiInput
): Promise<AzureClientOptions> {
  const opts: SapOpenAiOptions =
    typeof options === 'string' ? { deployment: options } : options;
  const {
    deployment,
    destination,
    apiVersion = defaultApiVersion,
    clientType
  } = opts;

  const resourceGroup = getResourceGroup(deployment) ?? 'default';
  const baseUrl = await resolveDeploymentUrlForModel(deployment, {
    scenarioId: 'foundation-models',
    executableId: 'azure-openai',
    resourceGroup,
    destination
  });

  return {
    baseURL: baseUrl,
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
