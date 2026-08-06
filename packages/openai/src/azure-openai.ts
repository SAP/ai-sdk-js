import {
  getResourceGroup,
  resolveDeploymentUrlForModel
} from '@sap-ai-sdk/ai-api/internal.js';
import { AzureOpenAI } from 'openai';
import { mergeIgnoreCase } from '@sap-cloud-sdk/util';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { SapModelName, SapOpenAiContext } from './types.ts';

type FinalRequestOptions = Parameters<AzureOpenAI['buildRequest']>[0];

/**
 * Extends {@link AzureOpenAI} for SAP AI Core.
 * @internal
 */
export class SapAzureOpenAi extends AzureOpenAI {
  private destination: HttpDestinationOrFetchOptions | undefined;
  private resourceGroup: string;
  private deployment: ModelDeployment<SapModelName>;

  constructor({
    azureOptions,
    destination,
    resourceGroup,
    deployment
  }: SapOpenAiContext) {
    super(azureOptions);
    this.deployment = deployment;
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
      if (
        isModelDeployment(model) &&
        !isSameModelDeployment(model, this.deployment)
      ) {
        const modelResourceGroup = getResourceGroup(model);
        const deploymentUrl = await resolveDeploymentUrlForModel(model, {
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          resourceGroup: modelResourceGroup || this.resourceGroup,
          destination: this.destination
        });
        options = {
          ...options,
          path: `${deploymentUrl}${options.path}`,
          ...(modelResourceGroup && {
            headers: mergeIgnoreCase(options.headers || {}, {
              'ai-resource-group': modelResourceGroup
            })
          })
        };
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

/**
 * Normalizes a `ModelDeployment` to its object form.
 * Converts a plain model name string to `{ modelName }`.
 * @param deployment - Model deployment to normalize.
 * @returns The deployment in object form.
 */
function normalizeModelDeployment<ModelNameT extends string>(
  deployment: ModelDeployment<ModelNameT>
): Extract<ModelDeployment<ModelNameT>, object> {
  return typeof deployment === 'string'
    ? { modelName: deployment }
    : deployment;
}

/**
 * Checks whether a per-request model deployment matches the client's configured deployment.
 * All fields present in `perRequestModel` must equal the corresponding fields in `clientDeployment`.
 * @param perRequestModel - The deployment specified on an individual request.
 * @param clientDeployment - The deployment configured on the Azure OpenAI client.
 * @returns `true` if every field in `perRequestModel` matches `clientDeployment`, `false` otherwise.
 */
function isSameModelDeployment(
  perRequestModel: ModelDeployment,
  clientDeployment: ModelDeployment
) {
  const normalized = {
    perRequestModel: normalizeModelDeployment(perRequestModel),
    clientDeployment: normalizeModelDeployment(clientDeployment)
  };

  return Object.entries(normalized.perRequestModel).every(
    ([key, value]) =>
      normalized.clientDeployment[
        key as keyof typeof normalized.clientDeployment
      ] === value
  );
}
