import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { AIMessage, BaseMessage, ChatMessage, ToolMessage } from '@langchain/core/messages';
import { ChatResult } from '@langchain/core/outputs';
import { StructuredTool } from '@langchain/core/tools';
import { ChatOpenAI, ChatOpenAICallOptions, OpenAIChatInput } from '@langchain/openai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  OpenAiChatAssistantMessage,
  OpenAiChatModel,
  OpenAiChatToolMessage,
  OpenAiClient,
  OpenAiChatCompletionFunction,
  OpenAiChatFunctionCall,
  OpenAiChatMessage,
  OpenAiChatCompletionTool,
  OpenAiChatCompletionOutput
} from '@sap-ai-sdk/gen-ai-hub';
import { BTPBaseLLMParameters } from '../../client/base.js';
import { BTPLLMError } from '../../core/error.js';

/**
 * Input for Text generation for OpenAI GPT.
 */
export interface BTPOpenAIGPTChatInput
  extends Omit<OpenAIChatInput, 'modelName' | 'openAIApiKey' | 'streaming'>,
    BTPBaseLLMParameters<OpenAiChatModel>,
    BaseChatModelParams {}

/**
 * Chat Call options.
 */
interface BTPOpenAIChatCallOptions
  extends Omit<ChatOpenAICallOptions, 'promptIndex' | 'functions' | 'function_call' | 'tools'> {
  functions?: OpenAiChatCompletionFunction[];
  function_call?: OpenAiChatFunctionCall;
  tools?: OpenAiChatCompletionTool[];
}

/**
 * OpenAI Language Model Wrapper to generate texts.
 */
export class BTPOpenAIGPTChat extends ChatOpenAI implements BTPOpenAIGPTChatInput {
  declare CallOptions: BTPOpenAIChatCallOptions;

  deployment_id: OpenAiChatModel;
  private btpOpenAIClient: OpenAiClient;

  constructor(fields: BTPOpenAIGPTChatInput) {
    super({ ...fields, openAIApiKey: 'dummy' });

    this.deployment_id = fields?.deployment_id ?? 'gpt-35-turbo';

    // LLM client
    this.btpOpenAIClient = new OpenAiClient();
  }

  override get callKeys(): (keyof BTPOpenAIChatCallOptions)[] {
    return [
      ...(super.callKeys as (keyof BTPOpenAIChatCallOptions)[]),
      'options',
      'function_call',
      'functions',
      'tools',
      'tool_choice',
      'response_format',
      'seed',
    ];
  }

  override get lc_secrets(): { [key: string]: string } | undefined {
    // overrides default keys as not applicable in BTP
    return {};
  }

  override get lc_aliases(): Record<string, string> {
    // overrides default keys as not applicable in BTP
    return {};
  }

  override async _generate(
    messages: BaseMessage[],
    options: this['CallOptions'],
    runManager?: CallbackManagerForLLMRun,
  ): Promise<ChatResult> {
    function isStructuredToolArray(tools?: unknown[]): tools is StructuredTool[] {
      return tools !== undefined && tools.every((tool) => Array.isArray((tool as StructuredTool).lc_namespace));
    }
    const res = await this.caller.callWithOptions(
      {
        signal: options.signal,
      },
      () =>
        this.btpOpenAIClient.chatCompletion(
          {
            messages: messages.map(this.mapBaseMessageToBTPOpenAIMessage.bind(this)),
            deployment_id: this.deployment_id,
            max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
            temperature: this.temperature,
            top_p: this.topP,
            logit_bias: this.logitBias,
            n: this.n,
            stop: options?.stop ?? this.stop,
            presence_penalty: this.presencePenalty,
            frequency_penalty: this.frequencyPenalty,
            functions: isStructuredToolArray(options?.functions)
              ? options?.functions.map(this.mapToolToBTPOpenAIFunction.bind(this))
              : options?.functions,
            tools: isStructuredToolArray(options?.tools)
              ? options?.tools.map(this.mapToolToBTPOpenAITool.bind(this))
              : options?.tools,
            tool_choice: options?.tool_choice,
            response_format: options?.response_format,
            seed: options?.seed,
            ...this.modelKwargs,
          },
          this.deployment_id
        ),
    );

    // currently BTP LLM Proxy for OpenAI doesn't support streaming
    await runManager?.handleLLMNewToken(
      typeof res.choices[0].message.content === 'string' ? res.choices[0].message.content : '',
    );

    return this.mapBTPOpenAIMessagesToChatResult(res);
  }

  /**
   * Maps a LangChain {@link StructuredTool} to {@link OpenAiChatCompletionFunction}.
   */
  protected mapToolToBTPOpenAIFunction(tool: StructuredTool): OpenAiChatCompletionFunction {
    return {
      name: tool.name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.schema),
    };
  }

  /**
   * Maps a LangChain {@link StructuredTool} to {@link OpenAiChatCompletionTool}.
   */
  protected mapToolToBTPOpenAITool(tool: StructuredTool): OpenAiChatCompletionTool {
    return {
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: zodToJsonSchema(tool.schema),
      },
    };
  }

  /**
   * Maps a {@link BaseMessage} to OpenAI's Message Role.
   */
  protected mapBaseMessageToRole(message: BaseMessage): OpenAiChatMessage['role'] {
    switch (message._getType()) {
      case 'ai':
        return 'assistant';
      case 'human':
        return 'user';
      case 'system':
        return 'system';
      case 'function':
        return 'function';
      case 'tool':
        return 'tool';
      case 'generic':
        return (message as ChatMessage).role as OpenAiChatMessage['role'];
      default:
        throw new BTPLLMError(`Unknown message type: ${message._getType()}`);
    }
  }

  /**
   * Maps {@link BaseMessage} to OpenAI Messages.
   */
  protected mapBaseMessageToBTPOpenAIMessage(message: BaseMessage): OpenAiChatMessage {
    return {
      content: message.content,
      name: message.name,
      role: this.mapBaseMessageToRole(message),
      function_call: message.additional_kwargs.function_call,
      tool_calls: message.additional_kwargs.tool_calls,
      tool_call_id: (message as ToolMessage).tool_call_id,
    } as OpenAiChatMessage;
  }

  /**
   * Maps OpenAI messages to LangChain's {@link ChatResult}.
   */
  protected mapBTPOpenAIMessagesToChatResult(res: OpenAiChatCompletionOutput): ChatResult {
    return {
      generations: res.choices.map((c) => ({
          text: (c.message as OpenAiChatAssistantMessage).content || '',
          message: new AIMessage({
            content: (c.message as OpenAiChatAssistantMessage).content || '',
            additional_kwargs: {
              finish_reason: c.finish_reason,
              index: c.index,
              logprobs: c.logprobs,
              function_call: (c.message as OpenAiChatAssistantMessage).function_call, // add `function_call` parameter
              tool_calls: (c.message as OpenAiChatAssistantMessage).tool_calls,
              tool_call_id: (c.message as OpenAiChatToolMessage).tool_call_id,
            },
          }),
          generationInfo: {
            finish_reason: c.finish_reason,
            index: c.index,
            logprobs: c.logprobs,
            function_call: (c.message as OpenAiChatAssistantMessage).function_call, // add `function_call` parameter
            tool_calls: (c.message as OpenAiChatAssistantMessage).tool_calls,
          },
        })),
      llmOutput: {
        created: res.created,
        id: res.id,
        model: res.model,
        object: res.object,
        tokenUsage: {
          completionTokens: res.usage.completion_tokens,
          promptTokens: res.usage.prompt_tokens,
          totalTokens: res.usage.total_tokens,
        },
      },
    };
  }
}

/**
 * @deprecated Use {@link BTPOpenAIGPTChat} instead.
 */
export const BTPOpenAIChat = BTPOpenAIGPTChat;
