// mapResponseToChatResult
// mapLangchainToAiClient

import { OpenAiChatCompletionOutput } from '@sap-ai-sdk/foundation-models';
import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { mapResponseToChatResult } from './util.js';

describe('Mapping Functions', () => {
    const openAiMockResponse = parseMockResponse<OpenAiChatCompletionOutput>(
        'foundation-models',
        'openai-chat-completion-success-response.json'
    );
    it('should parse an OpenAi response to a (Langchain) chat response', async () => {
      const result = mapResponseToChatResult(openAiMockResponse);
      expect(result).toMatchInlineSnapshot();
    });

    // it('should compute an embedding vector', async () => {
    //   const result = await embedQuery();
    //   expect(result).toBeDefined();
    //   expect(result).not.toHaveLength(0);
    // });
  });
