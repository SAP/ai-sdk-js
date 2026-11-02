import { ErrorWithCause } from '@sap-cloud-sdk/util';

import { ScenarioApi } from '../client/AI_CORE_API/index.ts';

import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

import type {
  AiModelBaseData,
  AiModelVersion
} from '../client/AI_CORE_API/index.ts';

const FOUNDATION_MODELS_SCENARIO_ID = 'foundation-models';

/**
 * Options for querying available models.
 */
export interface ModelQueryOptions {
  /**
   * The scenario ID to query models for.
   * Defaults to `'foundation-models'` which covers all Gen AI Hub models.
   */
  scenarioId?: string;
  /**
   * The resource group to use for the request.
   * Defaults to `'default'`.
   */
  resourceGroup?: string;
  /**
   * The destination to use for the request.
   */
  destination?: HttpDestinationOrFetchOptions;
}

/**
 * Retrieve all models available in a scenario on Gen AI Hub.
 * By default, queries the `foundation-models` scenario which exposes all available LLM models.
 * @param opts - Options including optional scenarioId, resourceGroup, and destination.
 * @returns A promise resolving to the list of available models.
 */
export async function getModels(
  opts: ModelQueryOptions = {}
): Promise<AiModelBaseData[]> {
  const {
    scenarioId = FOUNDATION_MODELS_SCENARIO_ID,
    resourceGroup = 'default',
    destination
  } = opts;

  try {
    const { resources } = await ScenarioApi.scenarioQueryModels(scenarioId, {
      'AI-Resource-Group': resourceGroup
    }).execute(destination);
    return resources;
  } catch (error: any) {
    throw new ErrorWithCause(
      `Failed to fetch models for scenario '${scenarioId}'.`,
      error
    );
  }
}

/**
 * Filter models by a general model capability (e.g. `'vision'`).
 * Capability values come from the `capabilities` field returned by the AI Core API.
 * @param models - The list of models to filter.
 * @param capability - The capability to filter by.
 * @returns Models where at least one non-deprecated version declares the given capability.
 */
export function filterFoundationModelsByCapability(
  models: AiModelBaseData[],
  capability: string
): AiModelBaseData[] {
  return models.filter(model =>
    model.versions.some(
      version =>
        !version.deprecated && version.capabilities?.includes(capability)
    )
  );
}

/**
 * Remove deprecated versions from each model, returning only models that still have at least one active version.
 * Models with no remaining active versions are excluded from the result.
 * @param models - The list of models to filter.
 * @returns Models with deprecated versions removed.
 */
export function filterFoundationModelsNonDeprecated(
  models: AiModelBaseData[]
): AiModelBaseData[] {
  return models
    .map(model => ({
      ...model,
      versions: model.versions.filter(v => !v.deprecated)
    }))
    .filter(model => model.versions.length > 0);
}

/**
 * Get the latest version(s) of each model.
 * If a version is marked `isLatest: true`, only that version is returned for the model.
 * If a model has only one version, that version is returned regardless of the `isLatest` flag.
 * If no version is marked as latest and there are multiple versions, all versions are returned.
 * @param models - The list of models.
 * @returns An array of objects pairing the model name with its latest {@link AiModelVersion}(s).
 */
export function getFoundationModelLatestVersions(models: AiModelBaseData[]): {
  model: string;
  executableId: string;
  latestVersions: AiModelVersion[];
}[] {
  return models.map(model => {
    const marked = model.versions.filter(v => v.isLatest);
    const latestVersions = marked.length > 0 ? marked : model.versions;
    return {
      model: model.model,
      executableId: model.executableId,
      latestVersions
    };
  });
}
