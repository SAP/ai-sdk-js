import {
  AzureOpenAiEmbeddingClient as AzureOpenAiEmbeddingClientBase,
  AzureOpenAiEmbeddingParameters
} from '@sap-ai-sdk/foundation-models';
import { Embeddings } from '@langchain/core/embeddings';
import { AzureOpenAiChatModel } from '@sap-ai-sdk/core';
import { OpenAiEmbeddingModelParams } from './types.js';

/**
 * OpenAI GPT Embedding Model Wrapper to embed texts.
 */
export class AzureOpenAiEmbeddingClient
  extends Embeddings
  implements OpenAiEmbeddingModelParams
{
  modelName: AzureOpenAiChatModel;
  modelVersion?: string;
  resourceGroup?: string;

  private openAiEmbeddingClient: AzureOpenAiEmbeddingClientBase;

  constructor(fields: OpenAiEmbeddingModelParams) {
    super(fields);
    this.openAiEmbeddingClient = new AzureOpenAiEmbeddingClientBase(fields);
    this.modelName = fields.modelName;
    this.modelVersion = fields.modelVersion;
    this.resourceGroup = fields.resourceGroup;
  }

  override async embedDocuments(documents: string[]): Promise<number[][]> {
    return Promise.all(
      documents.map(document => this.createEmbedding({ input: document }))
    );
  }

  override async embedQuery(input: string): Promise<number[]> {
    return this.createEmbedding({ input });
  }

  private async createEmbedding(
    query: AzureOpenAiEmbeddingParameters
  ): Promise<number[]> {
    return this.caller.callWithOptions(
      {},
      async () =>
        (await this.openAiEmbeddingClient.run(query)).getEmbedding() ?? []
    );
  }
}
