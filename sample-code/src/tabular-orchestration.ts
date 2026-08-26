import type { DataDestinationAsyncGetDataDestinations,
  TabularArtifactAsyncTabularArtifactDetails,
  ScenarioConfigurationAsyncScenarioConfigurationObject } from '@sap-ai-sdk/ctx-registry/internal.js';
import { pollAsyncResource } from '@sap-ai-sdk/core';
import {
  TabularArtifactAsyncSpecificationTabularArtifactsApi,
  DataDestinationAsyncSpecificationDataDestinationsApi,
  ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi
} from '@sap-ai-sdk/ctx-registry/internal.js';
import { TabularOrchestrationClient } from '@sap-ai-sdk/tabular-orchestration';
import type { TFMEnum } from '@sap-ai-sdk/tabular-orchestration';

const resourceGroup = 'default';
const headers = { 'AI-Resource-Group': resourceGroup };

const artifactName = 'sample-tabular-artifact';
const dataDestinationName = 'sample-data-destination';
const artifactPath = '/data/product_data.parquet';
const scenarioConfigName = 'sample-scenario-config';
const modelName: TFMEnum = 'sap-rpt-1.5';

/**
 * List all data destinations in the resource group.
 * @returns List of data destinations.
 */
export async function listDataDestinations(): Promise<DataDestinationAsyncGetDataDestinations> {
  return DataDestinationAsyncSpecificationDataDestinationsApi.getAllDataDestinations(
    {},
    headers
  ).execute();
}

/**
 * Create a tabular artifact asynchronously and poll until active.
 * @returns The completed tabular artifact.
 */
export async function createTabularArtifact(): Promise<TabularArtifactAsyncTabularArtifactDetails> {
  const response =
    await TabularArtifactAsyncSpecificationTabularArtifactsApi.createTabularArtifact(
      artifactName,
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

  return pollAsyncResource({
    read: () =>
      TabularArtifactAsyncSpecificationTabularArtifactsApi.getTabularArtifactByName(
        pollingName,
        headers
      ).execute(),
    isComplete: resource => resource.status === 'ACTIVE',
    getFailure: resource =>
      resource.status === 'ERROR'
        ? (resource.errorMessage ?? 'Tabular artifact creation failed')
        : undefined,
    intervalMs: 2_000,
    maxAttempts: 60
  });
}

/**
 * Delete a tabular artifact and poll until it is gone.
 */
export async function deleteTabularArtifact(): Promise<void> {
  await TabularArtifactAsyncSpecificationTabularArtifactsApi.deleteTabularArtifact(
    artifactName,
    headers
  ).execute();

  await pollAsyncResource<TabularArtifactAsyncTabularArtifactDetails | null>({
    read: async () => {
      try {
        return await TabularArtifactAsyncSpecificationTabularArtifactsApi.getTabularArtifactByName(
          artifactName,
          headers
        ).execute();
      } catch (error) {
        if (getHttpStatus(error) === 404) {return null;}
        throw error;
      }
    },
    isComplete: resource => resource === null,
    intervalMs: 2_000,
    maxAttempts: 60
  });
}

/**
 * Create a scenario configuration if it doesn't exist yet.
 * @returns The scenario configuration.
 */
export async function getOrCreateScenarioConfiguration(): Promise<ScenarioConfigurationAsyncScenarioConfigurationObject> {
  const existing =
    await ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi.getScenarioConfigurationByName(
      scenarioConfigName,
      headers
    )
      .execute()
      .catch(ignoreNotFound);
  if (existing) {return existing;}

  await ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi.createScenarioConfiguration(
    scenarioConfigName,
    {
      description: 'Sample scenario configuration',
      contextSelectionStrategy: 'random',
      tabularArtifacts: [{ name: artifactName }]
    },
    headers
  ).execute();

  return ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi.getScenarioConfigurationByName(
    scenarioConfigName,
    headers
  ).execute();
}

/**
 * Run a prediction using a running tabular-orchestration deployment.
 * @returns The prediction response.
 */
export async function predict() {
  const client = new TabularOrchestrationClient({ resourceGroup });

  return client.predict({
    modelName,
    scenarioConfigName,
    contextSelectionConfig: {
      numRows: 3,
      strategy: 'random',
      strategyConfigs: { indexColumn: '__row_idx__', deterministic: true }
    },
    predictionConfig: {
      targetColumns: [{ name: 'salesgroup', task_type: 'classification' }]
    },
    rows: [
      {
        product: 'Laptop',
        price: 999.99,
        production_date: '2025-01-15',
        __row_idx__: 'prediction-1',
        salesgroup: '[PREDICT]'
      },
      {
        product: 'Office Chair',
        price: 142.99,
        production_date: '2025-07-13',
        __row_idx__: 'prediction-2',
        salesgroup: '[PREDICT]'
      }
    ]
  });
}

function getNameFromLocation(location: string, segment: string): string {
  const { pathname } = new URL(location, 'https://ctx-registry.invalid');
  const match = pathname.match(new RegExp(`/${segment}/([^/]+)$`));
  if (!match) {throw new Error(`Unexpected polling location: ${location}`);}
  return decodeURIComponent(match[1]!);
}

function ignoreNotFound(error: unknown): undefined {
  if (getHttpStatus(error) !== 404) {throw error;}
  return undefined;
}

function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {return undefined;}
  if ('status' in error && typeof error.status === 'number')
    {return error.status;}
  if (
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response &&
    typeof error.response.status === 'number'
  )
    {return error.response.status;}
  return undefined;
}
