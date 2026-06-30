import {
  getResourceGroup,
  resolveDeploymentUrlForModel
} from '@sap-ai-sdk/ai-api/internal.js';
import { AzureOpenAI } from 'openai';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { SapOpenAiContext } from './config.js';

type FinalRequestOptions = Parameters<AzureOpenAI['buildRequest']>[0];

/**
 * Extends {@link AzureOpenAI} for SAP AI Core.
 * @internal
 */
export class SapAzureOpenAi extends AzureOpenAI {
  private destination: HttpDestinationOrFetchOptions | undefined;
  private resourceGroup: string;

  constructor({ azureOptions, destination, resourceGroup }: SapOpenAiContext) {
    super(azureOptions);
    this.destination = destination;
    this.resourceGroup = resourceGroup;
  }

  override async buildRequest(
    options: FinalRequestOptions,
    props: { retryCount?: number } = {}
  ): Promise<{
    req: RequestInit & { headers: Headers };
    url: string;
    timeout: number;
  }> {
    if (isObj(options.body) && 'model' in options.body) {
      const { model } = options.body;
      if (isModelDeployment(model)) {
        const resourceGroup = getResourceGroup(model) ?? this.resourceGroup;
        const deploymentUrl = await resolveDeploymentUrlForModel(model, {
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          resourceGroup,
          destination: this.destination
        });
        options.path = `${deploymentUrl}${options.path}`;
      }
    }
    return super.buildRequest(options, props);
  }
}

function isModelDeployment(value: unknown): value is ModelDeployment {
  if (value && typeof value === 'string') {
    return true;
  }
  if (isObj(value)) {
    return 'modelName' in value || 'deploymentId' in value;
  }
  return false;
}

function isObj(obj: unknown): obj is Record<string, unknown> {
  return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}
