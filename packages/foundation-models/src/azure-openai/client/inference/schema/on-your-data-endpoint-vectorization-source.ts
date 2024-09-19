/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiOnYourDataVectorizationSourceType } from './on-your-data-vectorization-source-type.js';
import type { AzureOpenAiOnYourDataApiKeyAuthenticationOptions } from './on-your-data-api-key-authentication-options.js';
/**
 * The details of a a vectorization source, used by Azure OpenAI On Your Data when applying vector search, that is based
 * on a public Azure OpenAI endpoint call for embeddings.
 */
export type AzureOpenAiOnYourDataEndpointVectorizationSource = {
  type: AzureOpenAiOnYourDataVectorizationSourceType;
} & {
  authentication: AzureOpenAiOnYourDataApiKeyAuthenticationOptions;
  /**
   * Specifies the endpoint to use for vectorization. This endpoint must be in the same Azure OpenAI resource, but On Your Data will use this endpoint via an internal call rather than a public one, which enables vector search even in private networks.
   * Format: "uri".
   */
  endpoint: string;
} & Record<string, any>;
