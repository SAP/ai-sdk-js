import { AIMessageChunk } from '@langchain/core/messages';
import type { AIMessageChunkFields } from '@langchain/core/messages';
import type { ModuleResultsStreaming } from '@sap-ai-sdk/orchestration';

/**
 * An AI Message Chunk containing module results and request ID.
 */
export class OrchestrationMessageChunk extends AIMessageChunk {
  module_results: ModuleResultsStreaming;
  request_id: string;
  constructor(
    fields: string | AIMessageChunkFields,
    module_results: ModuleResultsStreaming,
    request_id: string
  ) {
    super(fields);
    this.module_results = module_results;
    this.request_id = request_id;
  }
}
