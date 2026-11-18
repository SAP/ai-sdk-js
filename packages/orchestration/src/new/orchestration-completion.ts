import { getOrchestrationDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { executeRequest } from '@sap-ai-sdk/core';
import { createLogger } from '@sap-cloud-sdk/util';

import { OrchestrationResponse } from '../orchestration-response.ts';
import { OrchestrationStreamResponse } from '../orchestration-stream-response.ts';
import { OrchestrationStream } from '../orchestration-stream.ts';
import { isConfigReference } from '../orchestration-types.ts';
import {
  parseTemplatingModule,
  parseModuleConfigList,
  validateJsonConfig,
  hasStandingPrompt
} from '../util/parse-config.ts';
import {
  OrchestrationConfigBuilder,
  OrchestrationConfigWithTemplateBuilder,
  OrchestrationRawConfigJsonBuilder
} from './builders/index.ts';

import type {
  DeploymentIdConfig,
  ResourceGroupConfig
} from '@sap-ai-sdk/ai-api/internal.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

import type { CompletionPostRequest } from '../client/api/schema/index.ts';
import type { OrchestrationStreamChunkResponse } from '../orchestration-stream-chunk-response.ts';
import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from '../orchestration-streaming-types.ts';
import type {
  OrchestrationConfigWithoutTemplate,
  OrchestrationConfigWithTemplate,
  OrchestrationConfigRefById,
  OrchestrationConfigRefByName,
  OrchestrationModuleConfigList,
  OrchestrationCreateOptions,
  OrchestrationCreateOptionsWithPrompt,
  OrchestrationCreateRequestConfig
} from '../orchestration-types.ts';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration'
});

/**
 * Connection information for a completion client: a {@link ResourceGroupConfig} or {@link DeploymentIdConfig} to scope the deployment, optionally with a `destination`.
 */
type CompletionApiOptions = (ResourceGroupConfig | DeploymentIdConfig) & {
  destination?: HttpDestinationOrFetchOptions;
};

/**
 * The `stream` field in its streaming form: `true`, `{ enabled: true }`, or a stream-options object. Narrows a merged `create` call to a streaming response.
 */
interface StreamEnabledField {
  stream:
    | true
    | { enabled: true }
    | (Omit<NewStreamOptionsWithoutFallbacks, 'enabled'> & {
        enabled?: true | undefined;
      })
    | (Omit<NewStreamOptionsWithFallbacks, 'enabled'> & {
        enabled?: true | undefined;
      });
}

/**
 * The `stream` field in its non-streaming form: omitted, `false`, or `{ enabled: false }`. Narrows a merged `create` call to a single response.
 */
interface StreamDisabledField {
  stream?: false | { enabled: false | undefined };
}

/**
 * Merged `create` source whose prompt is fixed by the configuration, so no per-call `prompt` is accepted.
 * A module configuration with a standing prompt or a fallback list goes under `modules`; a stored configuration reference passes its fields (`id`, or `scenario`/`name`/`version`) directly.
 */
type CreateSourceWithoutPrompt =
  | { modules: OrchestrationConfigWithTemplate }
  | { modules: OrchestrationModuleConfigList }
  | OrchestrationConfigRefById
  | OrchestrationConfigRefByName;

/**
 * Completion API for the SAP AI Core Orchestration Service that exposes a fluent builder API.
 * Call it directly to select a configuration source by shape, or call one of its `use*` methods to select a source explicitly, then call `create` on the returned builder.
 * @experimental This API is experimental and may change at any time without prior notice.
 */
export interface CompletionApi {
  /* oxlint-disable typescript/unified-signatures -- separate call signatures improve discoverability and per-variant JSDoc */
  /**
   * Select an inline module configuration without a standing prompt as the source for a request.
   * The returned builder's `create` accepts a per-call `prompt`, because an inline template is the only source that can be extended at request time.
   * @experimental This signature is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration without a standing prompt. The prompt is supplied per call through `create({ prompt })`.
   * @returns A builder whose `create` sends the request.
   */
  (config: OrchestrationConfigWithoutTemplate): OrchestrationConfigBuilder;
  /**
   * Select a module configuration whose standing prompt is an inline template or a remote prompt-registry template reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the messages are fixed in the configuration.
   * @experimental This signature is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration whose `promptTemplating.prompt` is an inline template or a `TemplateRef`.
   * @returns A builder whose `create` sends the request.
   */
  (
    config: OrchestrationConfigWithTemplate
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a stored configuration reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the template is defined remotely and cannot be extended inline.
   * @experimental This signature is experimental and may change at any time without prior notice.
   * @param config - A reference to a stored configuration by `id`, or by `scenario`, `name`, and `version`.
   * @returns A builder whose `create` sends the request.
   */
  (
    config: OrchestrationConfigRefById | OrchestrationConfigRefByName
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a fallback list of module configurations as the source for a request.
   * The orchestration service tries each configuration in order until one succeeds.
   * The returned builder's `create` omits `prompt`, because each configuration carries its own prompt.
   * @experimental This signature is experimental and may change at any time without prior notice.
   * @param config - A non-empty list of orchestration module configurations.
   * @returns A builder whose `create` sends the request.
   */
  (
    config: OrchestrationModuleConfigList
  ): OrchestrationConfigWithTemplateBuilder;
  /* oxlint-enable typescript/unified-signatures */

  /**
   * Select an inline module configuration without a standing prompt as the source for a request.
   * The returned builder's `create` accepts a per-call `prompt`, because an inline template is the only source that can be extended at request time.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration without a standing prompt. The prompt is supplied per call through `create({ prompt })`.
   * @returns A builder whose `create` sends the request.
   */
  useConfigWithoutTemplate(
    config: OrchestrationConfigWithoutTemplate
  ): OrchestrationConfigBuilder;
  /**
   * Select a module configuration whose standing prompt is an inline template or a remote prompt-registry template reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the messages are fixed in the configuration.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration whose `promptTemplating.prompt` is an inline template or a `TemplateRef`.
   * @returns A builder whose `create` sends the request.
   */
  useConfigWithTemplate(
    config: OrchestrationConfigWithTemplate
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a fallback list of module configurations as the source for a request.
   * The orchestration service tries each configuration in order until one succeeds.
   * The returned builder's `create` omits `prompt`, because each configuration carries its own prompt.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A non-empty list of orchestration module configurations.
   * @returns A builder whose `create` sends the request.
   */
  useFallbacks(
    config: OrchestrationModuleConfigList
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a stored configuration reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the template is defined remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A reference to a stored configuration by `id`, or by `scenario`, `name`, and `version`.
   * @returns A builder whose `create` sends the request.
   */
  useConfigReference(
    config: OrchestrationConfigRefById | OrchestrationConfigRefByName
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a JSON string configuration (exported from AI Launchpad) as the source for a request.
   * The returned builder's `create` omits `prompt`, because the configuration already specifies everything.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param json - A JSON string in the orchestration wire schema.
   * @returns A builder whose `create` sends the request.
   */
  useRawJsonConfig(json: string): OrchestrationRawConfigJsonBuilder;

  /**
   * Select a configuration source and send the request in a single call, merging the configuration with the per-call inputs.
   * Nest a module configuration (or a fallback list) under `modules`; pass a stored configuration reference's fields (`id`, or `scenario`/`name`/`version`) directly. Add `prompt`, `messagesHistory`, `placeholderValues`, and `stream` alongside.
   * This is the one-call form of `completion(config).create(options)`. A per-call `prompt` is accepted only for an inline module configuration without a standing prompt, the only source whose template can be extended at request time.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - A configuration source — an inline module configuration without a standing prompt under `modules` (with an optional per-call `prompt`), a module configuration with a standing prompt or a fallback list under `modules`, or a stored configuration reference's fields directly — merged with the per-call inputs. `stream` is set, so the response is streamed.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: (
      | ({ modules: OrchestrationConfigWithoutTemplate } & OrchestrationCreateOptionsWithPrompt)
      | (CreateSourceWithoutPrompt & OrchestrationCreateOptions)
    ) &
      StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Select a configuration source and send the request in a single call, merging the configuration with the per-call inputs.
   * Nest a module configuration (or a fallback list) under `modules`; pass a stored configuration reference's fields (`id`, or `scenario`/`name`/`version`) directly. Add `prompt`, `messagesHistory`, and `placeholderValues` alongside.
   * This is the one-call form of `completion(config).create(options)`. A per-call `prompt` is accepted only for an inline module configuration without a standing prompt, the only source whose template can be extended at request time.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - A configuration source — an inline module configuration without a standing prompt under `modules` (with an optional per-call `prompt`), a module configuration with a standing prompt or a fallback list under `modules`, or a stored configuration reference's fields directly — merged with the per-call inputs.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body?: (
      | ({ modules: OrchestrationConfigWithoutTemplate } & OrchestrationCreateOptionsWithPrompt)
      | (CreateSourceWithoutPrompt & OrchestrationCreateOptions)
    ) &
      StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;

  /**
   * Send a pre-built completion request body to the orchestration service.
   * This is the low-level transport beneath the builder API: the builders returned by the call signatures and the `use*` methods assemble a body and route it through here. Call it directly only when you already hold a complete {@link CompletionPostRequest} wire body, or its JSON serialization as a string.
   * Pass the body as an object, or as a JSON string that is parsed and sent as-is.
   * Streaming is driven by the body itself — set `config.stream.enabled` to `true` to stream the response. The return type is the union of both outcomes; narrow it with `instanceof`, or use a builder's `create` for a statically typed result.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - A complete completion request body, or a JSON string that parses into one. Set `config.stream.enabled` to `true` to stream the response.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response when the body enables streaming, otherwise a non-streaming response.
   */
  post(
    body: CompletionPostRequest | string,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  >;
}

/**
 * Resolve the deployment, send a pre-built completion request body, and log fallback usage.
 * @param options - Connection information used to resolve the deployment.
 * @param body - The completion post request body.
 * @param requestConfig - Custom request configuration.
 * @returns The raw HTTP response.
 */
async function sendCompletionRequest(
  options: CompletionApiOptions,
  body: Record<string, any>,
  requestConfig?: OrchestrationCreateRequestConfig
): Promise<HttpResponse> {
  const { destination, ...deploymentConfig } = options;
  const deploymentId = await getOrchestrationDeploymentId(
    deploymentConfig,
    destination
  );

  if (!deploymentId) {
    throw new Error('Failed to resolve deployment ID');
  }

  const response = await executeRequest(
    {
      url: `/inference/deployments/${deploymentId}/v2/completion`,
      ...deploymentConfig
    },
    body,
    requestConfig,
    destination
  );

  // Log summary when fallbacks were used
  if (response.data?.intermediate_failures) {
    const failureCount = response.data.intermediate_failures.length;
    const successModel = response.data.final_result?.model;
    logger.info(
      `Orchestration used ${failureCount} fallback(s) before success${successModel ? `. Succeeded with model: ${successModel}` : ''}.`
    );
  }

  return response;
}

/**
 * Wire a raw streaming HTTP response into an {@link OrchestrationStreamResponse}.
 * @param streamResponse - The raw streaming HTTP response.
 * @param controller - The abort controller tied to the stream.
 * @returns The orchestration stream response.
 */
function createStreamFromResponse(
  streamResponse: HttpResponse,
  controller: AbortController
): OrchestrationStreamResponse<OrchestrationStreamChunkResponse> {
  const response =
    new OrchestrationStreamResponse<OrchestrationStreamChunkResponse>(
      streamResponse
    );

  const stream = OrchestrationStream._create(streamResponse, controller);
  response.stream = stream
    ._pipe(OrchestrationStream._processChunk)
    ._pipe(
      OrchestrationStream._processOrchestrationStreamChunkResponse,
      response
    )
    ._pipe(OrchestrationStream._processStreamEnd, response);

  return response;
}

/**
 * Create a completion API for the SAP AI Core Orchestration Service.
 * The returned value is both callable — pass a configuration source and it selects a builder by shape — and carries `use*` methods that select a source explicitly.
 * @experimental This function is experimental and may change at any time without prior notice.
 * @param options - Connection information: a {@link ResourceGroupConfig} or {@link DeploymentIdConfig} to scope the deployment, or a `{ destination }` object. Omit to resolve the deployment from the default resource group.
 * @returns A callable completion API.
 */
export function createCompletionApi(
  options: CompletionApiOptions = {}
): CompletionApi {
  const completion = ((
    config:
      | OrchestrationConfigWithoutTemplate
      | OrchestrationConfigWithTemplate
      | OrchestrationConfigRefById
      | OrchestrationConfigRefByName
      | OrchestrationModuleConfigList
  ) => {
    if (isConfigReference(config)) {
      return completion.useConfigReference(config);
    }

    if (Array.isArray(config)) {
      return completion.useFallbacks(config);
    }

    if (hasStandingPrompt(config)) {
      return completion.useConfigWithTemplate(config);
    }

    return completion.useConfigWithoutTemplate(config);
  }) as CompletionApi;

  completion.useConfigWithoutTemplate = (
    config: OrchestrationConfigWithoutTemplate
  ): OrchestrationConfigBuilder =>
    new OrchestrationConfigBuilder(config, completion);

  completion.useConfigWithTemplate = (
    config: OrchestrationConfigWithTemplate
  ): OrchestrationConfigWithTemplateBuilder =>
    new OrchestrationConfigWithTemplateBuilder(
      parseTemplatingModule(config),
      completion
    );

  completion.useFallbacks = (
    config: OrchestrationModuleConfigList
  ): OrchestrationConfigWithTemplateBuilder =>
    new OrchestrationConfigWithTemplateBuilder(
      parseModuleConfigList(config),
      completion
    );

  completion.useConfigReference = (
    config: OrchestrationConfigRefById | OrchestrationConfigRefByName
  ): OrchestrationConfigWithTemplateBuilder =>
    new OrchestrationConfigWithTemplateBuilder(config, completion);

  completion.useRawJsonConfig = (
    json: string
  ): OrchestrationRawConfigJsonBuilder => {
    validateJsonConfig(json);
    return new OrchestrationRawConfigJsonBuilder(json, completion);
  };

  completion.create = ((
    body: any,
    requestConfig?: OrchestrationCreateRequestConfig
  ) => {
    if ('modules' in body) {
      const { modules, ...createOptions } = body;
      if (Array.isArray(modules)) {
        return completion
          .useFallbacks(modules as OrchestrationModuleConfigList)
          .create(createOptions, requestConfig);
      }
      if (hasStandingPrompt(modules)) {
        return completion
          .useConfigWithTemplate(modules)
          .create(createOptions, requestConfig);
      }
      return completion
        .useConfigWithoutTemplate(modules)
        .create(createOptions, requestConfig);
    }

    const { messagesHistory, placeholderValues, stream, ...configRef } = body;
    return completion
      .useConfigReference(configRef)
      .create({ messagesHistory, placeholderValues, stream }, requestConfig);
  }) as CompletionApi['create'];

  completion.post = async (
    body: CompletionPostRequest | string,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > => {
    let requestBody: CompletionPostRequest;
    if (typeof body === 'string') {
      validateJsonConfig(body);
      requestBody = JSON.parse(body) as CompletionPostRequest;
    } else {
      requestBody = body;
    }

    const streaming = requestBody.config?.stream?.enabled === true;

    if (!streaming) {
      requestConfig?.signal?.throwIfAborted();
      const response = await sendCompletionRequest(
        options,
        requestBody,
        requestConfig
      );
      return new OrchestrationResponse(response);
    }

    const controller = new AbortController();
    const signal = requestConfig?.signal;
    if (signal) {
      signal.throwIfAborted();
      signal.addEventListener('abort', () => {
        controller.abort();
      });
    }

    try {
      const streamResponse = await sendCompletionRequest(options, requestBody, {
        ...requestConfig,
        responseType: 'stream',
        signal: controller.signal
      });
      return createStreamFromResponse(streamResponse, controller);
    } catch (error) {
      controller.abort();
      throw error;
    }
  };

  return completion;
}
