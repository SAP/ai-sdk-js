import { createLogger } from '@sap-cloud-sdk/util';
import type {
  ChatDelta,
  ChoiceLogprobs,
  CompletionPostResponseStreaming,
  LlmChoice,
  LlmChoiceStreaming,
  LlmModuleResult,
  LLMModuleResultStreaming,
  MessageToolCall,
  ModuleResults,
  ModuleResultsStreaming,
  OrchestrationStreamChunkResponse,
  OrchestrationStreamResponse,
  ResponseChatMessage,
  ToolCallChunk
} from '../index.js';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'stream-util'
});

/**
 * @internal
 */
export function mergeStreamResponse(
  chunk: CompletionPostResponseStreaming,
  response: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
): void {
  const data = response._data;
  data.request_id = chunk.request_id;
  data.module_results = mergeModuleResults(
    data.module_results,
    chunk.module_results
  );
  data.orchestration_result = mergeLlmModule(
    data.orchestration_result,
    chunk.orchestration_result
  );
}

function mergeModuleResults(
  existing: ModuleResults | undefined,
  incoming: ModuleResultsStreaming | undefined
): ModuleResults {
  const mergedModuleResults = { ...existing };
  for (const [moduleName, moduleResult] of Object.entries(incoming || {})) {
    switch (moduleName) {
      case 'llm':
        mergedModuleResults[moduleName] = mergeLlmModule(
          mergedModuleResults[moduleName],
          moduleResult
        );
        break;
      case 'output_unmasking':
        mergedModuleResults[moduleName] = mergeLlmChoices(
          mergedModuleResults[moduleName],
          moduleResult
        );
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
  if (!incoming) {
    return existing;
  }
  const mergedModuleResults = {
    ...incoming,
    usage: mergeTokenUsage(existing?.usage, incoming.usage),
    choices: mergeLlmChoices(existing?.choices, incoming?.choices)
  };
  return mergedModuleResults;
}

function mergeTokenUsage(
  existing:
    | { prompt_tokens: number; completion_tokens: number; total_tokens: number }
    | undefined,
  incoming:
    | { prompt_tokens: number; completion_tokens: number; total_tokens: number }
    | undefined
): { prompt_tokens: number; completion_tokens: number; total_tokens: number } {
  return {
    prompt_tokens: incoming?.prompt_tokens ?? existing?.prompt_tokens ?? 0,
    completion_tokens:
      incoming?.completion_tokens ?? existing?.completion_tokens ?? 0,
    total_tokens: incoming?.total_tokens ?? existing?.total_tokens ?? 0
  };
}

function mergeLlmChoices(
  existing: LlmChoice[] | undefined,
  incoming: LlmChoiceStreaming[] | undefined
): LlmChoice[] {
  const mergedChoices = [...(existing ?? [])];
  for (const choice of incoming ?? []) {
    const existingChoice = mergedChoices.find(c => c.index === choice.index);
    if (existingChoice) {
      // Merge existing choice with incoming choice
      existingChoice.index = choice.index ?? existingChoice.index;
      existingChoice.finish_reason = handleFinishReason(
        existingChoice.finish_reason,
        choice.finish_reason,
        choice.index
      );
      existingChoice.logprobs = mergeLogProbs(
        existingChoice.logprobs,
        choice.logprobs
      );
      existingChoice.message = mergeMessage(
        existingChoice.message,
        choice.delta
      );
    } else {
      // Add new choice
      mergedChoices.push(transformStreamingChoice(choice));
    }
  }
  return mergedChoices;
}

function mergeMessage(
  existing: ResponseChatMessage,
  incoming: ChatDelta | undefined
): ResponseChatMessage {
  if (!incoming) {
    return existing;
  }
  return {
    role: existing.role,
    content: existing.content + (incoming.content ?? ''),
    tool_calls: mergeToolCalls(existing.tool_calls, incoming.tool_calls),
    refusal: incoming.refusal ?? existing.refusal
  };
}

function mergeToolCalls(
  existing: MessageToolCall[] | undefined,
  incoming: ToolCallChunk[] | undefined
): MessageToolCall[] | undefined {
  if (!incoming || incoming.length === 0) {
    return existing;
  }
  if (!existing || existing.length === 0) {
    return transformStreamingToolCalls(incoming);
  }
  const mergedToolCalls = [...existing];
  for (const toolCall of incoming) {
    const existingToolCall = mergedToolCalls.find(tc => tc.id === toolCall.id);
    if (existingToolCall) {
      // Merge existing tool call with incoming tool call
      existingToolCall.function.name =
        toolCall.function?.name ?? existingToolCall.function.name;
      existingToolCall.function.arguments =
        existingToolCall.function.arguments +
        (toolCall.function?.arguments ?? '');
    } else {
      // Add new tool call
      mergedToolCalls.push(transformStreamingToolCall(toolCall));
    }
  }
  return mergedToolCalls;
}

function mergeLogProbs(
  existing: ChoiceLogprobs | undefined,
  incoming: ChoiceLogprobs | undefined
): ChoiceLogprobs | undefined {
  if (!incoming) {
    return existing;
  }
  if (!existing) {
    return incoming;
  }
  return {
    content: [...(existing.content ?? []), ...(incoming.content ?? [])],
    refusal: [...(existing.refusal ?? []), ...(incoming.refusal ?? [])]
  };
}

function handleFinishReason(
  existing: string | undefined,
  incoming: string | undefined,
  choiceIndex: number | undefined
): string {
  if (!incoming) {
    return existing ?? '';
  }

  switch (incoming) {
    case 'content_filter':
      logger.error(
        `Choice ${choiceIndex}: Stream finished with content filter hit.`
      );
      break;
    case 'length':
      logger.error(
        `Choice ${choiceIndex}: Stream finished with token length exceeded.`
      );
      break;
    case 'stop':
    case 'tool_calls':
    case 'function_call':
      logger.debug(`Choice ${choiceIndex}: Stream finished.`);
      break;
    default:
      logger.error(
        `Choice ${choiceIndex}: Stream finished with unknown reason '${incoming}'.`
      );
  }

  return incoming;
}

function transformStreamingChoice(choice: LlmChoiceStreaming): LlmChoice {
  return {
    index: choice.index,
    message: {
      role: 'assistant',
      content: choice.delta.content,
      tool_calls: transformStreamingToolCalls(choice.delta.tool_calls),
      refusal: choice.delta.refusal
    },
    finish_reason: choice.finish_reason ?? '',
    logprobs: choice.logprobs
  };
}

function transformStreamingToolCalls(
  toolCalls: ToolCallChunk[] | undefined
): MessageToolCall[] | undefined {
  if (!toolCalls || toolCalls.length === 0) {
    return undefined;
  }
  return toolCalls?.map(toolCall => transformStreamingToolCall(toolCall));
}

function transformStreamingToolCall(toolCall: ToolCallChunk): MessageToolCall {
  return {
    id: toolCall.id ?? '',
    type: toolCall.type ?? 'function',
    function: {
      name: toolCall.function?.name ?? '',
      arguments: toolCall.function?.arguments ?? ''
    }
  };
}

/**
 * @internal
 */
export function validateResponse(
  response: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
): void {
  if (response._openStream) {
    throw new Error(
      "Stream wasn't closed properly. Please ensure the stream is closed after processing."
    );
  }

  validateLlmModuleResult(response._data.module_results?.llm);

  validateLlmModuleResult(response._data.orchestration_result);

  validateChoices(response._data.module_results?.output_unmasking);
}

function validateLlmModuleResult(
  llmModuleResult: LlmModuleResult | undefined
): void {
  if (llmModuleResult) {
    if (!llmModuleResult.usage) {
      logger.warn('LlmModuleResult is missing usage information.');
    }
    if (!llmModuleResult.choices || llmModuleResult.choices.length === 0) {
      logger.warn('LlmModuleResult must contain at least one choice.');
    }

    validateChoices(llmModuleResult.choices);
  }
}

function validateChoices(choices: LlmChoice[] | undefined): void {
  if (choices) {
    for (const choice of choices) {
      if (!choice.message) {
        logger.warn('LlmChoice is missing message information.');
      }
      if (!choice.finish_reason) {
        logger.warn('LlmChoice is missing a finish reason.');
      }
      if (!choice.index && choice.index !== 0) {
        logger.warn('LlmChoice must have a valid index.');
      }
      validateMessage(choice.message);
    }
  }
}

function validateMessage(message: ResponseChatMessage): void {
  if (!message.role) {
    logger.warn('Message is missing role information.');
  }
  if (!message.content && !message.tool_calls) {
    logger.warn('Message contains neither content nor tool calls.');
  }

  if (message.tool_calls) {
    for (const toolCall of message.tool_calls) {
      validateToolCall(toolCall);
    }
  }
}

function validateToolCall(toolCall: Partial<MessageToolCall>): void {
  if (typeof toolCall.id !== 'string') {
    logger.warn('ToolCall is missing id information.');
  }
  if (typeof toolCall.function?.name !== 'string') {
    logger.warn('ToolCall is missing function name information.');
  }
  if (typeof toolCall.function?.arguments !== 'string') {
    logger.warn('ToolCall is missing function arguments information.');
  }

  try {
    JSON.parse(toolCall.function?.arguments ?? '');
  } catch {
    logger.warn(
      'ToolCall arguments are not valid JSON for tool: ' +
        toolCall.function?.name ||
        toolCall.id ||
        'unknown'
    );
  }
}
