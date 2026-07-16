import {
  getResourceGroup,
  resolveDeploymentUrlForModel
} from '@sap-ai-sdk/ai-api/internal.js';
import { createTokenProvider } from '../token-provider.js';
import type {
  SapOpenAiRealtimeContext,
  SapOpenAiRealtimeInput,
  SapOpenAiRealtimeOptions
} from './types.js';

/**
 * Resolves the deployment URL, token provider, and resource group required to open a Realtime API WebSocket for SAP AI Core.
 * @param options - Options including model deployment, destination, and client type. A plain model name string is accepted as shorthand for `{ deployment: modelName }`.
 * @returns A promise that resolves to a {@link SapOpenAiRealtimeContext}.
 * @experimental This function is experimental and may change at any time without prior notice.
 * @internal
 */
export async function createRealtimeContext(
  options: SapOpenAiRealtimeInput
): Promise<SapOpenAiRealtimeContext> {
  const opts: SapOpenAiRealtimeOptions =
    typeof options === 'string' ? { deployment: options } : options;
  const { deployment, destination, clientType } = opts;

  const resourceGroup = getResourceGroup(deployment) ?? 'default';
  const url = await resolveDeploymentUrlForModel(deployment, {
    scenarioId: 'foundation-models',
    executableId: 'azure-openai',
    resourceGroup,
    destination
  });

  return {
    url,
    tokenProvider: createTokenProvider(destination),
    resourceGroup,
    clientType
  };
}
