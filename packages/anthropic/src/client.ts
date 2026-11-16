import {
  getResourceGroup,
  resolveDeploymentUrlForModel
} from '@sap-ai-sdk/ai-api/internal.js';
import { getAiCoreDestination } from '@sap-ai-sdk/core';
import { ErrorWithCause } from '@sap-cloud-sdk/util';

import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk';

import type {
  SapAnthropicBedrockInvokeInput,
  SapAnthropicBedrockInvokeOptions
} from './types.ts';
import type { ClientOptions } from '@anthropic-ai/bedrock-sdk';
import type { Middleware } from '@anthropic-ai/sdk';

interface SapAnthropicBedrockInvokeConfig extends Omit<
  ClientOptions,
  'awsAccessKey' | 'awsSecretKey' | 'awsSessionToken'
> {
  baseURL: string;
  resourceGroup: string;
  sapOptions: SapAnthropicBedrockInvokeOptions;
}

/**
 * A configured Anthropic Bedrock client for Claude on SAP AI Core.
 * SAP handles deployment routing and authentication. The upstream SDK handles
 * Invoke payload adaptation, binary EventStream decoding, and message helpers.
 * Use {@link SapAnthropicBedrockInvoke.createClient} to create an instance.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapAnthropicBedrockInvoke extends AnthropicBedrock {
  private readonly resourceGroup: string;
  private readonly sapOptions: SapAnthropicBedrockInvokeOptions;

  /**
   * Creates an Anthropic client for a Claude deployment on SAP AI Core.
   * @param input - Deployment and client options, or a model name as shorthand.
   * @returns A client with native Anthropic Messages methods and streaming helpers.
   * @example
   * ```ts
   * const client = await SapAnthropicBedrockInvoke.createClient('anthropic--claude-4.6-sonnet');
   * const message = await client.messages.create({
   *   model: 'anthropic--claude-4.6-sonnet',
   *   max_tokens: 100,
   *   messages: [{ role: 'user', content: 'Hello!' }]
   * });
   * ```
   */
  static async createClient(
    input: SapAnthropicBedrockInvokeInput
  ): Promise<SapAnthropicBedrockInvoke> {
    const options: SapAnthropicBedrockInvokeOptions =
      typeof input === 'string' ? { deployment: input } : input;
    const resourceGroup = getResourceGroup(options.deployment) ?? 'default';
    const baseUrl = await resolveDeploymentUrlForModel(options.deployment, {
      scenarioId: 'foundation-models',
      executableId: 'aws-bedrock',
      resourceGroup,
      destination: options.destination
    });

    return new SapAnthropicBedrockInvoke({
      ...options.anthropicConfig,
      baseURL: baseUrl,
      resourceGroup,
      sapOptions: options
    });
  }

  private constructor(config: SapAnthropicBedrockInvokeConfig) {
    super({
      // Keep SAP context in the upstream options so withOptions() clones retain it.
      ...config,
      // Disable AWS signing and ambient AWS bearer tokens; SAP owns authentication.
      apiKey: '',
      skipAuth: true
    });
    this.resourceGroup = config.resourceGroup;
    this.sapOptions = config.sapOptions;
  }

  protected override backendMiddleware(): readonly Middleware[] {
    return [
      // The upstream middleware adapts the request first and decodes the response last.
      ...super.backendMiddleware(),
      async (request, next) => {
        const url = new URL(request.url);
        const bedrockPath =
          /\/model\/[^/]+\/(invoke(?:-with-response-stream)?)$/;
        const match = url.pathname.match(bedrockPath);
        if (!match) {
          throw new Error(
            `Unsupported SAP AI Core Bedrock request path: ${url.pathname}. Use the Messages API through Invoke.`
          );
        }
        url.pathname = url.pathname.replace(bedrockPath, '/$1');

        const destination = await getAiCoreDestination(
          this.sapOptions.destination
        );
        const authToken = destination.authTokens?.[0];
        if (!authToken?.value || authToken.error) {
          const message =
            'Could not retrieve an authentication token from the AI Core destination.';
          throw authToken?.error
            ? new ErrorWithCause(message, new Error(authToken.error))
            : new Error(message);
        }

        const headers = new Headers(request.headers);
        headers.set('authorization', `Bearer ${authToken.value}`);
        headers.set('ai-resource-group', this.resourceGroup);
        headers.set(
          'ai-client-type',
          ['AI SDK JavaScript', this.sapOptions.clientType]
            .filter(Boolean)
            .join(',')
        );
        if (match[1] === 'invoke-with-response-stream') {
          headers.set('accept', 'application/vnd.amazon.eventstream');
        }

        return next({ ...request, url: url.toString(), headers });
      }
    ];
  }
}
