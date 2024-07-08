import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import {
  ArtifactApi,
  ArtifactCreationResponse,
  ArtifactList,
  ArtifactPostData,
  Artifact
} from '../index.js';

describe('artifact unit tests', () => {
  let destination: HttpDestination;

  beforeAll(() => {
    destination = {
      url: 'https://api.ai.intprod-eu12.eu-central-1.aws.ml.hana.ondemand.com/v2'
    };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('get artifact parses a successful response', async () => {
    nock(destination.url)
      .get('/lm/artifacts')
      .reply(
        200,
        {
          count: 1,
          resources: [
            {
              createdAt: '2024-07-08T13:36:41Z',
              description: 'dataset for training test',
              id: '08b9e4a4-2cea-4a3c-a509-9308d92bda85',
              kind: 'dataset',
              modifiedAt: '2024-07-08T13:36:41Z',
              name: 'i745181-test-data',
              scenarioId: 'foundation-models',
              url: 'ai://default/spam/data'
            }
          ]
        },
        {
          'Content-Type': 'application/json',
          'AI-Resource-Group': 'default'
        }
      );

    const result: ArtifactList = await ArtifactApi.artifactQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute(destination);

    expect(result).toBeTruthy();
    expect(result.count).toBe(1);
    expect(result.resources.length).toBe(1);

    const artifact: Artifact = result.resources[0];
    expect(artifact.createdAt).toBe('2024-07-08T13:36:41Z');
    expect(artifact.description).toBe('dataset for training test');
    expect(artifact.id).toBe('08b9e4a4-2cea-4a3c-a509-9308d92bda85');
    expect(artifact.kind).toBe('dataset');
    expect(artifact.modifiedAt).toBe('2024-07-08T13:36:41Z');
    expect(artifact.name).toBe('i745181-test-data');
    expect(artifact.scenarioId).toBe('foundation-models');
    expect(artifact.url).toBe('ai://default/spam/data');
  });

  it('post artifact parses a successful response', async () => {
    nock(destination.url).post('/lm/artifacts').reply(
      200,
      {
        id: '08b9e4a4-2cea-4a3c-a509-9308d92bda85',
        message: 'Artifact acknowledged',
        url: 'ai://default/spam/data'
      },
      {
        'Content-Type': 'application/json',
        'AI-Resource-Group': 'default'
      }
    );

    const artifactPostData: ArtifactPostData = {
      description: 'dataset for training test',
      kind: 'dataset',
      name: 'i745181-test-data',
      scenarioId: 'foundation-models',
      url: 'ai://default/spam/data'
    };

    const result: ArtifactCreationResponse = await ArtifactApi.artifactCreate(
      artifactPostData,
      { 'AI-Resource-Group': 'default' }
    ).execute(destination);

    expect(result).toBeTruthy();
    expect(result.id).toBe('08b9e4a4-2cea-4a3c-a509-9308d92bda85');
    expect(result.message).toBe('Artifact acknowledged');
    expect(result.url).toBe('ai://default/spam/data');
  });
});
