import { AzureOpenAIEmbeddings } from '@langchain/openai';
import {
  OpenAiEmbeddingClient as OpenAiEmbeddingClientBase,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from '@sap-ai-sdk/foundation-models';
import { splitInChunks } from '@sap-cloud-sdk/util';
import { OpenAiEmbeddingInput } from './types.js';

/**
 * OpenAI GPT Language Model Wrapper to embed texts.
 */
export class AzureOpenAiEmbeddingClient extends AzureOpenAIEmbeddings {
  private btpOpenAiClient: OpenAiEmbeddingClientBase;

  constructor(fields: OpenAiEmbeddingInput) {
    // overrides the apikey value as it is not applicable in BTP
    super({ ...fields, apiKey: 'dummy', azureOpenAIApiKey: undefined });

    this.btpOpenAiClient = new OpenAiEmbeddingClientBase({ ...fields });
  }

  override async embedDocuments(documents: string[]): Promise<number[][]> {
    const chunkedPrompts = splitInChunks<string>(
      this.stripNewLines
        ? documents.map(t => t.replace(/\n/g, ' '))
        : documents,
      this.batchSize
    );
    const embeddings: number[][] = [];
    for await (const promptChunk of chunkedPrompts) {
      const embeddingResponse = await this.createEmbedding({
        input: promptChunk
      });
      embeddingResponse.data.forEach(entry => embeddings.push(entry.embedding));
    }
    return embeddings;
  }

  override async embedQuery(query: string): Promise<number[]> {
    const embeddingResponse = await this.createEmbedding({
      input: this.stripNewLines ? query.replace(/\n/g, ' ') : query
    });
    return embeddingResponse.data[0].embedding;
  }

  private async createEmbedding(
    query: OpenAiEmbeddingParameters
  ): Promise<OpenAiEmbeddingOutput> {
    return this.caller.callWithOptions({}, () =>
      this.btpOpenAiClient.run(query)
    );
  }
}
