import { Embeddings } from 'openai/resources/embeddings';
import type { OpenAI } from 'openai';
import type {
  EmbeddingCreateParams,
  CreateEmbeddingResponse
} from 'openai/resources/embeddings';
import type { APIPromise } from 'openai/api-promise';
import type { WithoutModel } from './completions.js';

type RequestOptions = Parameters<Embeddings['create']>[1];

/** Wraps `Embeddings` exposing only `create`, with `model` omitted from the public API as SAP AI Core routes requests via the deployment URL.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapEmbeddings {
  private readonly openAIEmbeddings: Embeddings;

  constructor(client: OpenAI) {
    this.openAIEmbeddings = new Embeddings(client);
  }

  create(
    body: WithoutModel<EmbeddingCreateParams>,
    options?: RequestOptions
  ): APIPromise<CreateEmbeddingResponse> {
    return this.openAIEmbeddings.create(
      // SAP AI Core routes via deployment URL; model is required by the SDK type but ignored by the API
      { model: '', ...body } satisfies EmbeddingCreateParams,
      options
    );
  }
}
