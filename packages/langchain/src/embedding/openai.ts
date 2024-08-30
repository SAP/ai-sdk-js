import { BaseLLMParams } from '@langchain/core/language_models/llms';
import { OpenAIEmbeddingsParams, OpenAIEmbeddings } from '@langchain/openai';
import { OpenAiClient } from '@sap-ai-sdk/gen-ai-hub';
import { BTPBaseLLMParameters } from '../../client/base.js';
import { BTPOpenAIGPTEmbeddingParameters, BTPOpenAIGPTEmbeddingModel } from '../../client/openai.js';
import { chunkArray } from '../../core/utils.js';

/**
 * Input for Text generation for OpenAI GPT.
 */
export interface BTPOpenAIGPTEmbeddingInput
  extends Omit<OpenAIEmbeddingsParams, 'modelName'>,
    BTPBaseLLMParameters<BTPOpenAIGPTEmbeddingModel>,
    BaseLLMParams {}

/**
 * OpenAI GPT Language Model Wrapper to embed texts.
 */
export class BTPOpenAIGPTEmbedding extends OpenAIEmbeddings implements BTPOpenAIGPTEmbeddingInput {
  private btpOpenAIClient: OpenAiClient;

  deployment_id: BTPOpenAIGPTEmbeddingModel;

  constructor(fields?: Partial<BTPOpenAIGPTEmbeddingInput>) {
    super({ ...fields, openAIApiKey: 'dummy' });

    this.deployment_id = fields?.deployment_id ?? 'text-embedding-ada-002-v2';

    // LLM client
    this.btpOpenAIClient = new OpenAiClient();
  }

  override async embedDocuments(documents: string[]): Promise<number[][]> {
    const chunkedPrompts = chunkArray<string>(
      this.stripNewLines ? documents.map((t) => t.replace(/\n/g, ' ')) : documents,
      this.batchSize,
    );
    const embeddings: number[][] = [];
    for await (const promptChunk of chunkedPrompts) {
      const resArr = await this.createEmbedding(promptChunk);
      resArr.forEach((res) => embeddings.push(res.embedding));
    }
    return embeddings;
  }

  override async embedQuery(query: string): Promise<number[]> {
    const resArr = await this.createEmbedding(this.stripNewLines ? query.replace(/\n/g, ' ') : query);
    return resArr[0].embedding;
  }

  private async createEmbedding(query: BTPOpenAIGPTEmbeddingParameters['input']) {
    const res = await this.caller.callWithOptions({}, () =>
      this.btpOpenAIClient.embeddings(query, this.deployment_id),
    );
    return res.data;
  }
}

/**
 * @deprecated Use {@link BTPOpenAIGPTEmbedding} instead.
 */
export const BTPOpenAIEmbedding = BTPOpenAIGPTEmbedding;
