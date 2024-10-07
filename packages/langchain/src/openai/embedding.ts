import {
  AzureOpenAiEmbeddingClient as AzureOpenAiEmbeddingClientBase,
  AzureOpenAiEmbeddingModel,
  AzureOpenAiEmbeddingParameters
} from '@sap-ai-sdk/foundation-models';
import { Embeddings } from '@langchain/core/embeddings';
import { AzureOpenAiEmbeddingModelParams } from './types.js';

/**
 * LangChain embedding client for Azure OpenAI consumption on SAP BTP.
 */
export class AzureOpenAiEmbeddingClient extends Embeddings {
  modelName: AzureOpenAiEmbeddingModel;
  modelVersion?: string;
  resourceGroup?: string;

  private openAiEmbeddingClient: AzureOpenAiEmbeddingClientBase;

  constructor(fields: AzureOpenAiEmbeddingModelParams) {
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
