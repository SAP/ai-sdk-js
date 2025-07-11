import { AzureOpenAiChatClient as AzureOpenAiChatClientBase } from '@sap-ai-sdk/foundation-models';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import {
  RunnableLambda,
  RunnablePassthrough,
  RunnableSequence,
  type Runnable
} from '@langchain/core/runnables';
import {
  getSchemaDescription,
  isInteropZodSchema
} from '@langchain/core/utils/types';
import {
  JsonOutputParser,
  StructuredOutputParser
} from '@langchain/core/output_parsers';
import { toJsonSchema } from '@langchain/core/utils/json_schema';
import { JsonOutputKeyToolsParser } from '@langchain/core/output_parsers/openai_tools';
import {
  mapAzureOpenAiChunkToLangChainMessageChunk,
  mapLangChainToAiClient,
  mapOutputToChatResult,
  mapToolToOpenAiTool
} from './util.js';
import type { InteropZodType } from '@langchain/core/utils/types';
import type { NewTokenIndices } from '@langchain/core/callbacks/base';
import type {
  BaseLanguageModelInput,
  FunctionDefinition,
  StructuredOutputMethodOptions
} from '@langchain/core/language_models/base';
import type { AIMessageChunk, BaseMessage } from '@langchain/core/messages';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type { ChatResult } from '@langchain/core/outputs';
import type {
  AzureOpenAiChatCallOptions,
  AzureOpenAiChatModelParams,
  ChatAzureOpenAIToolType
} from './types.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { JsonSchema7Type } from '@langchain/core/utils/json_schema';

/**
 * LangChain chat client for Azure OpenAI consumption on SAP BTP.
 */
export class AzureOpenAiChatClient extends BaseChatModel<AzureOpenAiChatCallOptions> {
  temperature?: number | null;
  top_p?: number | null;
  logit_bias?: Record<string, any> | null | undefined;
  user?: string;
  presence_penalty?: number;
  frequency_penalty?: number;
  stop?: string | string[];
  max_tokens?: number;
  supportsStrictToolCalling?: boolean;
  modelName: string;
  private openAiChatClient: AzureOpenAiChatClientBase;

  constructor(
    fields: AzureOpenAiChatModelParams,
    destination?: HttpDestinationOrFetchOptions
  ) {
    super(fields);
    this.openAiChatClient = new AzureOpenAiChatClientBase(fields, destination);
    this.modelName = fields.modelName;
    this.temperature = fields.temperature;
    this.top_p = fields.top_p;
    this.logit_bias = fields.logit_bias;
    this.user = fields.user;
    this.stop = fields.stop;
    this.presence_penalty = fields.presence_penalty;
    this.frequency_penalty = fields.frequency_penalty;
    this.max_tokens = fields.max_tokens;
    if (fields.supportsStrictToolCalling !== undefined) {
      this.supportsStrictToolCalling = fields.supportsStrictToolCalling;
    }
  }

  _llmType(): string {
    return 'azure_openai';
  }

  override async _generate(
    messages: BaseMessage[],
    options: typeof this.ParsedCallOptions,
    runManager?: CallbackManagerForLLMRun
  ): Promise<ChatResult> {
    const res = await this.caller.callWithOptions(
      {
        signal: options.signal
      },
      () =>
        this.openAiChatClient.run(
          mapLangChainToAiClient(this, messages, options),
          options.requestConfig
        )
    );

    const content = res.getContent();

    // we currently do not support streaming
    await runManager?.handleLLMNewToken(
      typeof content === 'string' ? content : ''
    );

    return mapOutputToChatResult(res.data);
  }

  override bindTools(
    tools: ChatAzureOpenAIToolType[],
    kwargs?: Partial<AzureOpenAiChatCallOptions> | undefined
  ): Runnable<
    BaseLanguageModelInput,
    AIMessageChunk,
    AzureOpenAiChatCallOptions
  > {
    let strict: boolean | undefined;
    if (kwargs?.strict !== undefined) {
      strict = kwargs.strict;
    } else if (this.supportsStrictToolCalling !== undefined) {
      strict = this.supportsStrictToolCalling;
    }
    const newTools = tools.map(tool => mapToolToOpenAiTool(tool, strict));
    return this.withConfig({
      tools: newTools,
      ...kwargs
    } as Partial<AzureOpenAiChatCallOptions>);
  }

  withStructuredOutput<
    RunOutput extends Record<string, any> = Record<string, any>
  >(
    outputSchema: InteropZodType<RunOutput> | Record<string, any>,
    config?: StructuredOutputMethodOptions<false>
  ): Runnable<BaseLanguageModelInput, RunOutput>;

  withStructuredOutput<
    RunOutput extends Record<string, any> = Record<string, any>
  >(
    outputSchema: InteropZodType<RunOutput> | Record<string, any>,
    config?: StructuredOutputMethodOptions<true>
  ): Runnable<BaseLanguageModelInput, { raw: BaseMessage; parsed: RunOutput }>;

  withStructuredOutput<
    RunOutput extends Record<string, any> = Record<string, any>
  >(
    outputSchema: InteropZodType<RunOutput> | Record<string, any>,
    config?: StructuredOutputMethodOptions<boolean>
  ):
    | Runnable<BaseLanguageModelInput, RunOutput>
    | Runnable<BaseLanguageModelInput, { raw: BaseMessage; parsed: RunOutput }>;
  override withStructuredOutput<
    RunOutput extends Record<string, any> = Record<string, any>
  >(
    outputSchema: InteropZodType<RunOutput> | Record<string, any>,
    config?: StructuredOutputMethodOptions<boolean>
  ):
    | Runnable<BaseLanguageModelInput, RunOutput>
    | Runnable<
        BaseLanguageModelInput,
        {
          raw: BaseMessage;
          parsed: RunOutput;
        }
      > {
    const schema = outputSchema;
    const name = config?.name;
    let method = config?.method;
    const includeRaw = config?.includeRaw;

    let llm: Runnable<BaseLanguageModelInput>;
    let outputParser: Runnable<AIMessageChunk, RunOutput>;

    if (config?.strict !== undefined && method === 'jsonMode') {
      throw new Error(
        "Argument 'strict' is not supported for 'method' = 'jsonMode'."
      );
    }

    // TODO: Remove this once the deprecated models are removed
    if (
      !this.modelName.startsWith('gpt-3') &&
      !this.modelName.startsWith('gpt-4-') &&
      this.modelName !== 'gpt-4'
    ) {
      if (method === undefined) {
        method = 'jsonSchema';
      }
    } else if (method === 'jsonSchema') {
      // Falling back to tool calling.`
      method = '';
    }

    if (method === 'jsonMode') {
      let outputFormatSchema: JsonSchema7Type | undefined;
      if (isInteropZodSchema(schema)) {
        outputParser = StructuredOutputParser.fromZodSchema(schema);
        outputFormatSchema = toJsonSchema(schema);
      } else {
        outputParser = new JsonOutputParser<RunOutput>();
      }
      llm = this.withConfig({
        response_format: { type: 'json_object' },
        ls_structured_output_format: {
          kwargs: { method: 'jsonMode' },
          schema: outputFormatSchema
        }
      } as Partial<AzureOpenAiChatCallOptions>);
    } else if (method === 'jsonSchema') {
      const asJsonSchema = toJsonSchema(schema);
      llm = this.withConfig({
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: name ?? 'extract',
            description: getSchemaDescription(schema),
            schema: asJsonSchema,
            strict: config?.strict
          }
        },
        ls_structured_output_format: {
          kwargs: { method: 'jsonSchema' },
          schema: asJsonSchema
        }
      } as Partial<AzureOpenAiChatCallOptions>);
      if (isInteropZodSchema(schema)) {
        const altParser = StructuredOutputParser.fromZodSchema(schema);
        outputParser = RunnableLambda.from<AIMessageChunk, RunOutput>(
          (aiMessage: AIMessageChunk) => {
            if ('parsed' in aiMessage.additional_kwargs) {
              return aiMessage.additional_kwargs.parsed as RunOutput;
            }
            return altParser;
          }
        );
      } else {
        outputParser = new JsonOutputParser<RunOutput>();
      }
    } else {
      let functionName = name ?? 'extract';
      // Is function calling
      if (isInteropZodSchema(schema)) {
        const asJsonSchema = toJsonSchema(schema);

        llm = this.withConfig({
          tools: [
            {
              type: 'function' as const,
              function: {
                name: functionName,
                description: asJsonSchema.description,
                parameters: asJsonSchema
              }
            }
          ],
          tool_choice: {
            type: 'function' as const,
            function: {
              name: functionName
            }
          },
          ls_structured_output_format: {
            kwargs: { method: 'functionCalling' },
            schema: asJsonSchema
          },
          // Do not pass `strict` argument to OpenAI if `config.strict` is undefined
          ...(config?.strict !== undefined ? { strict: config.strict } : {})
        } as Partial<AzureOpenAiChatCallOptions>);
        outputParser = new JsonOutputKeyToolsParser({
          returnSingle: true,
          keyName: functionName,
          zodSchema: schema
        });
      } else {
        let openAIFunctionDefinition: FunctionDefinition;
        if (
          typeof schema.name === 'string' &&
          typeof schema.parameters === 'object' &&
          schema.parameters != null
        ) {
          openAIFunctionDefinition = schema as FunctionDefinition;
          functionName = schema.name;
        } else {
          functionName = schema.title ?? functionName;
          openAIFunctionDefinition = {
            name: functionName,
            description: schema.description ?? '',
            parameters: schema
          };
        }
        llm = this.withConfig({
          tools: [
            {
              type: 'function',
              function: openAIFunctionDefinition
            }
          ],
          tool_choice: {
            type: 'function',
            function: {
              name: functionName
            }
          },
          ls_structured_output_format: {
            kwargs: { method: 'functionCalling' },
            schema: toJsonSchema(schema)
          },
          // Do not pass `strict` argument to OpenAI if `config.strict` is undefined
          ...(config?.strict !== undefined ? { strict: config.strict } : {})
        } as Partial<AzureOpenAiChatCallOptions>);
        outputParser = new JsonOutputKeyToolsParser<RunOutput>({
          returnSingle: true,
          keyName: functionName
        });
      }
    }

    if (!includeRaw) {
      return llm.pipe(outputParser) as Runnable<
        BaseLanguageModelInput,
        RunOutput
      >;
    }

    const parserAssign = RunnablePassthrough.assign({
      parsed: (input: any, parserConfig) =>
        outputParser.invoke(input.raw, parserConfig)
    });
    const parserNone = RunnablePassthrough.assign({
      parsed: () => null
    });
    const parsedWithFallback = parserAssign.withFallbacks({
      fallbacks: [parserNone]
    });
    return RunnableSequence.from<
      BaseLanguageModelInput,
      { raw: BaseMessage; parsed: RunOutput }
    >([{ raw: llm }, parsedWithFallback]);
  }

  /**
   * Stream response chunks from the Azure OpenAI client.
   * @param messages - The messages to send to the model.
   * @param options - The call options.
   * @param runManager - The callback manager for the run.
   * @returns An async generator of chat generation chunks.
   */
  override async *_streamResponseChunks(
    messages: BaseMessage[],
    options: typeof this.ParsedCallOptions,
    runManager?: CallbackManagerForLLMRun
  ): AsyncGenerator<ChatGenerationChunk> {
    const response = await this.caller.callWithOptions(
      {
        signal: options.signal
      },
      () => {
        const controller = new AbortController();
        if (options.signal) {
          options.signal.addEventListener('abort', () => controller.abort());
        }
        return this.openAiChatClient.stream(
          mapLangChainToAiClient(this, messages, options),
          controller,
          options.requestConfig
        );
      }
    );

    for await (const chunk of response.stream) {
      // There can be only none or one choice inside a chunk
      const choice = chunk.data.choices[0];

      // Map the chunk to a LangChain message chunk
      const messageChunk = mapAzureOpenAiChunkToLangChainMessageChunk(chunk);

      // Create initial generation info with token indices
      const newTokenIndices: NewTokenIndices = {
        prompt: options.promptIndex ?? 0,
        completion: choice?.index ?? 0
      };
      const generationInfo: Record<string, any> = { ...newTokenIndices };

      // Process finish reason
      if (choice?.finish_reason) {
        generationInfo.finish_reason = choice.finish_reason;
        // Only include system fingerprint in the last chunk for now to avoid concatenation issues
        generationInfo.system_fingerprint = chunk.data.system_fingerprint;
        generationInfo.model_name = chunk.data.model;
        generationInfo.id = chunk.data.id;
        generationInfo.created = chunk.data.created;
        generationInfo.index = choice.index;
      }

      // Process token usage
      const tokenUsage = chunk.getTokenUsage();
      if (tokenUsage) {
        generationInfo.token_usage = tokenUsage;
        messageChunk.usage_metadata = {
          input_tokens: tokenUsage.prompt_tokens,
          output_tokens: tokenUsage.completion_tokens,
          total_tokens: tokenUsage.total_tokens
        };
      }

      const content = chunk.getDeltaContent() ?? '';

      const generationChunk = new ChatGenerationChunk({
        message: messageChunk,
        text: content,
        generationInfo
      });

      // Notify the run manager about the new token
      // Some parameters(`_runId`, `_parentRunId`, `_tags`) are set as undefined as they are implicitly read from the context.
      await runManager?.handleLLMNewToken(
        content,
        newTokenIndices,
        undefined,
        undefined,
        undefined,
        { chunk: generationChunk }
      );

      yield generationChunk;
    }
  }
}
