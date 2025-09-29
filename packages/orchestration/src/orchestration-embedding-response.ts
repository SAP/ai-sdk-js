import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type {
  EmbeddingsPostResponse,
  EmbeddingResult,
  EmbeddingsUsage,
  ModuleResultsBase
} from './client/api/schema/index.js';
import type {
  EmbeddingData,
  EmbeddingUsageInfo
} from './orchestration-types.js';

/**
 * Response wrapper for orchestration embedding requests.
 */
export class OrchestrationEmbeddingResponse {
  private _data: EmbeddingsPostResponse;

  constructor(private response: HttpResponse) {
    this._data = response.data;
  }

  /**
   * Request ID for the embedding operation.
   * @returns The request ID string.
   */
  get requestId(): string {
    return this._data.request_id;
  }

  /**
   * Final embedding results.
   * @returns Array of embedding data or undefined if no results.
   */
  get embeddings(): EmbeddingData[] | undefined {
    if (!this._data.final_result?.data) {
      return undefined;
    }

    return this._data.final_result.data.map((result: EmbeddingResult) => ({
      embedding: result.embedding,
      index: result.index
    }));
  }

  /**
   * Model used for generating embeddings.
   * @returns The model name or undefined.
   */
  get model(): string | undefined {
    return this._data.final_result?.model;
  }

  /**
   * Usage information.
   * @returns Usage information or undefined.
   */
  get usage(): EmbeddingUsageInfo | undefined {
    if (!this._data.final_result?.usage) {
      return undefined;
    }

    const usage: EmbeddingsUsage = this._data.final_result.usage;
    return {
      promptTokens: usage.prompt_tokens,
      totalTokens: usage.total_tokens
    };
  }

  /**
   * Intermediate results from orchestration modules.
   * @returns Intermediate results or undefined.
   */
  get intermediateResults(): ModuleResultsBase | undefined {
    return this._data.intermediate_results;
  }

  /**
   * Raw response data.
   * @returns The raw embeddings post response data.
   */
  get data(): EmbeddingsPostResponse {
    return this._data;
  }

  /**
   * Raw HTTP response.
   * @returns The raw HTTP response object.
   */
  get httpResponse(): HttpResponse {
    return this.response;
  }
}
