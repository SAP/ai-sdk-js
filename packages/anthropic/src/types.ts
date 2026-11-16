import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { AwsBedrockChatModel } from '@sap-ai-sdk/core';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

import type { ClientOptions } from '@anthropic-ai/bedrock-sdk';

/**
 * Options for accessing Claude through a SAP AI Core AWS Bedrock deployment.
 */
export interface SapAnthropicBedrockInvokeOptions {
  /**
   * Model name, model/version configuration, or deployment ID, with an optional resource group.
   * Select a deployment hosting an Anthropic Claude model.
   */
  deployment: ModelDeployment<AwsBedrockChatModel>;
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
  anthropicConfig?: Omit<
    ClientOptions,
    | 'baseURL'
    | 'apiKey'
    | 'credentials'
    | 'skipAuth'
    | 'awsAccessKey'
    | 'awsSecretKey'
    | 'awsSessionToken'
    | 'providerChainResolver'
  >;
}

/**
 * Client options or a model name, which is shorthand for `{ deployment: modelName }`.
 */
export type SapAnthropicBedrockInvokeInput =
  | SapAnthropicBedrockInvokeOptions
  | AwsBedrockChatModel;
