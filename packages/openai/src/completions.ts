import { Completions } from 'openai/resources/chat/completions/completions';
import type { OpenAI } from 'openai';
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionCreateParamsBase,
  ParsedChatCompletion
} from 'openai/resources/chat/completions/completions';
import type { ExtractParsedContentFromParams } from 'openai/lib/parser';
import type { Stream } from 'openai/streaming';
import type { APIPromise } from 'openai/api-promise';

type RequestOptions = Parameters<Completions['create']>[1];

/**
 * Removes the `model` field from request param types so callers won't be able to supply it.
 * @internal
 */
export type WithoutModel<T> = Omit<T, 'model'>;

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
   * @param body - Chat completion request parameters, without `model`.
   * @param options - Optional request options.
   * @returns A promise resolving to a {@link ChatCompletion}, or a {@link Stream} of {@link ChatCompletionChunk} when `stream: true` is set.
   */
  create(
    body: WithoutModel<ChatCompletionCreateParamsNonStreaming>,
    options?: RequestOptions
  ): APIPromise<ChatCompletion>;
  create(
    body: WithoutModel<ChatCompletionCreateParamsStreaming>,
    options?: RequestOptions
  ): APIPromise<Stream<ChatCompletionChunk>>;
  create(
    body: WithoutModel<ChatCompletionCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<ChatCompletion | Stream<ChatCompletionChunk>>;
  create(
    body: WithoutModel<ChatCompletionCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<ChatCompletion | Stream<ChatCompletionChunk>> {
    return this.openAiCompletions.create(
      {
        // SAP AI Core routes via deployment URL; model is required by the SDK type but ignored by the API
        model: '',
        ...body
      } satisfies ChatCompletionCreateParamsBase,
      options
    );
  }

  /**
   * Creates a chat completion and parses the response content into the provided `response_format` schema.
   * The `model` field is omitted — SAP AI Core routes requests via the deployment URL.
   * @param body - Chat completion request parameters including a `response_format` schema, without `model`.
   * @param options - Optional request options.
   * @returns A promise resolving to a {@link ParsedChatCompletion} with the parsed response content.
   */
  parse<
    Params extends WithoutModel<ChatCompletionCreateParamsNonStreaming>,
    ParsedT = ExtractParsedContentFromParams<Params & { model: string }>
  >(
    body: Params,
    options?: RequestOptions
  ): APIPromise<ParsedChatCompletion<ParsedT>> {
    return this.openAiCompletions.parse(
      {
        // SAP AI Core routes via deployment URL; model is required by the SDK type but ignored by the API
        model: '',
        ...body
      } satisfies ChatCompletionCreateParamsNonStreaming,
      options
    ) as APIPromise<ParsedChatCompletion<ParsedT>>;
  }
}
