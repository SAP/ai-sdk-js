/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiOnYourDataConnectionStringAuthenticationOptions } from './on-your-data-connection-string-authentication-options.js';
import type { AzureOpenAiAzureCosmosDBFieldMappingOptions } from './azure-cosmos-db-field-mapping-options.js';
import type { AzureOpenAiOnYourDataEndpointVectorizationSource } from './on-your-data-endpoint-vectorization-source.js';
import type { AzureOpenAiOnYourDataDeploymentNameVectorizationSource } from './on-your-data-deployment-name-vectorization-source.js';
/**
 * Parameters to use when configuring Azure OpenAI On Your Data chat extensions when using Azure Cosmos DB for
 * MongoDB vCore.
 */
export type AzureOpenAiAzureCosmosDBChatExtensionParameters = {
  authentication: AzureOpenAiOnYourDataConnectionStringAuthenticationOptions;
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
   * The MongoDB vCore database name to use with Azure Cosmos DB.
   */
  database_name: string;
  /**
   * The name of the Azure Cosmos DB resource container.
   */
  container_name: string;
  /**
   * The MongoDB vCore index name to use with Azure Cosmos DB.
   */
  index_name: string;
  fields_mapping: AzureOpenAiAzureCosmosDBFieldMappingOptions;
  embedding_dependency:
    | AzureOpenAiOnYourDataEndpointVectorizationSource
    | AzureOpenAiOnYourDataDeploymentNameVectorizationSource;
} & Record<string, any>;
