import {
  SapAnthropicBedrockClient,
  pickAnthropicConfig
} from './bedrock-client.ts';

import type {
  SapAnthropicBeta,
  SapAnthropicBedrockInvokeConfig,
  SapAnthropicBedrockInvokeOptions,
  SapAnthropicMessages
} from './types.ts';

/**
 * A configured Anthropic Bedrock client for Claude on SAP AI Core.
 * SAP handles deployment routing and authentication. The upstream SDK handles
 * Invoke payload adaptation, binary EventStream decoding, and message helpers.
 * Only Messages resources are exposed.
 *
 * The request `model` selects a running AWS Bedrock deployment in the configured resource group:
 * a model name such as `anthropic--claude-4.6-sonnet`, a model name and version such as
 * `anthropic--claude-4.6-sonnet:1`, or a deployment ID. Model names take precedence over deployment IDs.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class SapAnthropicBedrockInvoke {
  readonly #options: SapAnthropicBedrockInvokeOptions;
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
   * Creates an Anthropic client for Claude deployments on SAP AI Core.
   * @param options - Resource group, destination, and client options.
   * @example
   * ```ts
   * const client = new SapAnthropicBedrockInvoke();
   * const message = await client.messages.create({
   *   model: 'anthropic--claude-4.6-sonnet',
   *   max_tokens: 100,
   *   messages: [{ role: 'user', content: 'Hello!' }]
   * });
   * ```
   */
  constructor(options: SapAnthropicBedrockInvokeOptions = {}) {
    const { anthropicConfig, ...sapOptions } = options;
    const client = new SapAnthropicBedrockClient({
      ...pickAnthropicConfig(anthropicConfig),
      sapOptions
    });
    this.#options = options;
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
   * Creates a client with updated transport options and the same SAP configuration.
   * @param options - Upstream transport options to override.
   * @returns A client retaining SAP routing, authentication, and resource group.
   */
  withOptions(
    options: SapAnthropicBedrockInvokeConfig
  ): SapAnthropicBedrockInvoke {
    return new SapAnthropicBedrockInvoke({
      ...this.#options,
      anthropicConfig: { ...this.#options.anthropicConfig, ...options }
    });
  }
}
