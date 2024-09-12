import { HttpResponse } from '@sap-cloud-sdk/http-client';
import { parseHttpResponse } from '@sap-ai-sdk/core';
import { OpenAiEmbeddingOutput } from './openai-types.js';

/**
 * OpenAI embedding response.
 */
export class OpenAiEmbeddingResponse {
  /**
   * The embedding response.
   */
  public readonly data: OpenAiEmbeddingOutput;
  constructor(public readonly rawResponse: HttpResponse, zodSchema: any) {
    this.data = parseHttpResponse<OpenAiEmbeddingOutput>(rawResponse, zodSchema);
  }
}
