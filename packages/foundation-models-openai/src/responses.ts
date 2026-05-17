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

/** Wraps `Responses` exposing only `create`, with `model` omitted from the public API as SAP AI Core routes requests via the deployment URL. */
export class SapResponses {
  private readonly openAIResponses: Responses;

  constructor(client: OpenAI) {
    this.openAIResponses = new Responses(client);
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
      // SAP AI Core routes via deployment URL; model is required by the SDK type but ignored by the API
      { model: '', ...body } as ResponseCreateParamsBase,
      options
    );
  }
}
