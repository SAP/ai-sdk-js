/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiAzureSearchChatExtensionConfiguration } from './azure-search-chat-extension-configuration.js';
import type { AzureOpenAiAzureCosmosDBChatExtensionConfiguration } from './azure-cosmos-db-chat-extension-configuration.js';
/**
 *   A representation of configuration data for a single Azure OpenAI chat extension. This will be used by a chat
 *   completions request that should use Azure OpenAI chat extensions to augment the response behavior.
 *   The use of this configuration is compatible only with Azure OpenAI.
 */
export type AzureOpenAiAzureChatExtensionConfiguration =
  | ({
      type: 'azure_search';
    } & AzureOpenAiAzureSearchChatExtensionConfiguration)
  | ({
      type: 'azure_cosmos_db';
    } & AzureOpenAiAzureCosmosDBChatExtensionConfiguration);
