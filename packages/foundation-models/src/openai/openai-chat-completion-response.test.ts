import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { OpenAiChatCompletionResponse } from './openai-chat-completion-response.js';
import { OpenAiChatCompletionOutput } from './openai-types.js';
import { openAiChatCompletionOutputSchema } from './openai-types-schema.js';

describe('OpenAI chat completion response', () => {
  const mockResponse = parseMockResponse<OpenAiChatCompletionOutput>(
    'foundation-models',
    'openai-chat-completion-success-response.json'
  );
  const rawResponse = {
    data: mockResponse,
    status: 200,
    headers: {},
    request: {}
  };
  const response = new OpenAiChatCompletionResponse(
    rawResponse,
    openAiChatCompletionOutputSchema
  );

  it('should return the completion response', () => {
    expect(response.data).toStrictEqual(mockResponse);
  });
});
