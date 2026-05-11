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
 * Removes the `model` field from request param types so callers don't need to supply it.
 * @internal
 */
export type WithoutModel<T> = Omit<T, 'model'>;

/** Wraps `Completions` exposing only `create` and `parse`, with `model` pre-filled. */
export class SapCompletions {
  private readonly openAICompletions: Completions;
  private readonly defaultModel: string | undefined;

  constructor(client: OpenAI, defaultModel?: string) {
    this.openAICompletions = new Completions(client);
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
  create(
    body: WithoutModel<ChatCompletionCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<ChatCompletion | Stream<ChatCompletionChunk>> {
    return this.openAICompletions.create(
      {
        model: this.defaultModel ?? '',
        ...body
      } as ChatCompletionCreateParamsBase,
      options
    );
  }

  parse<
    Params extends WithoutModel<ChatCompletionCreateParamsNonStreaming>,
    ParsedT = ExtractParsedContentFromParams<Params & { model: string }>
  >(
    body: Params,
    options?: RequestOptions
  ): APIPromise<ParsedChatCompletion<ParsedT>> {
    return this.openAICompletions.parse(
      {
        model: this.defaultModel ?? '',
        ...body
      } as ChatCompletionCreateParamsNonStreaming,
      options
    ) as APIPromise<ParsedChatCompletion<ParsedT>>;
  }
}
