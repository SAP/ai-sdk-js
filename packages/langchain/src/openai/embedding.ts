import {
  OpenAiEmbeddingClient as OpenAiEmbeddingClientBase,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
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

  private openAiEmbeddingClient: OpenAiEmbeddingClientBase;

  constructor(fields: OpenAiEmbeddingModelParams) {
    super(fields);
    this.openAiEmbeddingClient = new OpenAiEmbeddingClientBase(fields);
    this.modelName = fields.modelName;
    this.modelVersion = fields.modelVersion;
    this.resourceGroup = fields.resourceGroup;
  }

  override async embedDocuments(documents: string[]): Promise<number[][]> {
    const documentEmbeddings = await Promise.all(
      documents.map(document => this.createEmbedding({ input: document }))
    );
    return documentEmbeddings
      .map(embedding => embedding.data.map(entry => entry.embedding))
      .flat();
  }

  override async embedQuery(input: string): Promise<number[]> {
    const embeddingResponse = await this.createEmbedding({ input });
    return embeddingResponse.data[0].embedding;
  }

  private async createEmbedding(
    query: OpenAiEmbeddingParameters
  ): Promise<OpenAiEmbeddingOutput> {
    return this.caller.callWithOptions({}, () =>
      this.openAiEmbeddingClient.run(query)
    );
  }
}
