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

/** Removes the `model` field from request param types so callers don't need to supply it. */
export type WithoutModel<T> = Omit<T, 'model'>;

/** Subclass of `Completions` exposing only `create` and `parse`, with `model` pre-filled. Unsupported methods are marked `never`. */
export class SapCompletions extends Completions {
  private readonly defaultModel: string | undefined;

  // Unsupported endpoints — SAP AI Core does not support these operations.
  override messages: never = null as never;
  override retrieve: never = null as never;
  override update: never = null as never;
  override list: never = null as never;
  override delete: never = null as never;
  override runTools: never = null as never;
  override stream: never = null as never;

  constructor(client: OpenAI, defaultModel?: string) {
    super(client);
    this.defaultModel = defaultModel;
  }

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
  override create(
    body: WithoutModel<ChatCompletionCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<ChatCompletion | Stream<ChatCompletionChunk>> {
    return super.create(
      { model: this.defaultModel ?? '', ...body } as ChatCompletionCreateParamsBase,
      options
    );
  }

  override parse<
    Params extends WithoutModel<ChatCompletionCreateParamsNonStreaming>,
    ParsedT = ExtractParsedContentFromParams<Params & { model: string }>
  >(
    body: Params,
    options?: RequestOptions
  ): APIPromise<ParsedChatCompletion<ParsedT>> {
    return super.parse(
      { model: this.defaultModel ?? '', ...body } as ChatCompletionCreateParamsNonStreaming,
      options
    ) as APIPromise<ParsedChatCompletion<ParsedT>>;
  }
}
