export * from './client/AI_CORE_API/index.ts';

export type {
  ModelDeployment,
  DeploymentIdConfig,
  ModelConfig,
  ResourceGroupConfig,
  ModelQueryOptions
} from './utils/index.ts';

export {
  resolveDeploymentUrl,
  getFoundationModelDeploymentId,
  getOrchestrationDeploymentId,
  getOrchestrationDeploymentUrl,
  getModels,
  filterFoundationModelsByCapability,
  filterFoundationModelsNonDeprecated,
  getFoundationModelLatestVersions
} from './utils/index.ts';
