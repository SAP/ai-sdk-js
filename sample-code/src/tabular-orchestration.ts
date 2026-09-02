/* eslint-disable no-console */

import {
  TabularArtifactsApi,
  DataDestinationsApi,
  ScenarioConfigurationManagerApi
} from '@sap-ai-sdk/context-registry';

import { pollAsyncResource } from './utils.ts';

import type {
  GetDataDestinations,
  TabularArtifactDetails,
  ScenarioConfigurationObject
} from '@sap-ai-sdk/context-registry';

const resourceGroup = 'default';
const headers = { 'AI-Resource-Group': resourceGroup };

const artifactName = 'ai-sdk-tabular-artifact';
const dataDestinationName = 'ai-sdk-hdl-destination';
const artifactPath = '/data/product_data_hana_lowercase.parquet';
const scenarioConfigName = 'product-prediction-scenario-lowercase';

/**
 * List all data destinations in the resource group.
 * @returns List of data destinations.
 */
export async function listDataDestinations(): Promise<GetDataDestinations> {
  return DataDestinationsApi.getAllDataDestinations({}, headers).execute();
}

/**
 * Create a tabular artifact asynchronously and poll until active.
 * @param name - The name to assign to the artifact.
 * @returns The completed tabular artifact.
 */
export async function createTabularArtifact(
  name: string
): Promise<TabularArtifactDetails> {
  const response = await TabularArtifactsApi.createTabularArtifact(
    name,
    {
      dataDestinationName,
      type: 'PARQUET',
      path: artifactPath,
      csnMetadata: { definition: { definitionType: 'AUTO' } }
    },
    headers
  ).executeRaw();

  if (response.status !== 202) {
    throw new Error(`Expected 202 Accepted, got ${response.status}`);
  }

  const location = response.headers.location;
  if (typeof location !== 'string') {
    throw new Error('Creation response did not include a Location header');
  }
  const pollingName = getNameFromLocation(location, 'tabularArtifacts');

  const artifact = await pollAsyncResource<TabularArtifactDetails>({
    read: () =>
      TabularArtifactsApi.getTabularArtifactByName(
        pollingName,
        headers
      ).execute(),
    isComplete: resource => resource.status === 'ACTIVE',
    getFailure: resource =>
      resource.status === 'ERROR'
        ? (resource.errorMessage ?? 'Tabular artifact creation failed')
        : undefined,
    onPoll: (attempt, resource) =>
      console.log(`[${attempt}] Tabular artifact status: ${resource.status}`),
    intervalMs: 2_000,
    maxAttempts: 60
  });
  return artifact;
}

/**
 * Delete a tabular artifact and poll until it is gone.
 * @param name - The name of the artifact to delete, as returned by {@link createTabularArtifact}.
 */
export async function deleteTabularArtifact(name: string): Promise<void> {
  await TabularArtifactsApi.deleteTabularArtifact(name, headers).execute();

  await pollAsyncResource<TabularArtifactDetails | null>({
    read: async () => {
      try {
        return await TabularArtifactsApi.getTabularArtifactByName(
          name,
          headers
        ).execute();
      } catch (error) {
        if (getHttpStatus(error) === 404) {
          return null;
        }
        throw error;
      }
    },
    isComplete: resource => resource === null || resource.status === 'DELETING',
    onPoll: (attempt, resource) =>
      console.log(
        `[${attempt}] Tabular artifact status: ${resource?.status ?? 'gone'}`
      ),
    intervalMs: 2_000,
    maxAttempts: 60
  });
}

/**
 * Create a scenario configuration if it doesn't exist yet.
 * @returns The scenario configuration.
 */
export async function getOrCreateScenarioConfiguration(): Promise<ScenarioConfigurationObject> {
  const existing =
    await ScenarioConfigurationManagerApi.getScenarioConfigurationByName(
      scenarioConfigName,
      headers
    )
      .execute()
      .catch(ignoreNotFound);
  if (existing) {
    return existing;
  }

  await ScenarioConfigurationManagerApi.createScenarioConfiguration(
    scenarioConfigName,
    {
      description: 'Sample scenario configuration',
      contextSelectionStrategy: 'random',
      tabularArtifacts: [{ name: artifactName }]
    },
    headers
  ).execute();

  return ScenarioConfigurationManagerApi.getScenarioConfigurationByName(
    scenarioConfigName,
    headers
  ).execute();
}

function getNameFromLocation(location: string, segment: string): string {
  const { pathname } = new URL(location, 'https://context-registry.invalid');
  const match = pathname.match(new RegExp(`/${segment}/([^/]+)$`));
  if (!match) {
    throw new Error(`Unexpected polling location: ${location}`);
  }
  return decodeURIComponent(match[1]!);
}

function ignoreNotFound(error: unknown): undefined {
  if (getHttpStatus(error) !== 404) {
    throw error;
  }
  return undefined;
}

function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }
  if ('status' in error && typeof error.status === 'number') {
    return error.status;
  }
  const response = 'response' in error ? error.response : undefined;
  if (
    response &&
    typeof response === 'object' &&
    'status' in response &&
    typeof response.status === 'number'
  ) {
    return response.status;
  }
  if ('cause' in error) {
    return getHttpStatus(error.cause);
  }
  return undefined;
}
