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
  OpenAiChatCompletionOutput,
  OpenAiChatCompletionParameters,
  DeploymentIdConfiguration,
  ModelDeployment
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Input for Text generation for OpenAI GPT.
 */
export interface OpenAIChatModelInterface
  extends Omit<OpenAIChatInput, 'openAIApiKey' | 'streaming'>,
    Omit<OpenAiChatCompletionParameters, 'n' | 'stop' | 'messages' | 'temperature'>,
    BaseChatModelParams {
      /**
       * The deployment ID of the model.
       */
      deploymentId?: DeploymentIdConfiguration;
      /**
       * The version of the model.
       */
      modelVersion?: string;
    }

/**
 * Input for Text generation for OpenAI GPT.
 */
export type OpenAIChatModelInput = Omit<OpenAIChatInput,
  'frequencyPenalty'
  | 'presencePenalty'
  | 'topP'
  | 'temperature'
  | 'stop'
  | 'n'
  | 'modelName'
  | 'model'
  | 'openAIApiKey'
  | 'streaming'> &
  Omit<OpenAiChatCompletionParameters, 'messages'> &
  BaseChatModelParams &
  ModelDeployment<OpenAiChatModel>;

/**
 * Chat Call options.
 */
interface OpenAIChatCallOptions
  extends Omit<ChatOpenAICallOptions, 'promptIndex' | 'functions' | 'function_call' | 'tools'> {
  functions?: OpenAiChatCompletionFunction[];
  function_call?: OpenAiChatFunctionCall;
  tools?: OpenAiChatCompletionTool[];
}

/**
 * OpenAI Language Model Wrapper to generate texts.
 */
export class OpenAIChatModel extends ChatOpenAI implements OpenAIChatModelInterface {
  declare CallOptions: OpenAIChatCallOptions;

  deploymentId?: DeploymentIdConfiguration;
  modelVersion?: string;
  private btpOpenAIClient: OpenAiClient;

  constructor(fields: OpenAIChatModelInput) {
    const defaultValues = new ChatOpenAI();
    const n = fields.n ?? defaultValues.n;
    const stop = fields.stop ? Array.isArray(fields.stop) ? fields.stop : [fields.stop] : defaultValues.stop;
    const temperature = fields.temperature ?? defaultValues.temperature;
    const frequencyPenalty = fields.frequency_penalty ?? defaultValues.frequencyPenalty;
    const presencePenalty = fields.presence_penalty ?? defaultValues.presencePenalty;
    const topP = fields.top_p ?? defaultValues.topP;

    super({
      ...fields,
      n,
      stop,
      temperature,
      openAIApiKey: 'dummy',
      frequencyPenalty,
      presencePenalty,
      topP
    });

    this.deploymentId = fields.deploymenId;
    this.modelVersion = fields.modelVersion;

    // LLM client
    this.btpOpenAIClient = new OpenAiClient();
  }

  override get callKeys(): (keyof OpenAIChatCallOptions)[] {
    return [
      ...(super.callKeys as (keyof OpenAIChatCallOptions)[]),
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
            messages: messages.map(this.mapBaseMessageToOpenAIChatMessage.bind(this)),
            deployment_id: this.deploymentId,
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
              ? options?.tools.map(this.mapToolToOpenAITool.bind(this))
              : options?.tools,
            tool_choice: options?.tool_choice,
            response_format: options?.response_format,
            seed: options?.seed,
            ...this.modelKwargs,
          },
          {
            modelName: this.modelName ?? this.model,
            deploymentId: this.deploymentId,
            modelVersion: this.modelVersion
          },
        ),
    );

    // currently BTP LLM Proxy for OpenAI doesn't support streaming
    await runManager?.handleLLMNewToken(
      typeof res.choices[0].message.content === 'string' ? res.choices[0].message.content : '',
    );

    return this.mapResponseToChatResult(res);
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
  protected mapToolToOpenAITool(tool: StructuredTool): OpenAiChatCompletionTool {
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
        throw new Error(`Unknown message type: ${message._getType()}`);
    }
  }

  /**
   * Maps {@link BaseMessage} to OpenAI Messages.
   */
  protected mapBaseMessageToOpenAIChatMessage(message: BaseMessage): OpenAiChatMessage {
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
  protected mapResponseToChatResult(res: OpenAiChatCompletionOutput): ChatResult {
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
