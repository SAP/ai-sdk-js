// mapResponseToChatResult
// mapLangchainToAiClient

import {
  OpenAiChatClient as OpenAiChatClientBase,
  OpenAiChatCompletionOutput
} from '@sap-ai-sdk/foundation-models';
import { jest } from '@jest/globals';
import nock from 'nock';
import { HumanMessage } from '@langchain/core/messages';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { mapResponseToChatResult } from './util.js';
import { OpenAiChatClient } from './chat.js';

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
      content: 'Where is the deepest place on earth located',
      tool_call_id: ''
    }
  ],
  max_tokens: 256,
  temperature: 0.7,
  top_p: 1,
  n: 1,
  presence_penalty: 0,
  frequency_penalty: 0
};

const langchainPrompt = new HumanMessage(
  'Where is the deepest place on earth located'
);

const request = {
  frequency_penalty: 0,
  functions: undefined,
  logit_bias: undefined,
  max_tokens: 256,
  messages: [
    {
      content: 'Where is the deepest place on earth located',
      function_call: undefined,
      name: undefined,
      role: 'user',
      tool_call_id: '',
      tool_calls: undefined
    }
  ],
  n: 1,
  presence_penalty: 0,
  response_format: undefined,
  seed: undefined,
  stop: undefined,
  temperature: 0.7,
  tool_choice: undefined,
  tools: undefined,
  top_p: 1
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
    await client.generate([[langchainPrompt]]);
    expect(runSpy).toHaveBeenCalledWith(request);
  });
});
