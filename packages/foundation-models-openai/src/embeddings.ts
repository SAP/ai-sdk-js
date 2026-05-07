import { Embeddings } from 'openai/resources/embeddings';
import type { OpenAI } from 'openai';
import type {
  EmbeddingCreateParams,
  CreateEmbeddingResponse
} from 'openai/resources/embeddings';
import type { APIPromise } from 'openai/api-promise';
import type { WithoutModel } from './completions.js';

type RequestOptions = Parameters<Embeddings['create']>[1];

/** Subclass of `Embeddings` exposing only `create`, with `model` pre-filled. */
export class SapEmbeddings extends Embeddings {
  private readonly defaultModel: string | undefined;

  constructor(client: OpenAI, defaultModel?: string) {
    super(client);
    this.defaultModel = defaultModel;
  }

  override create(
    body: WithoutModel<EmbeddingCreateParams>,
    options?: RequestOptions
  ): APIPromise<CreateEmbeddingResponse> {
    return super.create(
      { model: this.defaultModel ?? '', ...body } as EmbeddingCreateParams,
      options
    );
  }
}
