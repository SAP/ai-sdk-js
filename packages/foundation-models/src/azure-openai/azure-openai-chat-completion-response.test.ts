import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatCompletionResponse } from './azure-openai-chat-completion-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';

describe('OpenAI chat completion response', () => {
  let mockResponse: AzureOpenAiCreateChatCompletionResponse;
  let rawResponse: HttpResponse;
  let azureOpenAiChatResponse: AzureOpenAiChatCompletionResponse;

  beforeAll(async () => {
    mockResponse =
      await parseMockResponse<AzureOpenAiCreateChatCompletionResponse>(
        'foundation-models',
        'azure-openai-chat-completion-success-response.json'
      );
    rawResponse = {
      data: mockResponse,
      status: 200,
      headers: {},
      request: {}
    };
    azureOpenAiChatResponse = new AzureOpenAiChatCompletionResponse(
      rawResponse
    );
  });

  it('should return the chat completion response', () => {
    expect(azureOpenAiChatResponse.data).toStrictEqual(mockResponse);
  });

  it('should return raw response', () => {
    expect(azureOpenAiChatResponse.rawResponse).toBe(rawResponse);
  });

  it('should get token usage', () => {
    expect(azureOpenAiChatResponse.getTokenUsage()).toMatchObject({
      completion_tokens: expect.any(Number),
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return default choice index with convenience functions', () => {
    expect(azureOpenAiChatResponse.getFinishReason()).toBe('stop');
    expect(azureOpenAiChatResponse.getContent()).toBe(
      "Hello! I'm just a computer program, so I don't have feelings, but thanks for asking. How can I assist you today?"
    );
  });

  it('should return undefined when convenience function is called with incorrect index', () => {
    expect(azureOpenAiChatResponse.getFinishReason(1)).toBeUndefined();
    expect(azureOpenAiChatResponse.getContent(1)).toBeUndefined();
  });
});
