import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type {
  EmbeddingsPostResponse,
  EmbeddingResult,
  EmbeddingsUsage,
  ModuleResultsBase
} from './client/api/schema/index.js';
import type { EmbeddingData } from './orchestration-types.js';

/**
 * Response wrapper for orchestration embedding requests.
 */
export class OrchestrationEmbeddingResponse {
  public readonly _data: EmbeddingsPostResponse;

  constructor(public readonly response: HttpResponse) {
    this._data = response.data;
  }

  /**
   * Final embedding results with index and object type (which is always `embedding`) information.
   * @returns Array of embedding data objects containing both vectors, indices, and object types.
   */
  getEmbeddings(): EmbeddingData[] {
    // TODO: Remove non-null assertion when final_result is made mandatory in the schema
    return this._data.final_result.data.map((result: EmbeddingResult) => ({
      embedding: result.embedding,
      index: result.index,
      object: 'embedding'
    }));
  }
  /**
   * Usage information.
   * @returns Usage information or undefined.
   */
  getTokenUsage(): EmbeddingsUsage {
    return this._data.final_result.usage;
  }

  /**
   * Intermediate results from orchestration modules.
   * @returns Intermediate results or undefined.
   */
  getIntermediateResults(): ModuleResultsBase | undefined {
    return this._data.intermediate_results;
  }
}
