import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type {
  AzureOpenAiChatModel,
  AzureOpenAiEmbeddingModel,
  AzureOpenAiResponsesModel
} from '@sap-ai-sdk/core';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * Union of all supported Azure OpenAI model names.
 */
export type SapModelName =
  AzureOpenAiChatModel | AzureOpenAiEmbeddingModel | AzureOpenAiResponsesModel;

/**
 * Options for creating a pre-configured Azure OpenAI client or config for SAP AI Core.
 */
export interface SapOpenAiOptions {
  /**
   * Model deployment: a model name string, `{ modelName, modelVersion? }`, or `{ deploymentId }`.
   * An optional `resourceGroup` can be included in the object form.
   */
  deployment: ModelDeployment<SapModelName>;
  /**
   * Optional custom destination. Defaults to the `aicore` service binding or `AICORE_SERVICE_KEY` env var.
   */
  destination?: HttpDestinationOrFetchOptions;
  /**
   * Azure OpenAI API version. Defaults to `'2024-10-21'`.
   */
  apiVersion?: string;
  /**
   * Additional client types appended to the `ai-client-type` header with the preconfigured `AI SDK JavaScript` value.
   */
  clientType?: string;
}

/**
 * Options or a model name string for creating a pre-configured Azure OpenAI client or config.
 * Passing a string is shorthand for `{ deployment: modelName }`.
 */
export type SapOpenAiInput = SapOpenAiOptions | SapModelName;
