import { AzureOpenAIEmbeddings } from '@langchain/openai';
import {
  OpenAiEmbeddingClient as OpenAiEmbeddingClientBase,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from '@sap-ai-sdk/foundation-models';
import { chunkArray } from './util.js';
import { OpenAiEmbeddingInput } from './types.js';

/**
 * OpenAI GPT Language Model Wrapper to embed texts.
 */
export class OpenAiEmbeddingClient extends AzureOpenAIEmbeddings {
  private btpOpenAIClient: OpenAiEmbeddingClientBase;

  constructor(fields: OpenAiEmbeddingInput) {
    // overrides the apikey value as it is not applicable in BTP
    super({ ...fields, apiKey: 'dummy', azureOpenAIApiKey: undefined });

    this.btpOpenAIClient = new OpenAiEmbeddingClientBase({ ...fields });
  }

  override async embedDocuments(documents: string[]): Promise<number[][]> {
    const chunkedPrompts = chunkArray(
      this.stripNewLines
        ? documents.map(t => t.replace(/\n/g, ' '))
        : documents,
      this.batchSize
    );
    const embeddings: number[][] = [];
    for await (const promptChunk of chunkedPrompts) {
      const resArr = await this.createEmbedding({ input: promptChunk });
      resArr.data.forEach(res => embeddings.push(res.embedding));
    }
    return embeddings;
  }

  override async embedQuery(query: string): Promise<number[]> {
    const resArr = await this.createEmbedding({
      input: this.stripNewLines ? query.replace(/\n/g, ' ') : query
    });
    return resArr.data[0].embedding;
  }

  private async createEmbedding(
    query: OpenAiEmbeddingParameters
  ): Promise<OpenAiEmbeddingOutput> {
    const res = await this.caller.callWithOptions({}, () =>
      this.btpOpenAIClient.run(query)
    );
    return res;
  }
}
