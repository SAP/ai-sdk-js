import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { BaseMessage } from '@langchain/core/messages';
import { ChatResult } from '@langchain/core/outputs';
import { StructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { OpenAiChatClient, OpenAiChatModel } from '@sap-ai-sdk/gen-ai-hub';
import {
  mapBaseMessageToOpenAIChatMessage,
  mapResponseToChatResult,
  mapToolToOpenAIFunction,
  mapToolToOpenAITool
} from './util.js';
import {
  OpenAIChatModelInput,
  OpenAIChatModelInterface,
  OpenAIChatCallOptions
} from './types.js';

/**
 * OpenAI Language Model Wrapper to generate texts.
 */
export class OpenAIChat extends ChatOpenAI implements OpenAIChatModelInterface {
  declare CallOptions: OpenAIChatCallOptions;

  deploymentId?: string;
  modelVersion?: string;
  resourceGroup?: string;
  modelName: OpenAiChatModel;
  model: OpenAiChatModel;
  private btpOpenAIClient: OpenAiChatClient;

  constructor(fields: OpenAIChatModelInput) {
    const defaultValues = new ChatOpenAI();
    const n = fields.n ?? defaultValues.n;
    const stop = fields.stop
      ? Array.isArray(fields.stop)
        ? fields.stop
        : [fields.stop]
      : defaultValues.stop;
    const temperature = fields.temperature ?? defaultValues.temperature;
    const frequencyPenalty =
      fields.frequency_penalty ?? defaultValues.frequencyPenalty;
    const presencePenalty =
      fields.presence_penalty ?? defaultValues.presencePenalty;
    const topP = fields.top_p ?? defaultValues.topP;
    const model = defaultValues.model;

    super({
      ...fields,
      model,
      n,
      stop,
      temperature,
      openAIApiKey: 'dummy',
      frequencyPenalty,
      presencePenalty,
      topP
    });

    this.model = fields.modelName;
    this.modelName = fields.modelName;
    this.modelVersion = fields.modelVersion;
    this.deploymentId = fields.deploymentId;
    this.resourceGroup = fields.resourceGroup;

    this.btpOpenAIClient = new OpenAiChatClient(
      {
         modelName: this.modelName,
         modelVersion: this.modelVersion,
         deploymentId: this.deploymentId,
         resourceGroup: this.resourceGroup,
      }
    );
  }

  override get callKeys(): (keyof OpenAIChatCallOptions)[] {
    return [
      ...(super.callKeys as (keyof OpenAIChatCallOptions)[]),
      'options',
      'functions',
      'tools',
      'tool_choice',
      'response_format',
      'seed'
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
    runManager?: CallbackManagerForLLMRun
  ): Promise<ChatResult> {
    function isStructuredToolArray(
      tools?: unknown[]
    ): tools is StructuredTool[] {
      return (
        tools !== undefined &&
        tools.every(tool =>
          Array.isArray((tool as StructuredTool).lc_namespace)
        )
      );
    }
    const res = await this.caller.callWithOptions(
      {
        signal: options.signal
      },
      () =>
        this.btpOpenAIClient.run(
          {
            messages: messages.map(mapBaseMessageToOpenAIChatMessage),
            max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
            temperature: this.temperature,
            top_p: this.topP,
            logit_bias: this.logitBias,
            n: this.n,
            stop: options?.stop ?? this.stop,
            presence_penalty: this.presencePenalty,
            frequency_penalty: this.frequencyPenalty,
            functions: isStructuredToolArray(options?.functions)
              ? options?.functions.map(mapToolToOpenAIFunction)
              : options?.functions,
            tools: isStructuredToolArray(options?.tools)
              ? options?.tools.map(mapToolToOpenAITool)
              : options?.tools,
            tool_choice: options?.tool_choice,
            response_format: options?.response_format,
            seed: options?.seed,
            ...this.modelKwargs
          }
        )
    );

    // currently BTP LLM Proxy for OpenAI doesn't support streaming
    await runManager?.handleLLMNewToken(
      typeof res.choices[0].message.content === 'string'
        ? res.choices[0].message.content
        : ''
    );

    return mapResponseToChatResult(res);
  }
}
