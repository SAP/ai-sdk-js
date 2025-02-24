import { AIMessageChunk } from '@langchain/core/messages';
import type { AIMessageChunkFields } from '@langchain/core/messages';
import type { ModuleResults } from '@sap-ai-sdk/orchestration';

/**
 * TODO: Add docs.
 */
export class OrchestrationMessageChunk extends AIMessageChunk {
    module_results: ModuleResults;
    request_id: string;
    constructor(fields: string | AIMessageChunkFields, module_results: ModuleResults, request_id: string) {
      super(fields);
      this.module_results = module_results;
      this.request_id = request_id;
    }
  }
