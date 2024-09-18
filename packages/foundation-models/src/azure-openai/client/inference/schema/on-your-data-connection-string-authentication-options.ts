/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiOnYourDataAuthenticationOptions } from './on-your-data-authentication-options.js';
/**
 * The authentication options for Azure OpenAI On Your Data when using a connection string.
 */
export type AzureOpenAiOnYourDataConnectionStringAuthenticationOptions =
  AzureOpenAiOnYourDataAuthenticationOptions & {
    /**
     * The connection string to use for authentication.
     */
    connection_string: string;
  } & Record<string, any>;
