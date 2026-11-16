import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { AwsBedrockChatModel } from '@sap-ai-sdk/core';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

import type {
  AnthropicBedrock,
  ClientOptions
} from '@anthropic-ai/bedrock-sdk';

/**
 * Native Messages methods supported through Bedrock model operations.
 */
export type SapAnthropicMessages = Pick<
  AnthropicBedrock['messages'],
  'create' | 'parse' | 'stream'
>;

/**
 * Beta Messages methods and local tool-runner helpers.
 */
export interface SapAnthropicBeta {
  /**
   * Feature availability depends on the deployed Claude model and Bedrock backend.
   */
  messages: Pick<
    AnthropicBedrock['beta']['messages'],
    'create' | 'parse' | 'stream' | 'toolRunner'
  >;
}

/** @internal */
export const anthropicConfigKeys = [
  'timeout',
  'fetchOptions',
  'fetch',
  'middleware',
  'maxRetries',
  'defaultHeaders',
  'defaultQuery',
  'dangerouslyAllowBrowser',
  'logLevel',
  'logger'
] as const;

/**
 * Upstream transport options. SAP manages deployment routing and authentication.
 */
export type SapAnthropicBedrockInvokeConfig = Pick<
  ClientOptions,
  (typeof anthropicConfigKeys)[number]
>;

/**
 * Claude model suggestions, with support for additional model names.
 */
export type SapAnthropicModelName =
  | Extract<AwsBedrockChatModel, `anthropic--${string}`>
  | (string & Record<never, never>);

/**
 * Options for accessing Claude through a SAP AI Core AWS Bedrock deployment.
 */
export interface SapAnthropicBedrockInvokeOptions {
  /**
   * Model name, model/version configuration, or deployment ID, with an optional resource group.
   * Select a deployment hosting an Anthropic Claude model.
   */
  deployment: ModelDeployment<SapAnthropicModelName>;
  /**
   * Custom destination. Defaults to the AI Core service binding or local service key.
   */
  destination?: HttpDestinationOrFetchOptions;
  /**
   * Additional client type appended to the preconfigured `AI SDK JavaScript` header.
   */
  clientType?: string;
  /**
   * Upstream client options, including custom fetch, middleware, timeouts, and retries.
   * SAP manages the deployment URL and authentication.
   */
  anthropicConfig?: SapAnthropicBedrockInvokeConfig;
}

/**
 * Client options or a model name, which is shorthand for `{ deployment: modelName }`.
 */
export type SapAnthropicBedrockInvokeInput =
  | SapAnthropicBedrockInvokeOptions
  | SapAnthropicModelName;
