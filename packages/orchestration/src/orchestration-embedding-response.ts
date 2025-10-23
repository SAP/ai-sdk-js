import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type {
  EmbeddingsPostResponse,
  EmbeddingResult,
  EmbeddingsUsage,
  ModuleResultsBase
} from './client/api/schema/index.js';

/**
 * Response wrapper for orchestration embedding requests.
 */
export class OrchestrationEmbeddingResponse {
  public readonly _data: EmbeddingsPostResponse;

  constructor(public readonly response: HttpResponse) {
    this._data = response.data;
  }

  /**
   * Final embedding results.
   * @returns Array of embedding vectors, where each element is either a number array or a base-64 encoded string of the embedding.
   */
  getEmbeddingVectors(): (number[] | string)[] {
    return this._data.final_result!.data.map(
      (result: EmbeddingResult) => result.embedding
    );
  }

  /**
   * Usage information.
   * @returns Usage information or undefined.
   */
  getTokenUsage(): EmbeddingsUsage {
    return this._data.final_result!.usage;
  }

  /**
   * Intermediate results from orchestration modules.
   * @returns Intermediate results or undefined.
   */
  getIntermediateResults(): ModuleResultsBase | undefined {
    return this._data.intermediate_results;
  }
}
