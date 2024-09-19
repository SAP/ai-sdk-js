/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiOnYourDataApiKeyAuthenticationOptions } from './on-your-data-api-key-authentication-options.js';
import type { AzureOpenAiOnYourDataSystemAssignedManagedIdentityAuthenticationOptions } from './on-your-data-system-assigned-managed-identity-authentication-options.js';
import type { AzureOpenAiOnYourDataUserAssignedManagedIdentityAuthenticationOptions } from './on-your-data-user-assigned-managed-identity-authentication-options.js';
import type { AzureOpenAiAzureSearchIndexFieldMappingOptions } from './azure-search-index-field-mapping-options.js';
import type { AzureOpenAiAzureSearchQueryType } from './azure-search-query-type.js';
import type { AzureOpenAiOnYourDataEndpointVectorizationSource } from './on-your-data-endpoint-vectorization-source.js';
import type { AzureOpenAiOnYourDataDeploymentNameVectorizationSource } from './on-your-data-deployment-name-vectorization-source.js';
/**
 * Parameters for Azure Search when used as an Azure OpenAI chat extension.
 */
export type AzureOpenAiAzureSearchChatExtensionParameters = {
  authentication:
    | AzureOpenAiOnYourDataApiKeyAuthenticationOptions
    | AzureOpenAiOnYourDataSystemAssignedManagedIdentityAuthenticationOptions
    | AzureOpenAiOnYourDataUserAssignedManagedIdentityAuthenticationOptions;
  /**
   * The configured top number of documents to feature for the configured query.
   * Format: "int32".
   */
  top_n_documents?: number;
  /**
   * Whether queries should be restricted to use of indexed data.
   */
  in_scope?: boolean;
  /**
   * The configured strictness of the search relevance filtering. The higher of strictness, the higher of the precision but lower recall of the answer.
   * Format: "int32".
   * Maximum: 5.
   * Minimum: 1.
   */
  strictness?: number;
  /**
   * Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality and tell it how to format responses. There's a 100 token limit for it, and it counts against the overall token limit.
   */
  role_information?: string;
  /**
   * The absolute endpoint path for the Azure Search resource to use.
   * Format: "uri".
   */
  endpoint: string;
  /**
   * The name of the index to use as available in the referenced Azure Search resource.
   */
  index_name: string;
  fields_mapping?: AzureOpenAiAzureSearchIndexFieldMappingOptions;
  query_type?: AzureOpenAiAzureSearchQueryType;
  /**
   * The additional semantic configuration for the query.
   */
  semantic_configuration?: string;
  /**
   * Search filter.
   */
  filter?: string;
  embedding_dependency?:
    | AzureOpenAiOnYourDataEndpointVectorizationSource
    | AzureOpenAiOnYourDataDeploymentNameVectorizationSource;
} & Record<string, any>;
