/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiAzureChatExtensionConfiguration } from './azure-chat-extension-configuration.js';
import type { AzureOpenAiAzureCosmosDBChatExtensionParameters } from './azure-cosmos-db-chat-extension-parameters.js';
/**
 * A specific representation of configurable options for Azure Cosmos DB when using it as an Azure OpenAI chat
 * extension.
 */
export type AzureOpenAiAzureCosmosDBChatExtensionConfiguration =
  AzureOpenAiAzureChatExtensionConfiguration & {
    parameters: AzureOpenAiAzureCosmosDBChatExtensionParameters;
  } & Record<string, any>;
