/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  AzureOpenAiCreateCompletionRequest,
  AzureOpenAiCreateCompletionResponse,
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiCreateChatCompletionResponse,
  AzureOpenAiCreateChatCompletionStreamResponse,
  AzureOpenAiAudioResponse,
  AzureOpenAiAudioVerboseResponse,
  AzureOpenAiImageGenerationsRequest,
  AzureOpenAiGenerateImagesResponse
} from './schema/index.js';
/**
 * Representation of the 'DefaultApi'.
 * This API is part of the 'inference' service.
 */
export const DefaultApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the '/deployments/{deploymentId}/completions' endpoint.
   * @param deploymentId - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: api-version.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  completionsCreate: (
    deploymentId: string,
    body: AzureOpenAiCreateCompletionRequest,
    queryParameters: { 'api-version': string }
  ) =>
    new OpenApiRequestBuilder<AzureOpenAiCreateCompletionResponse>(
      'post',
      '/deployments/{deploymentId}/completions',
      {
        pathParameters: { deploymentId },
        body,
        queryParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/deployments/{deploymentId}/embeddings' endpoint.
   * @param deploymentId - The deployment id of the model which was deployed.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: api-version.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  embeddingsCreate: (
    deploymentId: string,
    body: {
      /**
       * Input text to get embeddings for, encoded as a string. To get embeddings for multiple inputs in a single request, pass an array of strings. Each input must not exceed 2048 tokens in length.
       * Unless you are embedding code, we suggest replacing newlines (\n) in your input with a single space, as we have observed inferior results when newlines are present.
       */
      input: string | string[];
      /**
       * A unique identifier representing your end-user, which can help monitoring and detecting abuse.
       */
      user?: string;
      /**
       * input type of embedding search to use
       * @example "query"
       */
      input_type?: string;
      /**
       * The format to return the embeddings in. Can be either `float` or `base64`. Defaults to `float`.
       * @example "float"
       */
      encoding_format?: string | null;
      /**
       * The number of dimensions the resulting output embeddings should have. Only supported in `text-embedding-3` and later models.
       * @example 1
       */
      dimensions?: number | null;
    } & Record<string, any>,
    queryParameters: { 'api-version': string }
  ) =>
    new OpenApiRequestBuilder<
      {
        object: string;
        model: string;
        data: ({
          index: number;
          object: string;
          embedding: number[];
        } & Record<string, any>)[];
        usage: {
          prompt_tokens: number;
          total_tokens: number;
        } & Record<string, any>;
      } & Record<string, any>
    >(
      'post',
      '/deployments/{deploymentId}/embeddings',
      {
        pathParameters: { deploymentId },
        body,
        queryParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/deployments/{deploymentId}/chat/completions' endpoint.
   * @param deploymentId - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: api-version.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  chatCompletionsCreate: (
    deploymentId: string,
    body: AzureOpenAiCreateChatCompletionRequest,
    queryParameters: { 'api-version': string }
  ) =>
    new OpenApiRequestBuilder<
      | AzureOpenAiCreateChatCompletionResponse
      | AzureOpenAiCreateChatCompletionStreamResponse
    >(
      'post',
      '/deployments/{deploymentId}/chat/completions',
      {
        pathParameters: { deploymentId },
        body,
        queryParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/deployments/{deploymentId}/audio/transcriptions' endpoint.
   * @param deploymentId - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: api-version.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  transcriptionsCreate: (
    deploymentId: string,
    body: any,
    queryParameters: { 'api-version': string }
  ) =>
    new OpenApiRequestBuilder<
      AzureOpenAiAudioResponse | AzureOpenAiAudioVerboseResponse
    >(
      'post',
      '/deployments/{deploymentId}/audio/transcriptions',
      {
        pathParameters: { deploymentId },
        body,
        queryParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/deployments/{deploymentId}/audio/translations' endpoint.
   * @param deploymentId - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: api-version.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  translationsCreate: (
    deploymentId: string,
    body: any,
    queryParameters: { 'api-version': string }
  ) =>
    new OpenApiRequestBuilder<
      AzureOpenAiAudioResponse | AzureOpenAiAudioVerboseResponse
    >(
      'post',
      '/deployments/{deploymentId}/audio/translations',
      {
        pathParameters: { deploymentId },
        body,
        queryParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/deployments/{deploymentId}/images/generations' endpoint.
   * @param deploymentId - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: api-version.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  imageGenerationsCreate: (
    deploymentId: string,
    body: AzureOpenAiImageGenerationsRequest,
    queryParameters: { 'api-version': string }
  ) =>
    new OpenApiRequestBuilder<AzureOpenAiGenerateImagesResponse>(
      'post',
      '/deployments/{deploymentId}/images/generations',
      {
        pathParameters: { deploymentId },
        body,
        queryParameters
      },
      DefaultApi._defaultBasePath
    )
};
