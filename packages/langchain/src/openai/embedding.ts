import { AzureOpenAIEmbeddings } from '@langchain/openai';
import {
  OpenAiEmbeddingClient,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from '@sap-ai-sdk/foundation-models';
import { chunkArray } from './util.js';
import { OpenAIEmbeddingInput } from './types.js';

/**
 * OpenAI GPT Language Model Wrapper to embed texts.
 */
export class OpenAIEmbedding extends AzureOpenAIEmbeddings {
  private btpOpenAIClient: OpenAiEmbeddingClient;

  constructor(fields: OpenAIEmbeddingInput) {
    // overrides the apikey value as it is not applicable in BTP
    super({ ...fields, azureOpenAIApiKey: 'dummy' });

    this.btpOpenAIClient = new OpenAiEmbeddingClient({ ...fields });
  }

  override async embedDocuments(documents: string[]): Promise<number[][]> {
    const chunkedPrompts = chunkArray<string>(
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
