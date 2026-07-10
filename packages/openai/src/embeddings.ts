import { Embeddings } from 'openai/resources/embeddings';
import type { AzureOpenAiEmbeddingModel } from '@sap-ai-sdk/core';
import type { OpenAI } from 'openai';
import type {
  EmbeddingCreateParams,
  CreateEmbeddingResponse
} from 'openai/resources/embeddings';
import type { APIPromise } from 'openai/api-promise';
import type { WithOptionalModel } from './types.js';

type RequestOptions = Parameters<Embeddings['create']>[1];

/**
 * Wraps `Embeddings` exposing only `create`, with `model` omitted from the public API as SAP AI Core routes requests via the deployment URL.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapEmbeddings {
  private readonly openAiEmbeddings: Embeddings;

  /** @internal */
  constructor(client: OpenAI) {
    this.openAiEmbeddings = new Embeddings(client);
  }

  /**
   * Creates an embedding request. The `model` field is omitted — SAP AI Core routes requests via the deployment URL.
   * @param body - Embedding request parameters, without `model`.
   * @param options - Optional request options.
   * @returns A promise resolving to a {@link CreateEmbeddingResponse}.
   */
  create(
    body: WithOptionalModel<EmbeddingCreateParams, AzureOpenAiEmbeddingModel>,
    options?: RequestOptions
  ): APIPromise<CreateEmbeddingResponse> {
    return this.openAiEmbeddings.create(
      // SAP AI Core routes via deployment URL; model is required by the OpenAI SDK type but ignored by the API
      { ...body, model: body.model || '' } satisfies EmbeddingCreateParams,
      options
    );
  }
}
