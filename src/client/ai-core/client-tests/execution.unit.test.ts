import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../../../test-util/mock-context.js';
import {
    EnactmentCreationRequest,
    Execution,
    ExecutionApi,
    ExecutionCreationResponse,
    ExecutionList
} from '../../../../poc/AI_CORE_API'

describe('execution unit tests', () => {
    let destination: HttpDestination;

    beforeAll(() => {
        destination = mockGetAiCoreDestination();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('get execution parses a successful response', async () => {
        nock(destination.url)
            .get('/lm/executions')
            .reply(200, {
                count: 1,
                resources: [
                  {
                    completionTime: '2023-08-05T14:10:16Z',
                    configurationId: 'e0a9eb2e-9ea1-43bf-aff5-7660db166676',
                    configurationName: 'spam-detection-execution-config-0',
                    createdAt: '2023-08-05T14:07:52Z',
                    executableId: 'wt-spam-detection-i343697',
                    id: 'eab289226fe981da',
                    modifiedAt: '2023-08-05T14:10:54Z',
                    outputArtifacts: [
                        {
                            createdAt: '2023-08-05T14:10:05Z',
                            description: '',
                            executionId: 'eab289226fe981da',
                            id: 'be0d728f-1cb2-4ff4-97ad-45c54ac592f6',
                            kind: 'model',
                            modifiedAt: '2023-08-05T14:10:05Z',
                            name: 'classifier-model-output',
                            scenarioId: 'scenario-spam-detection-i343697',
                            url: 'ai://default/eab289226fe981da/classifier-model-output'
                        }
                    ],
                    scenarioId: 'scenario-spam-detection-i343697',
                    startTime: '2023-08-05T14:09:21Z',
                    status: 'COMPLETED',
                    submissionTime: '2023-08-05T14:09:21Z',
                    targetStatus: 'COMPLETED'
                  }
                ]
            }, {
                'Content-Type': 'application/json',
                'AI-Resource-Group': 'default'
            });

        const result: ExecutionList =
            await ExecutionApi.executionQuery({}, {'AI-Resource-Group': 'default'})
            .execute(destination);

        expect(result).not.toBeNull();
        expect(result.count).toEqual(1);
        expect(result.resources.length).toEqual(1);

        const execution: Execution = result.resources[0];
        const outputArtifacts = execution.outputArtifacts ?? [];

        expect(execution.completionTime).toEqual('2023-08-05T14:10:16Z');
        expect(execution.configurationId).toEqual('e0a9eb2e-9ea1-43bf-aff5-7660db166676');
        expect(execution.configurationName).toEqual('spam-detection-execution-config-0');
        expect(execution.createdAt).toEqual('2023-08-05T14:07:52Z');
        expect(execution.status).toEqual('COMPLETED');
        expect(execution.executableId).toEqual('wt-spam-detection-i343697');
        expect(outputArtifacts[0].id).toEqual('be0d728f-1cb2-4ff4-97ad-45c54ac592f6');
        expect(outputArtifacts[0].kind).toEqual('model');
        expect(outputArtifacts[0].url).toEqual('ai://default/eab289226fe981da/classifier-model-output');
    });

    it('post execution parses a successful response', async () => {
        nock(destination.url)
            .post('/lm/executions')
            .reply(200, {
                id: 'eab289226fe981da',
                message: 'Execution acknowledged',
                url: 'ai://default/eab289226fe981da'
            }, {
                'Content-Type': 'application/json',
                'AI-Resource-Group': 'default'
            });
        
        const executionPostData: EnactmentCreationRequest = {
            configurationId: 'eab289226fe981da'
        }

        const result: ExecutionCreationResponse = await ExecutionApi
            .executionCreate(executionPostData, {'AI-Resource-Group': 'default'})
            .execute(destination);
        
        expect(result).toBeTruthy();
        expect(result.id).toBe('eab289226fe981da');
        expect(result.message).toBe('Execution acknowledged');
        expect(result.url).toBe('ai://default/eab289226fe981da')
    });

});