import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatCompletionResponse } from './azure-openai-chat-completion-response.js';
import { AzureOpenAiChatCompletionOutput } from './azure-openai-types.js';

describe('OpenAI chat completion response', () => {
  const mockResponse = parseMockResponse<AzureOpenAiChatCompletionOutput>(
    'foundation-models',
    'azure-openai-chat-completion-success-response.json'
  );
  const rawResponse = {
    data: mockResponse,
    status: 200,
    headers: {},
    request: {}
  };
  const response = new AzureOpenAiChatCompletionResponse(rawResponse);

  it('should return the completion response', () => {
    expect(response.data).toStrictEqual(mockResponse);
  });
});
