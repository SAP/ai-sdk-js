import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatCompletionResponse } from './azure-openai-chat-completion-response.js';
import { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';
import { azureOpenAiCreateChatCompletionResponseSchema } from './ts-to-zod/create-chat-completion-response.zod.js';

describe('OpenAI chat completion response', () => {
  const mockResponse =
    parseMockResponse<AzureOpenAiCreateChatCompletionResponse>(
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
    const data = azureOpenAiCreateChatCompletionResponseSchema.parse(response.data);
    expect(data).toStrictEqual(mockResponse);
  });
});
