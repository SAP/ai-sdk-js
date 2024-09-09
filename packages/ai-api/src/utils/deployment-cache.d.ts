import { type AiDeployment } from '../client/AI_CORE_API/index.js';
import { type DeploymentResolutionOptions } from './deployment-resolver.js';
import { type FoundationModel } from './model.js';
interface Deployment {
  id: string;
  model?: FoundationModel;
}
/**
 * Cache for deployments.
 * @internal
 */
export declare const deploymentCache: {
  /**
   * Get a deployment from the cache.
   * @param opts - Deployment resolution options to get the cached deployment for.
   * @returns The cached deployment or undefined if not found.
   */
  get: (opts: DeploymentResolutionOptions) => Deployment | undefined;
  /**
   * Store a deployment in the cache.
   * @param opts - Deployment resolution options to set the deployment for.
   * @param deployment - Deployment to cache.
   */
  set: (opts: DeploymentResolutionOptions, deployment: AiDeployment) => void;
  /**
   * Store multiple deployments in the cache, based on the model from the respective AI deployments.
   * @param opts - Deployment resolution options to set the deployments for. Model information in the deployment resolution options are ignored.
   * @param deployments - Deployments to retrieve the IDs and models from.
   */
  setAll: (
    opts: DeploymentResolutionOptions,
    deployments: AiDeployment[]
  ) => void;
  clear: () => void;
};
export {};
//# sourceMappingURL=deployment-cache.d.ts.map
