import { getOrchestrationDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import { executeRequest } from '@sap-ai-sdk/core';
import { createLogger } from '@sap-cloud-sdk/util';

import {
  OrchestrationConfigBuilder,
  OrchestrationConfigWithTemplateBuilder,
  OrchestrationRawConfigJsonBuilder
} from './builders/index.ts';
import { OrchestrationResponse } from './orchestration-response.ts';
import { OrchestrationStreamResponse } from './orchestration-stream-response.ts';
import { OrchestrationStream } from './orchestration-stream.ts';
import { isConfigReference } from './orchestration-types.ts';
import {
  parseTemplatingModule,
  parseModuleConfigList,
  validateJsonConfig,
  hasStandingPrompt
} from './util/parse-config.ts';

import type {
  DeploymentIdConfig,
  ResourceGroupConfig
} from '@sap-ai-sdk/ai-api/internal.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

import type { CompletionPostRequest } from './client/api/schema/index.ts';
import type { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.ts';
import type {
  OrchestrationConfigWithoutTemplate,
  OrchestrationConfigWithTemplate,
  OrchestrationConfigWithInlineTemplate,
  OrchestrationConfigWithTemplateRef,
  OrchestrationModuleConfigList,
  OrchestrationConfigRefById,
  OrchestrationConfigRefByName,
  OrchestrationCreateRequestConfig
} from './orchestration-types.ts';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration'
});

/**
 * Client for the SAP AI Core Orchestration Service that exposes a fluent builder API.
 * Construct it with connection information only, then choose a configuration source with {@link config} or {@link rawConfigJson} and call `create` on the returned builder.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class Orchestration {
  private options: (ResourceGroupConfig | DeploymentIdConfig) & {
    destination?: HttpDestinationOrFetchOptions;
  };

  /**
   * Creates an instance of the orchestration client with connection information only.
   * @param options - Connection information: a {@link ResourceGroupConfig} or {@link DeploymentIdConfig} to scope the deployment, or a `{ destination }` object. Omit to resolve the deployment from the default resource group.
   */
  constructor(
    options: (ResourceGroupConfig | DeploymentIdConfig) & {
      destination?: HttpDestinationOrFetchOptions;
    } = {}
  ) {
    this.options = options;
  }

  /* oxlint-disable typescript/unified-signatures -- separate overloads improve discoverability and per-variant JSDoc */
  /**
   * Select an inline module configuration without a standing prompt as the source for a request.
   * The returned builder's `create` accepts a per-call `prompt`, because an inline template is the only source that can be extended at request time.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration without a standing prompt. The prompt is supplied per call through `create({ prompt })`.
   * @returns A builder whose `create` sends the request.
   */
  config(
    config: OrchestrationConfigWithoutTemplate
  ): OrchestrationConfigBuilder;
  /**
   * Select a module configuration whose standing prompt is an inline template as the source for a request.
   * The returned builder's `create` omits `prompt`, because the messages are fixed in the configuration.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration whose `promptTemplating.prompt` is an inline template.
   * @returns A builder whose `create` sends the request.
   */
  config(
    config: OrchestrationConfigWithInlineTemplate
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a module configuration whose standing prompt is a remote prompt-registry template reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the template is resolved remotely.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A single orchestration module configuration whose `promptTemplating.prompt` is a `TemplateRef`.
   * @returns A builder whose `create` sends the request.
   */
  config(
    config: OrchestrationConfigWithTemplateRef
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a stored configuration reference as the source for a request.
   * The returned builder's `create` omits `prompt`, because the template is defined remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A reference to a stored configuration by `id`, or by `scenario`, `name`, and `version`.
   * @returns A builder whose `create` sends the request.
   */
  config(
    config: OrchestrationConfigRefById | OrchestrationConfigRefByName
  ): OrchestrationConfigWithTemplateBuilder;
  /**
   * Select a fallback list of module configurations as the source for a request.
   * The orchestration service tries each configuration in order until one succeeds.
   * The returned builder's `create` omits `prompt`, because each configuration carries its own prompt.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param config - A non-empty list of orchestration module configurations.
   * @returns A builder whose `create` sends the request.
   */
  config(
    config: OrchestrationModuleConfigList
  ): OrchestrationConfigWithTemplateBuilder;
  /* oxlint-enable typescript/unified-signatures */
  config(
    config:
      | OrchestrationConfigWithoutTemplate
      | OrchestrationConfigWithTemplate
      | OrchestrationConfigRefById
      | OrchestrationConfigRefByName
      | OrchestrationModuleConfigList
  ): OrchestrationConfigBuilder | OrchestrationConfigWithTemplateBuilder {
    if (isConfigReference(config)) {
      return new OrchestrationConfigWithTemplateBuilder(config, this);
    }

    if (Array.isArray(config)) {
      return new OrchestrationConfigWithTemplateBuilder(
        parseModuleConfigList(config),
        this
      );
    }

    const parsed = parseTemplatingModule(config);
    if (hasStandingPrompt(parsed)) {
      return new OrchestrationConfigWithTemplateBuilder(
        parsed as OrchestrationConfigWithTemplate,
        this
      );
    }

    return new OrchestrationConfigBuilder(
      parsed as OrchestrationConfigWithoutTemplate,
      this
    );
  }

  /**
   * Select a JSON string configuration (exported from AI Launchpad) as the source for a request.
   * The returned builder's `create` omits `prompt`, because the configuration already specifies everything.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param json - A JSON string in the orchestration wire schema.
   * @returns A builder whose `create` sends the request.
   */
  rawConfigJson(json: string): OrchestrationRawConfigJsonBuilder {
    validateJsonConfig(json);
    return new OrchestrationRawConfigJsonBuilder(json, this);
  }

  /**
   * Send a pre-built completion request body to the orchestration service.
   * This is the low-level transport beneath the builder API: the builders returned by {@link config} and {@link rawConfigJson} assemble a body and route it through here. Call it directly only when you already hold a complete {@link CompletionPostRequest} wire body.
   * Streaming is driven by the body itself — set `config.stream.enabled` to `true` to stream the response. The return type is the union of both outcomes; narrow it with `instanceof`, or use a builder's `create` for a statically typed result.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - A complete completion request body. Set `config.stream.enabled` to `true` to stream the response.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response when the body enables streaming, otherwise a non-streaming response.
   */
  async post(
    body: CompletionPostRequest,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > {
    const streaming = body.config?.stream?.enabled === true;

    if (!streaming) {
      requestConfig?.signal?.throwIfAborted();
      const response = await this.sendCompletionRequest(body, requestConfig);
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
      const streamResponse = await this.sendCompletionRequest(body, {
        ...requestConfig,
        responseType: 'stream',
        signal: controller.signal
      });
      return this.createStreamFromResponse(streamResponse, controller);
    } catch (error) {
      controller.abort();
      throw error;
    }
  }

  /**
   * Resolve the deployment, send a pre-built completion request body, and log fallback usage.
   * @param body - The completion post request body.
   * @param requestConfig - Custom request configuration.
   * @returns The raw HTTP response.
   */
  private async sendCompletionRequest(
    body: Record<string, any>,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<HttpResponse> {
    const { destination, ...deploymentConfig } = this.options;
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
  private createStreamFromResponse(
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
}

const c = new SapAi({});
c.orchestration({ id: 'fjdksl' }).create({ streamOptions: { enabled: true } });

