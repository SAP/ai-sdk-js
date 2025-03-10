import { AIMessage } from '@langchain/core/messages';
import type { AIMessageFields } from '@langchain/core/messages';
import type { ModuleResults } from '@sap-ai-sdk/orchestration';

/**
 * An AI Message containing module results and request ID.
 * @internal
 */
export class OrchestrationMessage extends AIMessage {
  module_results: ModuleResults;
  request_id: string;
  constructor(
    fields: string | AIMessageFields,
    module_results: ModuleResults,
    request_id: string
  ) {
    super(fields);
    this.module_results = module_results;
    this.request_id = request_id;
  }
}
