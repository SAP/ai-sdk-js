import { Completions } from 'openai/resources/chat/completions/completions';
import type { AzureOpenAiChatModel } from '@sap-ai-sdk/core';
import type { OpenAI } from 'openai';
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionCreateParamsBase,
  ChatCompletionParseParams,
  ParsedChatCompletion
} from 'openai/resources/chat/completions/completions';
import type { ExtractParsedContentFromParams } from 'openai/lib/parser';
import type { Stream } from 'openai/streaming';
import type { APIPromise } from 'openai/api-promise';
import type { WithOptionalModel } from './types.ts';

type RequestOptions = Parameters<Completions['create']>[1];

/**
 * Wraps `Completions` exposing only `create` and `parse`, with `model` omitted from the public API as SAP AI Core routes requests via the deployment URL.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapCompletions {
  private readonly openAiCompletions: Completions;

  /** @internal */
  constructor(client: OpenAI) {
    this.openAiCompletions = new Completions(client);
  }

  /**
   * Creates a chat completion request. The `model` field is omitted — SAP AI Core routes requests via the deployment URL.
   * @param body - Chat completion request parameters.
   * @param options - Optional request options.
   * @returns A promise resolving to a {@link ChatCompletion}, or a {@link Stream} of {@link ChatCompletionChunk} when `stream: true` is set.
   */
  create(
    body: WithOptionalModel<
      ChatCompletionCreateParamsNonStreaming,
      AzureOpenAiChatModel
    >,
    options?: RequestOptions
  ): APIPromise<ChatCompletion>;
  create(
    body: WithOptionalModel<
      ChatCompletionCreateParamsStreaming,
      AzureOpenAiChatModel
    >,
    options?: RequestOptions
  ): APIPromise<Stream<ChatCompletionChunk>>;
  create(
    body: WithOptionalModel<
      ChatCompletionCreateParamsBase,
      AzureOpenAiChatModel
    >,
    options?: RequestOptions
  ): APIPromise<ChatCompletion | Stream<ChatCompletionChunk>> {
    return this.openAiCompletions.create(
      {
        ...body,
        // SAP AI Core routes via deployment URL; model is required by the OpenAI SDK type but ignored by the API
        model: body.model as any
      } satisfies ChatCompletionCreateParamsBase,
      options
    );
  }

  /**
   * Creates a chat completion and parses the response content into the provided `response_format` schema.
   * The `model` field is omitted — SAP AI Core routes requests via the deployment URL.
   * @param body - Chat completion request parameters including a `response_format` schema.
   * @param options - Optional request options.
   * @returns A promise resolving to a {@link ParsedChatCompletion} with the parsed response content.
   */
  parse<
    Params extends WithOptionalModel<ChatCompletionParseParams>,
    ParsedT = ExtractParsedContentFromParams<Params & { model: string }>
  >(
    body: Params,
    options?: RequestOptions
  ): APIPromise<ParsedChatCompletion<ParsedT>> {
    return this.openAiCompletions.parse(
      {
        ...body,
        // SAP AI Core routes via deployment URL; model is required by the OpenAI SDK type but ignored by the API
        model: body.model as any
      } satisfies ChatCompletionCreateParamsNonStreaming,
      options
    ) as APIPromise<ParsedChatCompletion<ParsedT>>;
  }
}
