import { HttpResponse } from '@sap-cloud-sdk/http-client';
import { parseHttpResponse } from '@sap-ai-sdk/core';
import { createLogger } from '@sap-cloud-sdk/util';
import { OpenAiEmbeddingOutput } from './openai-types.js';

const logger = createLogger({
  package: 'gen-ai-hub',
  messageContext: 'openai-embedding-response'
});

/**
 * OpenAI embedding response.
 */
export class OpenAiEmbeddingResponse {
  /**
   * The embedding response.
   */
  public readonly data: OpenAiEmbeddingOutput;
  constructor(
    public readonly rawResponse: HttpResponse,
    zodSchema: any
  ) {
    this.data = parseHttpResponse<OpenAiEmbeddingOutput>(
      rawResponse,
      zodSchema
    );
  }

  /**
   * Parses the Open AI response and returns the embedding.
   * @param dataIndex - The index of the data to parse.
   * @returns The message content.
   */
  getEmbedding(dataIndex = 0): number[] | undefined {
    this.logInvalidDataIndex(dataIndex);
    return this.data.data[0]?.embedding;
  }

  private logInvalidDataIndex(dataIndex: number): void {
    if (dataIndex < 0 || dataIndex >= this.data.data.length) {
      logger.error(`Data index ${dataIndex} is out of bounds.`);
    }
  }
}
