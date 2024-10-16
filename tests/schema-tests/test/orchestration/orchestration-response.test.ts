import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { completionPostResponseSchema } from './ts-to-zod/completion-post-response.zod.js';

describe('Orchestration chat completion response', () => {
  it('should parse the chat completion success response', async () => {
    const mockResponse = await parseMockResponse<any>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    completionPostResponseSchema.parse(mockResponse);
  });

  it('should parse the chat completion message history response', async () => {
    const mockResponse = await parseMockResponse<any>(
      'orchestration',
      'orchestration-chat-completion-message-history.json'
    );
    completionPostResponseSchema.parse(mockResponse);
  });

  it('should parse the chat completion filter config response', async () => {
    const mockResponse = await parseMockResponse<any>(
      'orchestration',
      'orchestration-chat-completion-filter-config.json'
    );
    completionPostResponseSchema.parse(mockResponse);
  });
});
