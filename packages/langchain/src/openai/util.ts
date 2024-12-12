import { AIMessage, ToolMessage } from '@langchain/core/messages';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { BaseMessage } from '@langchain/core/messages';
import type { ChatResult } from '@langchain/core/outputs';
import type { StructuredTool } from '@langchain/core/tools';
import type {
  AzureOpenAiChatCompletionRequestSystemMessage,
  AzureOpenAiChatCompletionRequestUserMessage,
  AzureOpenAiChatCompletionRequestAssistantMessage,
  AzureOpenAiChatCompletionRequestMessageTool,
  AzureOpenAiChatCompletionRequestMessageFunction,
  AzureOpenAiChatCompletionTool,
  AzureOpenAiChatCompletionRequestMessage,
  AzureOpenAiCreateChatCompletionResponse,
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiFunctionParameters
} from '@sap-ai-sdk/foundation-models';
import type { AzureOpenAiChatClient } from './chat.js';
import type { AzureOpenAiChatCallOptions } from './types.js';

type ToolChoice =
  | 'none'
  | 'auto'
  | {
      /**
       * The type of the tool.
       */
      type: 'function';
      /**
       * Use to force the model to call a specific function.
       */
      function: {
        /**
         * The name of the function to call.
         */
        name: string;
      };
    };

type LangChainToolChoice = string | Record<string, any> | 'auto' | 'any';

/**
 * Maps a LangChain {@link StructuredTool} to {@link AzureOpenAiChatCompletionFunctions}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @returns The OpenAI chat completion function.
 */
function mapToolToOpenAiFunction(tool: StructuredTool): {
  description?: string;
  name: string;
  parameters: AzureOpenAiFunctionParameters;
} & Record<string, any> {
  return {
    name: tool.name,
    description: tool.description,
    parameters: zodToJsonSchema(tool.schema)
  };
}

/**
 * Maps a LangChain {@link StructuredTool} to {@link AzureOpenAiChatCompletionTool}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @returns The OpenAI chat completion tool.
 */
function mapToolToOpenAiTool(
  tool: StructuredTool
): AzureOpenAiChatCompletionTool {
  return {
    type: 'function',
    function: mapToolToOpenAiFunction(tool)
  };
}

/**
 * Maps a {@link BaseMessage} to{@link AzureOpenAiChatMessage} message role.
 * @param message - The {@link BaseMessage} to map.
 * @returns The {@link AzureOpenAiChatMessage} message Role.
 */
function mapBaseMessageToRole(
  message: BaseMessage
): AzureOpenAiChatCompletionRequestMessage['role'] {
  const messageTypeToRoleMap = new Map<
    string,
    AzureOpenAiChatCompletionRequestMessage['role']
  >([
    ['human', 'user'],
    ['ai', 'assistant'],
    ['system', 'system'],
    ['function', 'function'],
    ['tool', 'tool']
  ]);

  const messageType = message._getType();
  const role = messageTypeToRoleMap.get(messageType);
  if (!role) {
    throw new Error(`Unsupported message type: ${messageType}`);
  }
  return role;
}

/**
 * Maps {@link AzureOpenAiCreateChatCompletionResponse} to LangChain's {@link ChatResult}.
 * @param completionResponse - The {@link AzureOpenAiCreateChatCompletionResponse} response.
 * @returns The LangChain {@link ChatResult}
 * @internal
 */
export function mapOutputToChatResult(
  completionResponse: AzureOpenAiCreateChatCompletionResponse
): ChatResult {
  return {
    generations: completionResponse.choices.map(
      (choice: (typeof completionResponse)['choices'][0]) => ({
        text: choice.message?.content || '',
        message: new AIMessage({
          content: choice.message?.content || '',
          additional_kwargs: {
            finish_reason: choice.finish_reason,
            index: choice.index,
            function_call: choice.message?.function_call,
            tool_calls: choice.message?.tool_calls,
            tool_call_id: ''
          }
        }),
        generationInfo: {
          finish_reason: choice.finish_reason,
          index: choice.index,
          function_call: choice.message?.function_call,
          tool_calls: choice.message?.tool_calls
        }
      })
    ),
    llmOutput: {
      created: completionResponse.created,
      id: completionResponse.id,
      model: completionResponse.model,
      object: completionResponse.object,
      tokenUsage: {
        completionTokens: completionResponse.usage?.completion_tokens || 0,
        promptTokens: completionResponse.usage?.prompt_tokens || 0,
        totalTokens: completionResponse.usage?.total_tokens || 0
      }
    }
  };
}

/**
 * Maps {@link BaseMessage} to {@link AzureOpenAiChatMessage}.
 * @param message - The message to map.
 * @returns The {@link AzureOpenAiChatMessage}.
 */
function mapBaseMessageToAzureOpenAiChatMessage(
  message: BaseMessage
): AzureOpenAiChatCompletionRequestMessage {
  return removeUndefinedProperties<AzureOpenAiChatCompletionRequestMessage>({
    name: message.name,
    ...mapRoleAndContent(message),
    function_call: message.additional_kwargs.function_call,
    tool_calls: message.additional_kwargs.tool_calls,
    tool_call_id: mapToolCallId(message)
  });
}

// The following types are used to match a role to its specific content, otherwise TypeScript would not be able to infer the content type.

type Role = 'system' | 'user' | 'assistant' | 'tool' | 'function';

type ContentType<T extends Role> = T extends 'system'
  ? AzureOpenAiChatCompletionRequestSystemMessage['content']
  : T extends 'user'
    ? AzureOpenAiChatCompletionRequestUserMessage['content']
    : T extends 'assistant'
      ? AzureOpenAiChatCompletionRequestAssistantMessage['content']
      : T extends 'tool'
        ? AzureOpenAiChatCompletionRequestMessageTool['content']
        : T extends 'function'
          ? AzureOpenAiChatCompletionRequestMessageFunction['content']
          : never;

type RoleAndContent = {
  [T in Role]: { role: T; content: ContentType<T> };
}[Role];

function mapRoleAndContent(baseMessage: BaseMessage): RoleAndContent {
  const role = mapBaseMessageToRole(baseMessage);
  return {
    role,
    content: baseMessage.content as ContentType<typeof role>
  } as RoleAndContent;
}

function isStructuredToolArray(tools?: unknown[]): tools is StructuredTool[] {
  return !!tools?.every(tool =>
    Array.isArray((tool as StructuredTool).lc_namespace)
  );
}

/**
 * Has to return an empty string to match one of the types of {@link AzureOpenAiChatCompletionRequestMessage}.
 * @internal
 */
function mapToolCallId(message: BaseMessage): string {
  return ToolMessage.isInstance(message) ? message.tool_call_id : '';
}

function mapToolChoice(
  toolChoice?: LangChainToolChoice
): ToolChoice | undefined {
  if (toolChoice === 'auto' || toolChoice === 'none') {
    return toolChoice;
  }

  if (typeof toolChoice === 'string') {
    return {
      type: 'function',
      function: { name: toolChoice }
    };
  }
}

/**
 * Maps LangChain's input interface to the AI SDK client's input interface
 * @param client The LangChain Azure OpenAI client
 * @param options The {@link AzureOpenAiChatCallOptions}
 * @param messages The messages to be send
 * @returns An AI SDK compatibile request
 * @internal
 */
export function mapLangchainToAiClient(
  client: AzureOpenAiChatClient,
  messages: BaseMessage[],
  options?: AzureOpenAiChatCallOptions & { promptIndex?: number }
): AzureOpenAiCreateChatCompletionRequest {
  return removeUndefinedProperties<AzureOpenAiCreateChatCompletionRequest>({
    messages: messages.map(mapBaseMessageToAzureOpenAiChatMessage),
    max_tokens: client.max_tokens === -1 ? undefined : client.max_tokens,
    presence_penalty: client.presence_penalty,
    frequency_penalty: client.frequency_penalty,
    temperature: client.temperature,
    top_p: client.top_p,
    logit_bias: client.logit_bias,
    user: client.user,
    data_sources: options?.data_sources,
    n: options?.n,
    response_format: options?.response_format,
    seed: options?.seed,
    logprobs: options?.logprobs,
    top_logprobs: options?.top_logprobs,
    function_call: options?.function_call,
    stop: options?.stop ?? client.stop,
    functions: isStructuredToolArray(options?.functions)
      ? options?.functions.map(mapToolToOpenAiFunction)
      : options?.functions,
    tools: isStructuredToolArray(options?.tools)
      ? options?.tools.map(mapToolToOpenAiTool)
      : options?.tools,
    tool_choice: mapToolChoice(options?.tool_choice)
  });
}

function removeUndefinedProperties<T extends object>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (result[key as keyof T] === undefined) {
      delete result[key as keyof T];
    }
  }
  return result;
}
