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
        mergedModuleResults[moduleName] = mergeLlmChoices(mergedModuleResults[moduleName], moduleResult);
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
): LlmModuleResult | undefined {
  if(!incoming) {
    return existing
  }
  const mergedModuleResults = {
    ...incoming,
    usage: mergeTokenUsage(existing?.usage, incoming.usage),
    choices: mergeLlmChoices(existing?.choices, incoming?.choices)
  };
  return mergedModuleResults;
}

function mergeTokenUsage(
  existing: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined,
  incoming: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined
): { prompt_tokens: number; completion_tokens: number; total_tokens: number } {
  return {
    prompt_tokens: incoming?.prompt_tokens ?? existing?.prompt_tokens ?? 0,
    completion_tokens: incoming?.completion_tokens ?? existing?.completion_tokens ?? 0,
    total_tokens: incoming?.total_tokens ?? existing?.total_tokens ?? 0
  };
}

function mergeLlmChoices(
  existing: LlmChoice[] | undefined,
  incoming: LlmChoiceStreaming[] | undefined
): LlmChoice[] {
  return [
    ...(existing ?? []),
    ...(incoming?.map(choice => ({
      incoming: choice.delta.
      ...choice,
      message: choice.message ? {
        ...choice.message,
        content: choice.message.content
      } : undefined
    })) ?? [])
  ] as LlmChoice[];
}
