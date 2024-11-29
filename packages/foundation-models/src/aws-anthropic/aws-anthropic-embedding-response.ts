import { createLogger } from '@sap-cloud-sdk/util';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AwsAnthropicEmbeddingOutput } from './aws-anthropic-embedding-types.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'aws-anthropic-embedding-response'
});

/**
 * AWS Anthropic embedding response.
 */
export class AwsAnthropicEmbeddingResponse {
  /**
   * The embedding response.
   */
  public readonly data: AwsAnthropicEmbeddingOutput;

  constructor(public readonly rawResponse: HttpResponse) {
    this.data = rawResponse.data;
  }

  /**
   * Parses the AWS Anthropic response and returns the embedding.
   * @param dataIndex - The index of the data to parse.
   * @returns The embedding vector.
   */
  getEmbedding(dataIndex = 0): number[] | undefined {
    this.logInvalidDataIndex(dataIndex);
    return this.data.embedding;
  }

  private logInvalidDataIndex(dataIndex: number): void {
    if (dataIndex < 0 || dataIndex >= this.data.embedding.length) {
      logger.error(`Data index ${dataIndex} is out of bounds.`);
    }
  }
}
