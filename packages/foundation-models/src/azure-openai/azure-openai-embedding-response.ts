import { HttpResponse } from '@sap-cloud-sdk/http-client';
import { createLogger } from '@sap-cloud-sdk/util';
import { AzureOpenAiEmbeddingOutput } from './azure-openai-types.js';
import { azureOpenAiEmbeddingOutputSchema } from './azure-openai-types-schema.js';

const logger = createLogger({
  package: 'gen-ai-hub',
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
    this.data = azureOpenAiEmbeddingOutputSchema.parse(rawResponse.data);
  }

  /**
   * Parses the Azure OpenAI response and returns the embedding.
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
