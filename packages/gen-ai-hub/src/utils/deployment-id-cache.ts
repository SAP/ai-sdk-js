// TODO: should we move this to @sap-cloud-sdk/connectivity? or add some kind of exception to the rule if possible?
// eslint-disable-next-line import/no-internal-modules
import { Cache } from '@sap-cloud-sdk/connectivity/internal.js';
import { type AiDeployment } from '@sap-ai-sdk/ai-core';
import {
  extractModel,
  type DeploymentResolutionOptions
} from './deployment-resolver.js';

function getCacheKey({
  scenarioId,
  executableId,
  model,
  resourceGroup = 'default'
}: DeploymentResolutionOptions) {
  return `${scenarioId}-${executableId ?? ''}-${model?.name ?? ''}-${model?.version ?? ''}-${resourceGroup}`;
}

/**
 * Create a cache for deployment IDs.
 * @param cache - Pure cache object.
 * @returns The deployment ID cache.
 * @internal
 */
function createDeploymentIdCache(cache: Cache<string>) {
  return {
    /**
     * Get a deployment ID from the cache.
     * @param opts - Deployment resolution options to get the cached deployment ID for.
     * @returns The cached deployment ID or undefined if not found.
     */
    get: (opts: DeploymentResolutionOptions) => cache.get(getCacheKey(opts)),
    /**
     * Store a deployment ID in the cache.
     * @param opts - Deployment resolution options to set the deployment ID for.
     * @param deploymentId - Deployment ID to cache.
     */
    set: (opts: DeploymentResolutionOptions, deploymentId: string) => {
      cache.set(getCacheKey(opts), { entry: deploymentId });
    },
    /**
     * Store multiple deployment IDs in the cache, based on the model from the respective deployments. Deployments without a model are ignored.
     * @param opts - Deployment resolution options to set the deployment IDs for.
     * @param deployments - Deployments to retrieve the IDs and models from.
     */
    setAll: (
      opts: Omit<DeploymentResolutionOptions, 'model'>,
      deployments: AiDeployment[]
    ) => {
      // go backwards to cache the first deployment ID for each model
      deployments.reverse().forEach(deployment => {
        // TODO: move extractModel out of deployment resolver to avoid circular dependency
        cache.set(getCacheKey({ ...opts, model: extractModel(deployment) }), {
          entry: deployment.id
        });
      });
    },
    clear: () => cache.clear()
  };
}

/**
 * Cache for deployment IDs.
 * @internal
 */
export const deploymentIdCache = createDeploymentIdCache(
  new Cache(5 * 60 * 1000) // 5 minutes
);
