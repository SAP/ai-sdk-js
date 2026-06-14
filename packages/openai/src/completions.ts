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
  private readonly openAICompletions: Completions;

  constructor(client: OpenAI) {
    this.openAICompletions = new Completions(client);
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
        // SAP AI Core routes via deployment URL; model is required by the SDK type but ignored by the API
        model: '',
        ...body
      } satisfies ChatCompletionCreateParamsBase,
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
        // SAP AI Core routes via deployment URL; model is required by the SDK type but ignored by the API
        model: '',
        ...body
      } satisfies ChatCompletionCreateParamsNonStreaming,
      options
    ) as APIPromise<ParsedChatCompletion<ParsedT>>;
  }
}
