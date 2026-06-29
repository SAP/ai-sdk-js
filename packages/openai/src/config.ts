import {
  resolveDeploymentUrlForModel,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';
import { createTokenProvider } from './token-provider.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { AzureClientOptions } from 'openai/azure';
import type {
  SapOpenAiInput,
  SapOpenAiOptions
} from './types.js';

const defaultApiVersion = '2024-10-21';

/** @internal */
export interface SapOpenAiContext {
  /** Azure client options ready to pass to `new AzureOpenAI()`. */
  azureOptions: AzureClientOptions;
  /** The resolved destination, forwarded to the token provider and deployment API. */
  destination: HttpDestinationOrFetchOptions | undefined;
  /** The resolved AI resource group. */
  resourceGroup: string;
}

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
  return (await createSapOpenAiContext(options)).azureOptions;
}

/**
 * Resolves the deployment URL, destination, and resource group for SAP AI Core.
 * Use this when you need access to the resolved context beyond just the Azure client options.
 * @param options - Options including model deployment, destination, API version, and client type. A plain model name string is accepted as shorthand for `{ deployment: modelName }`.
 * @returns A promise that resolves to a {@link SapOpenAiContext} containing the Azure client options, destination, and resource group.
 * @internal
 */
export async function createSapOpenAiContext(
  options: SapOpenAiInput
): Promise<SapOpenAiContext> {
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
    azureOptions: {
      baseURL: baseUrl,
      apiVersion: apiVersion ?? defaultApiVersion,
      azureADTokenProvider: createTokenProvider(destination),
      defaultHeaders: {
        'ai-resource-group': resourceGroup,
        'ai-client-type': ['AI SDK JavaScript', clientType]
          .filter(Boolean)
          .join(',')
      }
    },
    destination,
    resourceGroup
  };
}
