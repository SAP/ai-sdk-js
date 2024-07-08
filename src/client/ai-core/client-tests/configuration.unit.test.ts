import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../../../test-util/mock-context.js';
import {
    ConfigurationApi,
    ConfigurationBaseData,
    ConfigurationCreationResponse,
    ConfigurationList,
    Configuration
} from '../../../../poc/AI_CORE_API'

describe('configuration unit tests', () => {
    let destination: HttpDestination;

    beforeAll(() => {
        destination = mockGetAiCoreDestination();
    });

    afterEach(() => {
        nock.cleanAll();
    });
    
    it('get configuration parses a successful response', async () => {
        nock(destination.url)
            .get('/lm/configurations')
            .reply(200, {
                count: 1,
                resources: [
                  {
                    createdAt: '2024-04-17T15:19:45Z',
                    executableId: 'azure-openai',
                    id: '7652a231-ba9b-4fcc-b473-2c355cb21b61',
                    inputArtifactBindings: [],
                    name: 'gpt-4-32k',
                    parameterBindings: [
                      {
                        key: 'modelName',
                        value: 'gpt-4-32k'
                      },
                      {
                        key: 'modelVersion',
                        value: 'latest'
                      }
                    ],
                    scenarioId: 'foundation-models'
                  }
                ]
            }, {
                'Content-Type': 'application/json',
                'AI-Resource-Group': 'default'
            });

        const result: ConfigurationList =
            await ConfigurationApi.configurationQuery({}, {'AI-Resource-Group': 'default'})
            .execute(destination);

        expect(result).toBeTruthy();
        expect(result.count).toBe(1);
        expect(result.resources.length).toBe(1);

        const configuration: Configuration = result.resources[0];
        const parameterBindings = configuration.parameterBindings ?? [];

        expect(configuration.createdAt).toBe('2024-04-17T15:19:45Z');
        expect(configuration.executableId).toBe('azure-openai');
        expect(configuration.id).toBe('7652a231-ba9b-4fcc-b473-2c355cb21b61');
        expect(configuration.name).toBe('gpt-4-32k');
        expect(parameterBindings[0]?.key).toBe('modelName');
        expect(parameterBindings[0]?.value).toBe('gpt-4-32k');
        expect(parameterBindings[1]?.key).toBe('modelVersion');
        expect(parameterBindings[1]?.value).toBe('latest');
        expect(configuration.scenarioId).toBe('foundation-models');
    });

    it('post configuration parses a successful response', async () => {
        nock(destination.url)
            .post('/lm/configurations')
            .reply(200, {
                'id': '39f08464-4407-4b98-ade1-578a5ddb08b2',
                'message': 'Configuration created'
            }, {
                'Content-Type': 'application/json',
                'AI-Resource-Group': 'default'
            });

        const configurationPostData: ConfigurationBaseData = {
            name: 'i745181-test-config',
            executableId: 'azure-openai',
            scenarioId: 'foundation-models',
            inputArtifactBindings: [
                {
                    artifactId: '08b9e4a4-2cea-4a3c-a509-9308d92bda85',
                    key: 'spam-data'
                }
            ]
        };

        const result: ConfigurationCreationResponse = await ConfigurationApi
            .configurationCreate(configurationPostData, {'AI-Resource-Group': 'default'})
            .execute(destination);

        expect(result).toBeTruthy();
        expect(result.id).toBe('39f08464-4407-4b98-ade1-578a5ddb08b2');
        expect(result.message).toBe('Configuration created');
    });
});