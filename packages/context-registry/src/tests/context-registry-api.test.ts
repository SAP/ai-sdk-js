import nock from 'nock';

import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.ts';
import {
  DataDestinationsApi,
  ScenarioConfigurationManagerApi,
  TabularArtifactsApi
} from '../client/context-registry/index.ts';

import type {
  GetDataDestinations,
  GetScenarioConfigurations,
  TabularArtifactListResponse
} from '../client/context-registry/index.ts';

const resourceGroup = 'default';
const basePath = '/v2/admin/tcr';

describe('context-registry APIs', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should get all data destinations', async () => {
    const expectedResponse: GetDataDestinations = {
      count: 1,
      resources: [
        {
          type: 'AZURE',
          name: 'my-destination',
          status: 'ACTIVE',
          createdAt: '2024-02-15T12:45:00.000Z',
          updatedAt: '2024-02-15T12:45:00.000Z'
        }
      ]
    };

    nock(aiCoreDestination.url)
      .get(`${basePath}/dataDestinations`)
      .reply(200, expectedResponse, { 'Content-Type': 'application/json' });

    const result = await DataDestinationsApi.getAllDataDestinations(
      {},
      { 'AI-Resource-Group': resourceGroup }
    ).execute();

    expect(result).toEqual(expectedResponse);
  });

  it('should get all tabular artifacts', async () => {
    const expectedResponse: TabularArtifactListResponse = {
      count: 1,
      resources: [
        {
          id: '00000000-0000-0000-0000-000000000000',
          name: 'my-artifact',
          tenantId: 'tenant-1',
          resourceGroupId: 'default',
          dataDestinationName: 'my-destination',
          path: '/data/my-artifact',
          type: 'PARQUET',
          status: 'ACTIVE',
          createdAt: '2024-02-15T12:45:00.000Z',
          updatedAt: '2024-02-15T12:45:00.000Z'
        }
      ]
    };

    nock(aiCoreDestination.url)
      .get(`${basePath}/tabularArtifacts`)
      .reply(200, expectedResponse, { 'Content-Type': 'application/json' });

    const result = await TabularArtifactsApi.getAllTabularArtifacts(
      {},
      { 'AI-Resource-Group': resourceGroup }
    ).execute();

    expect(result).toEqual(expectedResponse);
  });

  it('should get all scenario configurations', async () => {
    const expectedResponse: GetScenarioConfigurations = {
      count: 1,
      resources: [
        {
          name: 'my-config',
          tabularArtifacts: [],
          status: 'ACTIVE',
          createdAt: '2024-02-15T12:45:00.000Z',
          updatedAt: '2024-02-15T12:45:00.000Z'
        }
      ]
    };

    nock(aiCoreDestination.url)
      .get(`${basePath}/scenarioConfigurations`)
      .reply(200, expectedResponse, { 'Content-Type': 'application/json' });

    const result =
      await ScenarioConfigurationManagerApi.getAllScenarioConfigurations(
        {},
        { 'AI-Resource-Group': resourceGroup }
      ).execute();

    expect(result).toEqual(expectedResponse);
  });
});
