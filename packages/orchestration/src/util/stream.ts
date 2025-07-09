import type { CompletionPostResponseStreaming, OrchestrationStreamChunkResponse, OrchestrationStreamResponse } from '../index.js';

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
    data.orchestration_result = mergeOrchestrationResult(data.orchestration_result, chunk.orchestration_result);
}

function mergeModuleResults(
  existing: Record<string, any> | undefined,
  incoming: Record<string, any> | undefined
): Record<string, any> | undefined {
  if (!existing) {
    return incoming;
  }
  if (!incoming) {
    return existing;
  }
  return { ...existing, ...incoming };
}

function mergeOrchestrationResult(
  existing: Record<string, any> | undefined,
  incoming: Record<string, any> | undefined
): Record<string, any> | undefined {
  if (!existing) {
    return incoming;
  }
  if (!incoming) {
    return existing;
  }
  return { ...existing, ...incoming };
}
