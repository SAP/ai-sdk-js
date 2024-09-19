import { AzureOpenAiChatCompletionOutput, AzureOpenAiChatCompletionParameters } from '@sap-ai-sdk/foundation-models';
import nock from 'nock';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import {
  mockClientCredentialsGrantCall,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { mapLangchainToAiClient, mapOutputToChatResult } from './util.js';
import { AzureOpenAiChatClient } from './chat.js';

const openAiMockResponse = parseMockResponse<AzureOpenAiChatCompletionOutput>(
  'foundation-models',
  'azure-openai-chat-completion-success-response.json'
);

describe('Mapping Functions', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should parse an OpenAI response to a (LangChain) chat response', async () => {
    const result = mapOutputToChatResult(openAiMockResponse);
    expect(result).toMatchSnapshot();
  });

  it('should parse a LangChain input to an AI SDK input', async () => {
    const langchainPrompt: BaseMessage[] = [
      new HumanMessage('Where is the deepest place on earth located')
    ];

    const request: AzureOpenAiChatCompletionParameters = {
      messages: [
        {
          role: 'user',
          content: 'Where is the deepest place on earth located'
        }
      ]
    };
    const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });
    const defaultOptions = { signal: undefined, promptIndex: 0 };
    const mapping = mapLangchainToAiClient(
      client,
      defaultOptions,
      langchainPrompt
    );
    expect(mapping).toMatchObject(request);
  });
});
