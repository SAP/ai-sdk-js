import {
  OpenAiEmbeddingClient as OpenAiEmbeddingClientBase,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from '@sap-ai-sdk/foundation-models';
import { Embeddings } from '@langchain/core/embeddings';
import { OpenAiEmbeddingInput } from './types.js';

/**
 * OpenAI GPT Language Model Wrapper to embed texts.
 */
export class AzureOpenAiEmbeddingClient extends Embeddings {
  private openAiEmbeddingClient: OpenAiEmbeddingClientBase;

  constructor(fields: OpenAiEmbeddingInput) {
    super(fields);

    this.openAiEmbeddingClient = new OpenAiEmbeddingClientBase(fields);
  }

  override async embedDocuments(documents: string[]): Promise<number[][]> {
    return Promise.all(
      documents
        .map(async document => (await this.createEmbedding({ input: document })).data
          .map(embeddingResponse => embeddingResponse.embedding)
          .flat()
        )
    );
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
