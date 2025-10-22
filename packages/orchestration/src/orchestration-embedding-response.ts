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
   * Final embedding results.
   * @returns Array of embedding data or undefined if no results.
   */
  getEmbeddings(): EmbeddingData[] {
    return this._data.final_result!.data.map((result: EmbeddingResult) => ({
      embedding: result.embedding,
      index: result.index
    }));
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
