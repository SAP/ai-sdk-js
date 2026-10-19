/* eslint-disable no-console */

import {
  TabularArtifactsApi,
  DataDestinationsApi,
  ScenarioConfigurationManagerApi
} from '@sap-ai-sdk/context-registry';
import { TabularOrchestrationClient } from '@sap-ai-sdk/tabular-orchestration';

import { pollAsyncResource } from './utils.ts';

import type {
  GetDataDestinations,
  TabularArtifactDetails,
  ScenarioConfigurationObject
} from '@sap-ai-sdk/context-registry';
import type { PredictResponse } from '@sap-ai-sdk/tabular-orchestration';

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

  return pollAsyncResource<TabularArtifactDetails>({
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

  const response =
    await ScenarioConfigurationManagerApi.createScenarioConfiguration(
      scenarioConfigName,
      {
        description: 'Sample scenario configuration',
        contextSelectionStrategy: 'random',
        tabularArtifacts: [{ name: artifactName }]
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
  const pollingName = getNameFromLocation(location, 'scenarioConfigurations');

  return pollAsyncResource<ScenarioConfigurationObject>({
    read: () =>
      ScenarioConfigurationManagerApi.getScenarioConfigurationByName(
        pollingName,
        headers
      ).execute(),
    isComplete: resource => resource.status === 'ACTIVE',
    getFailure: resource =>
      resource.status === 'ERROR'
        ? (resource.errorMessage ?? 'Scenario configuration creation failed')
        : undefined,
    onPoll: (attempt, resource) =>
      console.log(
        `[${attempt}] Scenario configuration status: ${resource.status}`
      ),
    intervalMs: 2_000,
    maxAttempts: 60
  });
}

/**
 * Predict sales groups with context rows selected from the tabular artifacts of a scenario configuration.
 * @returns The prediction response.
 */
export async function predictWithScenarioContext(): Promise<PredictResponse> {
  const client = new TabularOrchestrationClient({ resourceGroup });

  return client.predict({
    modelName: 'sap-rpt-1.6',
    scenarioConfigName,
    contextSelectionConfig: {
      strategy: 'random',
      numRows: 3,
      indexColumn: 'id',
      strategyConfig: { deterministic: true }
    },
    predictionConfig: {
      targetColumns: [{ name: 'salesgroup', task_type: 'classification' }]
    },
    modelConfig: { index_column: 'id' },
    rows: [
      {
        id: '1001',
        product: 'Laptop',
        price: 999.99,
        date: '2025-01-15',
        salesgroup: '[PREDICT]'
      },
      {
        id: '1002',
        product: 'Office Chair',
        price: 142.99,
        date: '2025-07-13',
        salesgroup: '[PREDICT]'
      }
    ]
  });
}

/**
 * Predict sales groups with context rows provided in the request, without a scenario configuration.
 * @returns The prediction response.
 */
export async function predictWithInlineContext(): Promise<PredictResponse> {
  const client = new TabularOrchestrationClient({ resourceGroup });

  return client.predict({
    modelName: 'sap-rpt-1.6',
    predictionConfig: {
      targetColumns: [{ name: 'salesgroup', task_type: 'classification' }]
    },
    modelConfig: { index_column: 'id' },
    rows: [
      { id: '35', product: 'Laptop', price: 999.99, salesgroup: '[PREDICT]' },
      {
        id: '571',
        product: 'Office Chair',
        price: 142.99,
        salesgroup: '[PREDICT]'
      }
    ],
    contextRows: [
      {
        id: '42',
        product: 'Desktop Computer',
        price: 921.5,
        salesgroup: 'Electronics'
      },
      {
        id: '99',
        product: 'Macbook',
        price: 1220.99,
        salesgroup: 'Electronics'
      },
      {
        id: '689',
        product: 'Office Desk',
        price: 750.5,
        salesgroup: 'Furniture'
      }
    ]
  });
}

function getNameFromLocation(location: string, segment: string): string {
  const { pathname } = new URL(location, 'https://context-registry.invalid');
  const re = new RegExp(`/${segment}/([^/]+)$`);
  const match = re.exec(pathname);
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
