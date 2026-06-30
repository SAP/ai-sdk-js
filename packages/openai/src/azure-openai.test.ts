import nock from 'nock';
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach
} from '@jest/globals';
import { AzureOpenAI } from 'openai';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  mockDeploymentsList
} from '../../../test-util/mock-http.js';
import { SapAzureOpenAi } from './azure-openai.js';

const deploymentUrl = `${aiCoreDestination.url}/v2/inference/deployments/dep-001`;

const defaultContext = {
  azureOptions: {
    baseURL: `${aiCoreDestination.url}/base`,
    apiVersion: '2024-10-21',
    azureADTokenProvider: async () => 'token'
  },
  destination: undefined,
  resourceGroup: 'default'
};

const mockedResult = {
  req: { headers: new Headers() } as RequestInit & { headers: Headers },
  url: 'https://mocked',
  timeout: 0
};

function makeClient() {
  return new SapAzureOpenAi(defaultContext);
}

describe('SapAzureOpenAi', () => {
  let superBuildRequest: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    superBuildRequest = jest
      .spyOn(AzureOpenAI.prototype, 'buildRequest')
      .mockResolvedValue(mockedResult as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    nock.cleanAll();
  });

  describe('buildRequest', () => {
    it('skips resolution when model is not defined', async () => {
      await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        headers: {},
        body: { messages: [] }
      });
      expect(superBuildRequest).toHaveBeenCalledWith(
        expect.objectContaining({ path: '/chat/completions' }),
        expect.anything()
      );
    });

    it('prepends the resolved deployment URL to the path', async () => {
      mockClientCredentialsGrantCall();
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        {
          id: 'dep-001',
          model: { name: 'gpt-4.1', version: 'latest' },
          deploymentUrl
        }
      );

      await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        headers: {},
        body: { model: 'gpt-4.1', messages: [] }
      });

      expect(superBuildRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          path: `${deploymentUrl}/chat/completions`
        }),
        expect.anything()
      );
    });
  });
});
