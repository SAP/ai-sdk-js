import { type FoundationModel } from './model.js';
/**
 * The model deployment configuration when using a model.
 * @typeParam ModelNameT - String literal type representing the name of the model.
 */
export interface ModelConfiguration<ModelNameT = string> {
  /**
   * The name of the model.
   */
  modelName: ModelNameT;
  /**
   * The version of the model.
   */
  modelVersion?: string;
}
/**
 * The deployment configuration when using a deployment ID.
 */
export interface DeploymentIdConfiguration {
  /**
   * The deployment ID.
   */
  deploymentId: string;
}
/**
 * The deployment configuration when using a resource group.
 */
export interface ResourceGroupConfiguration {
  /**
   * The resource group of the deployment.
   */
  resourceGroup?: string;
}
/**
 * The configuration of a model deployment.
 * @typeParam ModelNameT - String literal type representing the name of the model.
 */
export type ModelDeployment<ModelNameT = string> =
  | ModelNameT
  | ((ModelConfiguration<ModelNameT> | DeploymentIdConfiguration) &
      ResourceGroupConfiguration);
/**
 * The options for the deployment resolution.
 * @internal
 */
export interface DeploymentResolutionOptions {
  /**
   * The scenario ID of the deployment.
   */
  scenarioId: string;
  /**
   * The name and potentially version of the model to look for.
   */
  model?: FoundationModel;
  /**
   * The executable ID of the deployment.
   */
  executableId?: string;
  /**
   * The resource group of the deployment.
   */
  resourceGroup?: string;
}
/**
 * Query the AI Core service for a deployment that matches the given criteria. If more than one deployment matches the criteria, the first one's ID is returned.
 * @param opts - The options for the deployment resolution.
 * @returns A promise of a deployment, if a deployment was found, fails otherwise.
 * @internal
 */
export declare function resolveDeploymentId(
  opts: DeploymentResolutionOptions
): Promise<string>;
/**
 * Get the deployment ID for a given model deployment configuration and executable ID using the 'foundation-models' scenario.
 * @param modelDeployment - The model deployment configuration.
 * @param executableId - The executable ID.
 * @returns The ID of the deployment, if found.
 * @internal
 */
export declare function getDeploymentId(
  modelDeployment: ModelDeployment,
  executableId: string
): Promise<string>;
//# sourceMappingURL=deployment-resolver.d.ts.map
