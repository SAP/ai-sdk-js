import { AIMessage } from '@langchain/core/messages';
import type { AIMessageFields } from '@langchain/core/messages';
import type { ModuleResults } from '@sap-ai-sdk/orchestration/internal.js';

/**
 * An AI Message containing intermediate results and request ID.
 * @internal
 */
export class OrchestrationMessage extends AIMessage {
  intermediate_results: ModuleResults;
  request_id: string;
  constructor(
    fields: string | AIMessageFields,
    intermediate_results: ModuleResults,
    request_id: string
  ) {
    super(fields);
    this.intermediate_results = intermediate_results;
    this.request_id = request_id;
  }
}
