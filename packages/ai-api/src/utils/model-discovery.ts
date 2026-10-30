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
 * Filter models that support a specific capability in the orchestration service.
 * Known capability values include `'chat'`, `'embedding'`, `'image_generation'` and more.
 * Check the AI Core API documentation for the authoritative list of capability values.
 * @param models - The list of models to filter.
 * @param capability - The orchestration capability to filter by.
 * @returns Models where at least one non-deprecated version supports the given orchestration capability.
 */
export function filterByOrchestrationCapability(
  models: AiModelBaseData[],
  capability: string
): AiModelBaseData[] {
  return models.filter(model =>
    model.versions.some(
      version =>
        !version.deprecated &&
        version.orchestrationCapabilities?.includes(capability)
    )
  );
}

/**
 * Filter models by a general model capability (e.g. `'vision'`, `'audio'`).
 * Check the AI Core API documentation for the authoritative list of capability values.
 * @param models - The list of models to filter.
 * @param capability - The capability to filter by.
 * @returns Models where at least one non-deprecated version declares the given capability.
 */
export function filterByCapability(
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
export function filterNonDeprecated(
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
 * Get the latest version of each model.
 * Models without a version marked as `isLatest: true` are excluded.
 * @param models - The list of models.
 * @returns An array of objects pairing the model name with its latest {@link AiModelVersion}.
 */
export function getLatestVersions(models: AiModelBaseData[]): {
  model: string;
  executableId: string;
  latestVersion: AiModelVersion;
}[] {
  return models.flatMap(model => {
    const latestVersion = model.versions.find(v => v.isLatest);
    return latestVersion
      ? [
          {
            model: model.model,
            executableId: model.executableId,
            latestVersion
          }
        ]
      : [];
  });
}
