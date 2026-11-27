import { Cache } from '@sap-cloud-sdk/connectivity/internal';

import { type AiDeployment } from '../client/AI_CORE_API/index.ts';
import { type DeploymentResolutionOptions } from './deployment-resolver.ts';
import { extractModel, type FoundationModel } from './model.ts';

function getCacheKey({
  scenarioId,
  executableId = '',
  model,
  resourceGroup = 'default'
}: DeploymentResolutionOptions) {
  return JSON.stringify([
    scenarioId,
    executableId,
    model?.name ?? '',
    model?.version ?? '',
    resourceGroup
  ]);
}

function getIdCacheKey(
  deploymentId: string,
  {
    scenarioId,
    executableId = '',
    resourceGroup = 'default'
  }: DeploymentResolutionOptions
) {
  return JSON.stringify([
    'id',
    scenarioId,
    executableId,
    deploymentId,
    resourceGroup
  ]);
}

interface Deployment {
  id: string;
  url?: string;
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
     * Get a deployment by ID from the cache. Only deployments stored with {@link setAll} are indexed by ID.
     * @param opts - Deployment resolution options the deployments were listed with. Model information is ignored.
     * @param deploymentId - ID of the deployment.
     * @returns The cached deployment or undefined if not found.
     */
    getById: (
      opts: DeploymentResolutionOptions,
      deploymentId: string
    ): Deployment | undefined => cache.get(getIdCacheKey(deploymentId, opts)),
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
     * Store multiple deployments in the cache, based on the model and ID from the respective AI deployments.
     * @param opts - Deployment resolution options to set the deployments for. Model information in the deployment resolution options are ignored.
     * @param deployments - Deployments to retrieve the IDs and models from.
     */
    setAll: (
      opts: DeploymentResolutionOptions,
      deployments: AiDeployment[]
    ): void => {
      // go backwards to cache the first deployment ID for each model
      deployments
        .toReversed()
        .map(deployment => transformDeploymentForCache(deployment))
        .flatMap(entry => [
          entry,
          { id: entry.id, url: entry.url },
          ...(entry.model
            ? [
                {
                  id: entry.id,
                  url: entry.url,
                  model: { name: entry.model.name }
                }
              ]
            : [])
        ])
        .forEach(entry => {
          cache.set(getCacheKey({ ...opts, model: entry.model }), {
            entry
          });
        });
      deployments.forEach(deployment => {
        cache.set(getIdCacheKey(deployment.id, opts), {
          entry: transformDeploymentForCache(deployment)
        });
      });
    },
    clear: () => cache.clear()
  };
}

function transformDeploymentForCache(deployment: AiDeployment): Deployment {
  return {
    id: deployment.id,
    url: deployment.deploymentUrl,
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
