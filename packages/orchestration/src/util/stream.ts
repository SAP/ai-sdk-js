import type { CompletionPostResponseStreaming, LlmChoice, LlmChoiceStreaming, LlmModuleResult, LLMModuleResultStreaming, ModuleResults, ModuleResultsStreaming, OrchestrationStreamChunkResponse, OrchestrationStreamResponse } from '../index.js';

/**
 * @internal
 */
export function mergeStreamResponse(
  chunk: CompletionPostResponseStreaming,
  response: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
): void {
    const data = response._data;
    data.request_id = chunk.request_id;
    data.module_results = mergeModuleResults(data.module_results, chunk.module_results);
    data.orchestration_result = mergeLlmModule(data.orchestration_result, chunk.orchestration_result);
}

function mergeModuleResults(
  existing: ModuleResults | undefined,
  incoming: ModuleResultsStreaming | undefined
): ModuleResults {
  const mergedModuleResults = { ...existing };
  for(const [moduleName, moduleResult] of Object.entries(incoming || {})) {
    switch(moduleName) {
      case 'llm':
        mergedModuleResults[moduleName] = mergeLlmModule(mergedModuleResults[moduleName], moduleResult);
        break;
      case 'output_unmasking':
        mergedModuleResults[moduleName] = mergeOutputUnmaskingModule(mergedModuleResults[moduleName], moduleResult);
        break;
      default:
        mergedModuleResults[moduleName] = moduleResult;
    }
  }
  return mergedModuleResults;
}

function mergeLlmModule(
  existing: LlmModuleResult | undefined,
  incoming: LLMModuleResultStreaming | undefined
): LlmModuleResult {
  return { ...existing, ...incoming } as LlmModuleResult;
}

function mergeOutputUnmaskingModule(
  existing: LlmChoice[] | undefined,
  incoming: LlmChoiceStreaming[] | undefined
): LlmChoice[] {
  return [...(existing || []), ...(incoming || [])] as LlmChoice[];
}
