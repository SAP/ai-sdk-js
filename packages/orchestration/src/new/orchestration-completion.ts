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
  validateJsonConfig
} from '../util/parse-config.ts';
import {
  buildFallbackChainPostRequest,
  buildSingleCompletionPostRequest
} from './builders/completion-request-helpers.ts';
import {
  OrchestrationConfigBuilder,
  OrchestrationConfigWithTemplateBuilder,
  OrchestrationRawConfigJsonBuilder,
  OrchestrationFallbacksBuilder,
  OrchestrationModulesBuilder
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
  OrchestrationConfigWithoutTemplate,
  OrchestrationConfigWithTemplate,
  OrchestrationConfigRefById,
  OrchestrationConfigRefByName,
  OrchestrationModuleConfigList,
  OrchestrationCreateRequestConfig
} from '../orchestration-types.ts';
import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from './orchestration-streaming-types.ts';
import type {
  OrchestrationCompletionConfig,
  OrchestrationCompletionConfigList,
  OrchestrationCompletionCreateFallbacksOptions,
  OrchestrationCompletionCreateOptions,
  OrchestrationCompletionCreateOptionsWithMessages,
  OrchestrationCompletionCreateOptionsWithTemplateRef
} from './orchestration-types.ts';

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
 * The `stream` field in its streaming form: `true`, `{ enabled: true }`, or a stream-options object.
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
 * The `stream` field in its non-streaming form: omitted, `false`, or `{ enabled: false }`.
 */
interface StreamDisabledField {
  stream?: false | { enabled: false | undefined };
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
 * Completion API for the SAP AI Core Orchestration Service that exposes a fluent builder API.
 * Call {@link withModules} to carry the non-prompt orchestration modules, or one of the `use*` methods to select a configuration source explicitly, then call `create` on the returned builder.
 * The prompt-templating pieces (`model`, `prompt`, `messages`) are supplied per call through `create`.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class CompletionApi {
  private options: CompletionApiOptions;
  private modules: OrchestrationCompletionConfig;

  /**
   * Creates a completion API for the SAP AI Core Orchestration Service.
   * @param options - Connection information: a {@link ResourceGroupConfig} or {@link DeploymentIdConfig} to scope the deployment, or a `{ destination }` object. Omit to resolve the deployment from the default resource group.
   * @param modules - The non-prompt orchestration modules carried into `create`. Defaults to an empty object.
   */
  constructor(
    options: CompletionApiOptions = {},
    modules: OrchestrationCompletionConfig = {}
  ) {
    this.options = options;
    this.modules = modules;
  }

  /**
   * Select a single completion configuration carrying only the non-prompt orchestration modules (`filtering`, `masking`, `grounding`, `translation`).
   * The returned builder's `create` supplies the prompt-templating pieces for one request: `model` (required), `messages` (inline) or `template_ref` (a remote reference), plus `messagesHistory`, `placeholderValues`, and streaming options. It accepts a single request only — not a fallback list.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - The non-prompt orchestration modules. Pass an empty object (or omit) for a model-only request.
   * @returns A builder whose `create` sends a single request.
   */
  withModules(
    config?: OrchestrationCompletionConfig
  ): OrchestrationModulesBuilder;
  /**
   * Select a stored configuration reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the template is defined remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A reference to a stored configuration by `id`, or by `scenario`, `name`, and `version`.
   * @returns A builder whose `create` sends the request.
   */
  withModules(
    config: OrchestrationConfigRefById | OrchestrationConfigRefByName
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a fallback list of prompt-less module configurations as the source for a request.
   * The orchestration service tries each configuration in order until one succeeds.
   * The returned builder's `create` supplies each fallback's prompt-templating pieces positionally through a per-fallback entries array.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A non-empty list of prompt-less orchestration module configurations.
   * @returns A builder whose `create` sends the request.
   */
  withModules(
    config: OrchestrationCompletionConfigList
  ): OrchestrationFallbacksBuilder;
  withModules(
    config:
      | OrchestrationCompletionConfig
      | OrchestrationCompletionConfigList
      | OrchestrationConfigRefById
      | OrchestrationConfigRefByName = {}
  ):
    | OrchestrationModulesBuilder
    | OrchestrationFallbacksBuilder
    | OrchestrationConfigWithTemplateBuilder {
    if (Array.isArray(config)) {
      return new OrchestrationFallbacksBuilder(config, this);
    }
    // `isConfigReference` only inspects `id` / `scenario`+`name`+`version`, so a
    // prompt-less `OrchestrationCompletionConfig` is a safe input. Widen to the
    // guard's parameter union up front so its predicate narrows `config` for
    // both branches below.
    const singleConfig = config as
      | OrchestrationCompletionConfig
      | OrchestrationConfigRefById
      | OrchestrationConfigRefByName;
    if (
      isConfigReference(
        singleConfig as
          | OrchestrationConfigRefById
          | OrchestrationConfigRefByName
      )
    ) {
      return this.useConfigReference(
        singleConfig as
          | OrchestrationConfigRefById
          | OrchestrationConfigRefByName
      );
    }
    return new OrchestrationModulesBuilder(
      singleConfig as OrchestrationCompletionConfig,
      this
    );
  }

  /**
   * Select an inline module configuration without a standing prompt as the source for a request.
   * The returned builder's `create` accepts a per-call `prompt`, because an inline template is the only source that can be extended at request time.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration without a standing prompt. The prompt is supplied per call through `create({ prompt })`.
   * @returns A builder whose `create` sends the request.
   */
  useConfigWithoutTemplate(
    config: OrchestrationConfigWithoutTemplate
  ): OrchestrationConfigBuilder {
    return new OrchestrationConfigBuilder(config, this);
  }

  /**
   * Select a module configuration whose standing prompt is an inline template or a remote prompt-registry template reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the messages are fixed in the configuration.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration whose `promptTemplating.prompt` is an inline template or a `TemplateRef`.
   * @returns A builder whose `create` sends the request.
   */
  useConfigWithTemplate(
    config: OrchestrationConfigWithTemplate
  ): OrchestrationConfigWithTemplateBuilder {
    return new OrchestrationConfigWithTemplateBuilder(
      parseTemplatingModule(config),
      this
    );
  }

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
  ): OrchestrationConfigWithTemplateBuilder {
    return new OrchestrationConfigWithTemplateBuilder(
      parseModuleConfigList(config),
      this
    );
  }

  /**
   * Select a stored configuration reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the template is defined remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A reference to a stored configuration by `id`, or by `scenario`, `name`, and `version`.
   * @returns A builder whose `create` sends the request.
   */
  useConfigReference(
    config: OrchestrationConfigRefById | OrchestrationConfigRefByName
  ): OrchestrationConfigWithTemplateBuilder {
    return new OrchestrationConfigWithTemplateBuilder(config, this);
  }

  /**
   * Select a JSON string configuration (exported from AI Launchpad) as the source for a request.
   * The returned builder's `create` omits `prompt`, because the configuration already specifies everything.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param json - A JSON string in the orchestration wire schema.
   * @returns A builder whose `create` sends the request.
   */
  useRawJsonConfig(json: string): OrchestrationRawConfigJsonBuilder {
    validateJsonConfig(json);
    return new OrchestrationRawConfigJsonBuilder(json, this);
  }

  /**
   * Send a single request, supplying the prompt inline through `messages`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `model` (required), `messages`, optional `prompt` options, `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithMessages & StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Send a single request, supplying the prompt inline through `messages`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `model` (required), `messages`, optional `prompt` options, `messagesHistory`, and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithMessages &
      StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  /**
   * Send a single request, referencing a remote prompt-registry template through `template_ref`.
   * `messages` is not accepted, because the template lives remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `model` (required), `template_ref`, `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithTemplateRef &
      StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Send a single request, referencing a remote prompt-registry template through `template_ref`.
   * `messages` is not accepted, because the template lives remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `model` (required), `template_ref`, `messagesHistory`, and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithTemplateRef &
      StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  /**
   * Send a fallback-chain request: the shared modules fanned over several prompt entries under `fallbacks`, tried in order until one succeeds.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - `fallbacks` (the per-fallback `model` and prompt pieces), plus request-global `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: OrchestrationCompletionCreateFallbacksOptions & StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Send a fallback-chain request: the shared modules fanned over several prompt entries under `fallbacks`, tried in order until one succeeds.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - `fallbacks` (the per-fallback `model` and prompt pieces), plus request-global `messagesHistory` and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body: OrchestrationCompletionCreateFallbacksOptions & StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  create(
    body: (
      | OrchestrationCompletionCreateOptions
      | OrchestrationCompletionCreateFallbacksOptions
    ) & {
      stream?:
        | boolean
        | { enabled?: boolean }
        | NewStreamOptionsWithoutFallbacks
        | NewStreamOptionsWithFallbacks;
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > {
    const postRequest =
      'fallbacks' in body
        ? buildFallbackChainPostRequest(
            this.modules,
            body.fallbacks,
            {
              messagesHistory: body.messagesHistory,
              placeholderValues: body.placeholderValues
            },
            body.stream
          )
        : buildSingleCompletionPostRequest(this.modules, body);
    return this.post(postRequest, requestConfig);
  }

  /**
   * Send a pre-built completion request body to the orchestration service.
   * This is the low-level transport beneath the builder API: the builders returned by the `use*` methods assemble a body and route it through here. Call it directly only when you already hold a complete {@link CompletionPostRequest} wire body, or its JSON serialization as a string.
   * Pass the body as an object, or as a JSON string that is parsed and sent as-is.
   * Streaming is driven by the body itself — set `config.stream.enabled` to `true` to stream the response. The return type is the union of both outcomes; narrow it with `instanceof`, call {@link postStream} for a statically typed stream result, or use a builder's `create`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - A complete completion request body, or a JSON string that parses into one. Set `config.stream.enabled` to `true` to stream the response.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response when the body enables streaming, otherwise a non-streaming response.
   */
  async post(
    body: CompletionPostRequest | string,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > {
    return this.dispatch(body, requestConfig);
  }

  /**
   * Send a pre-built completion request body to the orchestration service as a streaming request.
   * Like {@link post}, but forces `config.stream.enabled` to `true` and narrows the return type to the stream response, so you do not need to set the stream flag on the body or narrow the result yourself.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - A complete completion request body, or a JSON string that parses into one. Any `config.stream` block is overridden to enable streaming.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response.
   */
  async postStream(
    body: CompletionPostRequest | string,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>> {
    const requestBody = this.parseBody(body);
    // Force streaming on without rebuilding the body: `CompletionPostRequest` is
    // a discriminated union (by `config` vs `config_ref`), so spreading into a
    // fresh literal loses the arm. Clone shallowly and override the nested
    // `stream` flag on the clone's `config` in place.
    const streamingBody = {
      ...requestBody,
      config: {
        ...requestBody.config,
        stream: { ...requestBody.config?.stream, enabled: true }
      }
    } as CompletionPostRequest;
    return this.dispatch(streamingBody, requestConfig) as Promise<
      OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
    >;
  }

  /**
   * Parse a request body given as an object or JSON string into a {@link CompletionPostRequest}.
   * @param body - The request body, or a JSON string that parses into one.
   * @returns The request body object.
   */
  private parseBody(
    body: CompletionPostRequest | string
  ): CompletionPostRequest {
    if (typeof body === 'string') {
      validateJsonConfig(body);
      return JSON.parse(body) as CompletionPostRequest;
    }
    return body;
  }

  /**
   * Resolve the deployment and send a request body, streaming the response when `config.stream.enabled` is `true`.
   * @param body - The request body, or a JSON string that parses into one.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response when the body enables streaming, otherwise a non-streaming response.
   */
  private async dispatch(
    body: CompletionPostRequest | string,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > {
    const requestBody = this.parseBody(body);

    const streaming = requestBody.config?.stream?.enabled === true;

    if (!streaming) {
      requestConfig?.signal?.throwIfAborted();
      const response = await sendCompletionRequest(
        this.options,
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
      const streamResponse = await sendCompletionRequest(
        this.options,
        requestBody,
        {
          ...requestConfig,
          responseType: 'stream',
          signal: controller.signal
        }
      );
      return createStreamFromResponse(streamResponse, controller);
    } catch (error) {
      controller.abort();
      throw error;
    }
  }
}
