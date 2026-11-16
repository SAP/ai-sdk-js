import {
  getResourceGroup,
  resolveDeploymentUrlForModel
} from '@sap-ai-sdk/ai-api/internal.js';

import {
  SapAnthropicBedrockClient,
  pickAnthropicConfig
} from './bedrock-client.ts';

import type {
  SapAnthropicBeta,
  SapAnthropicBedrockInvokeConfig,
  SapAnthropicBedrockInvokeInput,
  SapAnthropicBedrockInvokeOptions,
  SapAnthropicMessages
} from './types.ts';

/**
 * A configured Anthropic Bedrock client for Claude on SAP AI Core.
 * SAP handles deployment routing and authentication. The upstream SDK handles
 * Invoke payload adaptation, binary EventStream decoding, and message helpers.
 * Only Messages resources are exposed.
 * Use {@link SapAnthropicBedrockInvoke.createClient} to create an instance.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapAnthropicBedrockInvoke {
  readonly #client: SapAnthropicBedrockClient;

  /**
   * Native Messages methods and helpers supported through Bedrock Invoke.
   */
  readonly messages: SapAnthropicMessages;
  /**
   * Beta Messages methods and helpers. Availability depends on the deployed model.
   */
  readonly beta: SapAnthropicBeta;

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

    return new SapAnthropicBedrockInvoke(
      new SapAnthropicBedrockClient({
        ...pickAnthropicConfig(options.anthropicConfig),
        baseURL: baseUrl,
        resourceGroup,
        sapOptions: options
      })
    );
  }

  private constructor(client: SapAnthropicBedrockClient) {
    this.#client = client;
    this.messages = {
      create: client.messages.create.bind(client.messages),
      parse: client.messages.parse.bind(client.messages),
      stream: client.messages.stream.bind(client.messages)
    };
    this.beta = {
      messages: {
        create: client.beta.messages.create.bind(client.beta.messages),
        parse: client.beta.messages.parse.bind(client.beta.messages),
        stream: client.beta.messages.stream.bind(client.beta.messages),
        toolRunner: client.beta.messages.toolRunner.bind(client.beta.messages)
      }
    };
  }

  /**
   * Maximum time in milliseconds to wait for a response before retrying.
   * @returns The configured timeout in milliseconds.
   */
  get timeout(): number {
    return this.#client.timeout;
  }

  /**
   * Creates a client with updated transport options and the same SAP deployment.
   * @param options - Upstream transport options to override.
   * @returns A client retaining SAP routing, authentication, and resource group.
   */
  withOptions(
    options: SapAnthropicBedrockInvokeConfig
  ): SapAnthropicBedrockInvoke {
    return new SapAnthropicBedrockInvoke(
      this.#client.withOptions(pickAnthropicConfig(options))
    );
  }
}
