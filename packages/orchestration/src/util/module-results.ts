import type { LLMModuleResultStreaming, OrchestrationResponse } from '../index.js';

/**
 * @internal
 */
export function mergeChoices<T>(...results: (T | undefined)[]): T | undefined {
  return results.reduce(
    (acc, result) => {
      if (result === undefined) {
        return acc;
      }
      if (acc === undefined) {
        return result;
      }
      return { ...acc, ...result };
    },
    undefined as T | undefined
  );
}

/**
 * @internal
 */
export function mergeLlmModuleResult(
  ...results: (LLMModuleResultStreaming | undefined)[]
): LLMModuleResult | undefined {
  return results.reduce((acc, result) => {
    if (result === undefined) {
      return acc;
    }
    if (acc === undefined) {
      return result;
    }
    return {
      ...acc,
      choices: mergeChoices(acc.choices, result.choices),
      finish_reason: mergeChoices(acc.finish_reason, result.finish_reason),
      usage: mergeChoices(acc.usage, result.usage),
    };
  }, undefined as LLMModuleResult | undefined);
}

export function mergeOrchestrationResult(
  ...results: any[] // Replace 'any' with the actual type if known
): OrchestrationResponse | undefined {
}
