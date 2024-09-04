import { BaseLLMParams } from '@langchain/core/language_models/llms';
import { OpenAIEmbeddingsParams, OpenAIEmbeddings } from '@langchain/openai';
import {
  OpenAiClient,
  OpenAiEmbeddingModel,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from '@sap-ai-sdk/gen-ai-hub';
import { chunkArray } from '../util/index.js';

/**
 * Input for Text generation for OpenAI GPT.
 */
export interface OpenAIEmbeddingInput
  extends Omit<OpenAIEmbeddingsParams, 'modelName'>,
    BaseLLMParams {
  /**
   * The name of the model.
   */
  modelName: OpenAiEmbeddingModel;
  /**
   * The name of the model. Alias for `modelName`.
   */
  model: OpenAiEmbeddingModel;
  /**
   * The version of the model.
   */
  modelVersion?: string;
}

/**
 * OpenAI GPT Language Model Wrapper to embed texts.
 */
export class OpenAIEmbedding
  extends OpenAIEmbeddings
  implements OpenAIEmbeddingInput
{
  modelName: OpenAiEmbeddingModel;
  model: OpenAiEmbeddingModel;

  private btpOpenAIClient: OpenAiClient;

  constructor(fields: OpenAIEmbeddingInput) {
    super({ ...fields, openAIApiKey: 'dummy' });

    this.btpOpenAIClient = new OpenAiClient();
    this.model = fields.model;
    this.modelName = fields.modelName;
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
      this.btpOpenAIClient.embeddings(query, this.model)
    );
    return res;
  }
}
