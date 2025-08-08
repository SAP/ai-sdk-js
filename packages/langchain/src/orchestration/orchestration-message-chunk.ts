import { AIMessageChunk } from '@langchain/core/messages';
import type { AIMessageChunkFields } from '@langchain/core/messages';
import type { ModuleResultsStreaming } from '@sap-ai-sdk/orchestration/internal.js';

/**
 * An AI Message Chunk containing intermediate results and request ID.
 */
export class OrchestrationMessageChunk extends AIMessageChunk {
  intermediate_results: ModuleResultsStreaming;
  request_id: string;
  constructor(
    fields: string | AIMessageChunkFields,
    intermediate_results: ModuleResultsStreaming,
    request_id: string
  ) {
    super(fields);
    this.intermediate_results = intermediate_results;
    this.request_id = request_id;
  }
}
