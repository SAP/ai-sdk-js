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

/** Wraps `Responses` exposing only `create`, with `model` pre-filled. */
export class SapResponses {
  private readonly openAIResponses: Responses;
  private readonly defaultModel: string | undefined;

  constructor(client: OpenAI, defaultModel?: string) {
    this.openAIResponses = new Responses(client);
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
  create(
    body: WithoutModel<ResponseCreateParamsBase>,
    options?: RequestOptions
  ): APIPromise<Response | Stream<ResponseStreamEvent>> {
    return this.openAIResponses.create(
      { model: this.defaultModel ?? '', ...body } as ResponseCreateParamsBase,
      options
    );
  }
}
