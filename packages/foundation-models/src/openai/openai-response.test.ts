import { parseMockResponse } from '../../../../test-util/mock-http';
import { OpenAiChatCompletionResponse } from './openai-response';
import { OpenAiChatCompletionOutput } from './openai-types';

describe('OpenAI response', () => {
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
  const openAiChatClientResponse = new OpenAiChatCompletionResponse(
    rawResponse
  );

  it('should initialize with raw response', () => {
    expect(openAiChatClientResponse.rawResponse).toBe(rawResponse);
  });

  it('should return the completion response', () => {
    expect(openAiChatClientResponse.data).toBe(mockResponse);
  });

  it('should get token usage', () => {
    expect(openAiChatClientResponse.getTokenUsage()).toMatchObject({
      completion_tokens: expect.any(Number),
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return default choice index with convenience functions', () => {
    expect(openAiChatClientResponse.getFinishReason()).toBe('stop');
    expect(openAiChatClientResponse.getContent()).toBe(
      "The deepest place on Earth is located in the western Pacific Ocean. It's called the Mariana Trench."
    );
  });

  it('should return undefined when convenience function is called with incorrect index', () => {
    expect(openAiChatClientResponse.getFinishReason(1)).toBeUndefined();
    expect(openAiChatClientResponse.getContent(1)).toBeUndefined();
  });
});
