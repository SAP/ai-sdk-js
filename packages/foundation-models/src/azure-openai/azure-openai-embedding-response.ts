import { createLogger } from '@sap-cloud-sdk/util';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiEmbeddingOutput } from './azure-openai-embedding-types.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-embedding-response'
});

/**
 * Azure OpenAI embedding response.
 */
export class AzureOpenAiEmbeddingResponse {
  /**
   * The embedding response.
   */
  public readonly data: AzureOpenAiEmbeddingOutput;

  constructor(public readonly rawResponse: HttpResponse) {
    this.data = rawResponse.data;
  }

  /**
   * Parses the Azure OpenAI response and returns the embedding.
   * @param dataIndex - The index of the data to parse.
   * @returns The embedding vector.
   */
  getEmbedding(dataIndex = 0): number[] | undefined {
    this.logInvalidDataIndex(dataIndex);
    return this.data.data[dataIndex]?.embedding;
  }

  /**
   * Parses the Azure OpenAI response and returns all embeddings.
   * @returns The embedding vectors.
   */
  getEmbeddings(): number[][] {
    return this.data.data.map(({ embedding }) => embedding);
  }

  private logInvalidDataIndex(dataIndex: number): void {
    if (dataIndex < 0 || dataIndex >= this.data.data.length) {
      logger.error(`Data index ${dataIndex} is out of bounds.`);
    }
  }
}
