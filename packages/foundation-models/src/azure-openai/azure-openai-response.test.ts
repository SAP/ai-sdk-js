import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatCompletionResponse } from './azure-openai-response.js';
import { AzureOpenAiChatCompletionOutput } from './azure-openai-types.js';

describe('Azure OpenAI response', () => {
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
  const azureOpenAiChatClientResponse = new AzureOpenAiChatCompletionResponse(
    rawResponse
  );

  it('should initialize with raw response', () => {
    expect(azureOpenAiChatClientResponse.rawResponse).toBe(rawResponse);
  });

  it('should return the completion response', () => {
    expect(azureOpenAiChatClientResponse.data).toBe(mockResponse);
  });

  it('should get token usage', () => {
    expect(azureOpenAiChatClientResponse.getTokenUsage()).toMatchObject({
      completion_tokens: expect.any(Number),
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return default choice index with convenience functions', () => {
    expect(azureOpenAiChatClientResponse.getFinishReason()).toBe('stop');
    expect(azureOpenAiChatClientResponse.getContent()).toBe(
      'The deepest place on Earth is located in the Western Pacific Ocean and is known as the Mariana Trench.'
    );
  });

  it('should return undefined when convenience function is called with incorrect index', () => {
    expect(azureOpenAiChatClientResponse.getFinishReason(1)).toBeUndefined();
    expect(azureOpenAiChatClientResponse.getContent(1)).toBeUndefined();
  });
});
