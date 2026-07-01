import { Responses } from 'openai/resources/responses/responses';
import type { AzureOpenAiResponsesModel } from '@sap-ai-sdk/core';
import type { OpenAI } from 'openai';
import type {
  Response,
  ResponseStreamEvent,
  ResponseCreateParamsNonStreaming,
  ResponseCreateParamsStreaming,
  ResponseCreateParamsBase,
  ParsedResponse
} from 'openai/resources/responses/responses';
import type {
  ExtractParsedContentFromParams,
  ResponseCreateParamsWithTools
} from 'openai/lib/ResponsesParser';
import type { Stream } from 'openai/streaming';
import type { APIPromise } from 'openai/api-promise';
import type { WithOptionalModel } from './types.js';

type RequestOptions = Parameters<Responses['create']>[1];

/**
 * Wraps `Responses` exposing only `create` and `parse`, with `model` omitted from the public API as SAP AI Core routes requests via the deployment URL.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapResponses {
  private readonly openAiResponses: Responses;

  /** @internal */
  constructor(client: OpenAI) {
    this.openAiResponses = new Responses(client);
  }

  /**
   * Creates a model response request. The `model` field is omitted — SAP AI Core routes requests via the deployment URL.
   * @param body - Response request parameters, without `model`.
   * @param options - Optional request options.
   * @returns A promise resolving to a {@link Response}, or a {@link Stream} of {@link ResponseStreamEvent} when `stream: true` is set.
   */
  create(
    body: WithOptionalModel<
      ResponseCreateParamsNonStreaming,
      AzureOpenAiResponsesModel
    >,
    options?: RequestOptions
  ): APIPromise<Response>;
  create(
    body: WithOptionalModel<
      ResponseCreateParamsStreaming,
      AzureOpenAiResponsesModel
    >,
    options?: RequestOptions
  ): APIPromise<Stream<ResponseStreamEvent>>;
  create(
    body: WithOptionalModel<
      ResponseCreateParamsBase,
      AzureOpenAiResponsesModel
    >,
    options?: RequestOptions
  ): APIPromise<Response | Stream<ResponseStreamEvent>> {
    return this.openAiResponses.create(
      body satisfies ResponseCreateParamsBase,
      options
    );
  }

  /**
   * Creates a model response request and parses the output into the provided schema.
   * The `model` field is omitted — SAP AI Core routes requests via the deployment URL.
   * @param body - Response request parameters including tool or schema definitions, without `model`.
   * @param options - Optional request options.
   * @returns A promise resolving to a {@link ParsedResponse} with the parsed output.
   */
  parse<
    Params extends WithOptionalModel<ResponseCreateParamsWithTools>,
    ParsedT = ExtractParsedContentFromParams<Params & { model: string }>
  >(
    body: Params,
    options?: RequestOptions
  ): APIPromise<ParsedResponse<ParsedT>> {
    return this.openAiResponses.parse(
      {
        ...body,
        // SAP AI Core routes via deployment URL; model is required by the OpenAI SDK type but ignored by the API
        model: body.model || ''
      } satisfies ResponseCreateParamsWithTools,
      options
    ) as APIPromise<ParsedResponse<ParsedT>>;
  }
}
