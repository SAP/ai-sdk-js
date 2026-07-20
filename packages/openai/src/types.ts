import type { AzureClientOptions } from 'openai/azure';
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

/** @internal */
export interface SapOpenAiContext {
  /** Azure client options ready to pass to `new AzureOpenAI()`. */
  azureOptions: AzureClientOptions;
  /** The model deployment as provided by the caller. */
  deployment: ModelDeployment<SapModelName>;
  /** The resolved destination, forwarded to the token provider and deployment API. */
  destination: HttpDestinationOrFetchOptions | undefined;
  /** The resolved AI resource group. */
  resourceGroup: string;
}

/**
 * Makes the `model` field optional in request param types, with an optional type constraint.
 * @internal
 */
export type WithOptionalModel<T, TModel extends string = string> = Omit<
  T,
  'model'
> & { model?: ModelDeployment<TModel> };
