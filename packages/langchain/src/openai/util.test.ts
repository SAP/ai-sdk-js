// mapResponseToChatResult
// mapLangchainToAiClient

import { OpenAiChatCompletionOutput , OpenAiChatClient as OpenAiChatClientBase, OpenAiEmbeddingParameters } from '@sap-ai-sdk/foundation-models';
import { jest } from '@jest/globals';
import nock from 'nock';
import { mockClientCredentialsGrantCall, mockInference, parseMockResponse } from '../../../../test-util/mock-http.js';
import { mapResponseToChatResult } from './util.js';
import { OpenAiChatClient } from './chat.js';

describe('Mapping Functions', () => {
  const openAiMockResponse = parseMockResponse<OpenAiChatCompletionOutput>(
    'foundation-models',
    'openai-chat-completion-success-response.json'
  );

  const chatCompletionEndpoint = {
    url: 'inference/deployments/1234/chat/completions',
    apiVersion: '2024-02-01'
  };

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
    const prompt = {
      input: ['AI is fascinating']
    } as OpenAiEmbeddingParameters;

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

    const client = new OpenAiChatClient({ deploymentId: '1234' });
    const runSpy = jest.spyOn(OpenAiChatClientBase.prototype, 'run');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await client.invoke('Test');
    expect(runSpy).toHaveBeenCalled();
  });
});
