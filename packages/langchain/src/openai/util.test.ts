import {
  AzureOpenAiChatClient as AzureOpenAiChatClientBase,
  OpenAiChatCompletionOutput
} from '@sap-ai-sdk/foundation-models';
import { jest } from '@jest/globals';
import nock from 'nock';
import { HumanMessage } from '@langchain/core/messages';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { mapResponseToChatResult } from './util.js';
import { AzureOpenAiChatClient } from './chat.js';

const openAiMockResponse = parseMockResponse<OpenAiChatCompletionOutput>(
  'foundation-models',
  'openai-chat-completion-success-response.json'
);

const chatCompletionEndpoint = {
  url: 'inference/deployments/1234/chat/completions',
  apiVersion: '2024-02-01'
};

const prompt = {
  messages: [
    {
      role: 'user',
      content: 'Where is the deepest place on earth located'
    }
  ]
};

const langchainPrompt = new HumanMessage(
  'Where is the deepest place on earth located'
);

const request = {
  messages: [
    {
      role: 'user',
      content: 'Where is the deepest place on earth located'
    }
  ]
};

describe('Mapping Functions', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should parse an OpenAi response to a (Langchain) chat response', async () => {
    const result = mapResponseToChatResult(openAiMockResponse);
    expect(result).toMatchSnapshot();
  });

  it('should parse a Langchain input to an ai sdk input', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'azure-openai' },
      { id: '1234', model: { name: 'gpt-35-turbo' } }
    );

    mockInference(
      {
        data: prompt
      },
      {
        data: openAiMockResponse,
        status: 200
      },
      chatCompletionEndpoint
    );

    const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });
    const runSpy = jest.spyOn(AzureOpenAiChatClientBase.prototype, 'run');
    await client.generate([[langchainPrompt]]);
    expect(runSpy).toHaveBeenCalledWith(request, undefined);
  });
});
