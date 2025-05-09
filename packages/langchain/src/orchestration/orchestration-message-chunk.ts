import { AIMessageChunk } from '@langchain/core/messages';
import type { AIMessageChunkFields } from '@langchain/core/messages';
import type { ModuleResults } from '@sap-ai-sdk/orchestration';

/**
 * An AI Message Chunk containing module results and request ID.
 */
export class OrchestrationMessageChunk extends AIMessageChunk {
  module_results: ModuleResults;
  request_id: string;
  // Adding additonal properties to also store properties from other types of Message Chunks.
  additional_properties?: Record<string, any>;
  constructor(
    fields: string | AIMessageChunkFields,
    module_results: ModuleResults,
    request_id: string,
    additional_properties?: {
      role?: string;
      tool_call_id?: string;
      [key: string]: any;
    }
  ) {
    super(fields);
    this.module_results = module_results;
    this.request_id = request_id;
    this.additional_properties = additional_properties;
  }
}
