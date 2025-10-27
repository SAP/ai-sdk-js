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
   * Final embedding results with index information.
   * @returns Array of embedding data objects containing both vectors and indices.
   */
  getEmbeddings(): EmbeddingData[] {
    // TODO: Remove non-null assertion when final_result is made mandatory in the schema
    return this._data.final_result!.data.map((result: EmbeddingResult) => ({
      embedding: result.embedding,
      index: result.index
    }));
  }

  /**
   * Final embedding results as number arrays only.
   * @returns Array of embedding vectors as number arrays.
   * @throws Error if embedding is a string (base64-encoded).
   */
  getEmbeddingVectors(): number[][] {
    // TODO: Remove non-null assertion when final_result is made mandatory in the schema
    return this._data.final_result!.data.map((result: EmbeddingResult) => {
      if (typeof result.embedding === 'string') {
        throw new Error(
          'String embeddings are not supported in getEmbeddingVectors(). Use getEmbeddings() instead.'
        );
      }
      return result.embedding;
    });
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
