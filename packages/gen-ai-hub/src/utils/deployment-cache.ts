import { Cache } from '@sap-cloud-sdk/connectivity/internal.js';
import { type AiDeployment } from '@sap-ai-sdk/ai-core';
import { type DeploymentResolutionOptions } from './deployment-resolver.js';
import { extractModel, type FoundationModel } from './model.js';

function getCacheKey({
  scenarioId,
  executableId = '',
  model,
  resourceGroup = 'default'
}: DeploymentResolutionOptions) {
  return `${scenarioId}:${executableId}:${model?.name ?? ''}:${model?.version ?? ''}:${resourceGroup}`;
}

interface Deployment {
  id: string;
  model?: FoundationModel;
}

/**
 * Create a cache for deployments.
 * @param cache - Pure cache object.
 * @returns The deployment cache.
 * @internal
 */
function createDeploymentCache(cache: Cache<Deployment>) {
  return {
    /**
     * Get a deployment from the cache.
     * @param opts - Deployment resolution options to get the cached deployment for.
     * @returns The cached deployment or undefined if not found.
     */
    get: (opts: DeploymentResolutionOptions): Deployment | undefined =>
      cache.get(getCacheKey(opts)),
    /**
     * Store a deployment in the cache.
     * @param opts - Deployment resolution options to set the deployment for.
     * @param deployment - Deployment to cache.
     */
    set: (
      opts: DeploymentResolutionOptions,
      deployment: AiDeployment
    ): void => {
      cache.set(getCacheKey(opts), {
        entry: transformDeploymentForCache(deployment)
      });
    },
    /**
     * Store multiple deployments in the cache, based on the model from the respective AI deployments.
     * @param opts - Deployment resolution options to set the deployments for. Model information in the deployment resolution options are ignored.
     * @param deployments - Deployments to retrieve the IDs and models from.
     */
    setAll: (
      opts: DeploymentResolutionOptions,
      deployments: AiDeployment[]
    ): void => {
      // go backwards to cache the first deployment ID for each model
      [...deployments]
        .reverse()
        .map(deployment => transformDeploymentForCache(deployment))
        .flatMap(entry => [
          entry,
          { id: entry.id },
          ...(entry.model
            ? [{ id: entry.id, model: { name: entry.model.name } }]
            : [])
        ]).forEach(entry => {
        cache.set(getCacheKey({ ...opts, model: entry.model }), {
          entry
        });
      });
    },
    clear: () => cache.clear()
  };
}

function transformDeploymentForCache(deployment: AiDeployment): Deployment {
  return {
    id: deployment.id,
    model: extractModel(deployment)
  };
}

/**
 * Cache for deployments.
 * @internal
 */
export const deploymentCache = createDeploymentCache(
  new Cache(5 * 60 * 1000) // 5 minutes
);
