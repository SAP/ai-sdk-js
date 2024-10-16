import { parseMockResponse } from '../../../../../test-util/mock-http.js';
import { azureOpenAiCreateChatCompletionResponseSchema } from './ts-to-zod/create-chat-completion-response.zod.js';

describe('Azure OpenAI chat completion response', () => {
  it('should parse the mock response with the generated schema', async () => {
    const mockResponse = await parseMockResponse<any>(
      'foundation-models',
      'azure-openai-chat-completion-success-response.json'
    );
    azureOpenAiCreateChatCompletionResponseSchema.parse(mockResponse);
  });
});
