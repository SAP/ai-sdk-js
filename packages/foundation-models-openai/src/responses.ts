import { Responses } from 'openai/resources/responses/responses';
import type { OpenAI } from 'openai';
import type {
  Response,
  ResponseStreamEvent,
  ResponseCreateParamsNonStreaming,
  ResponseCreateParamsStreaming,
  ResponseCreateParamsBase
} from 'openai/resources/responses/responses';
import type { Stream } from 'openai/streaming';
import type { APIPromise } from 'openai/api-promise';
import type { WithoutModel } from './completions.js';

type RequestOptions = Parameters<Responses['create']>[1];

/** Subclass of `Responses` exposing only `create`, with `model` pre-filled. Unsupported methods are marked `never`. */
export class SapResponses extends Responses {
  private readonly defaultModel: string | undefined;

  // Unsupported endpoints — SAP AI Core does not support these operations.
  override retrieve: never = null as never;
  override delete: never = null as never;
  override parse: never = null as never;
  override stream: never = null as never;
  override cancel: never = null as never;
  override compact: never = null as never;

  constructor(client: OpenAI, defaultModel?: string) {
    super(client);
    this.defaultModel = defaultModel;
  }

  create(
    body: WithoutModel<ResponseCreateParamsNonStreaming>,
    options?: RequestOptions
  ): APIPromise<Response>;
  create(
    body: WithoutModel<ResponseCreateParamsStreaming>,
    options?: RequestOptions
  ): APIPromise<Stream<ResponseStreamEvent>>;
  create(
    body: WithoutModel<ResponseCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<Response | Stream<ResponseStreamEvent>>;
  override create(
    body: WithoutModel<ResponseCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<Response | Stream<ResponseStreamEvent>> {
    return super.create(
      { model: this.defaultModel ?? '', ...body } as ResponseCreateParamsBase,
      options
    );
  }
}
