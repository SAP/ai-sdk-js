import { AzureOpenAiEmbeddingClient as AzureOpenAiEmbeddingClientBase } from '@sap-ai-sdk/foundation-models';
import { Embeddings } from '@langchain/core/embeddings';
import type {
  AzureOpenAiEmbeddingModel,
  AzureOpenAiEmbeddingParameters,
  AzureOpenAiEmbeddingResponse
} from '@sap-ai-sdk/foundation-models';
import type { AzureOpenAiEmbeddingModelParams } from './types.js';

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

  /**
   * Embed a list of document chunks. All chunks are embedded in one batch.
   * @param documents - Document chunks to embed.
   * @returns Embeddings.
   */
  override async embedDocuments(documents: string[]): Promise<number[][]> {
    return (await this.createEmbeddings({ input: documents })).getEmbeddings();
  }

  /**
   * Embed a single string.
   * @param input - Input string to embed.
   * @returns Embedding.
   */
  override async embedQuery(input: string): Promise<number[]> {
    return (await this.createEmbeddings({ input })).getEmbedding() ?? [];
  }

  private async createEmbeddings(
    query: AzureOpenAiEmbeddingParameters
  ): Promise<AzureOpenAiEmbeddingResponse> {
    return this.caller.callWithOptions({}, async () =>
      this.openAiEmbeddingClient.run(query)
    );
  }
}
