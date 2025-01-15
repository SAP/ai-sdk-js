/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiOnYourDataApiKeyAuthenticationOptions } from './on-your-data-api-key-authentication-options.js';
import type { AzureOpenAiOnYourDataConnectionStringAuthenticationOptions } from './on-your-data-connection-string-authentication-options.js';
import type { AzureOpenAiOnYourDataSystemAssignedManagedIdentityAuthenticationOptions } from './on-your-data-system-assigned-managed-identity-authentication-options.js';
import type { AzureOpenAiOnYourDataUserAssignedManagedIdentityAuthenticationOptions } from './on-your-data-user-assigned-managed-identity-authentication-options.js';
/**
 * The authentication options for Azure OpenAI On Your Data.
 */
export type AzureOpenAiOnYourDataAuthenticationOptions =
  | ({ type: 'api_key' } & AzureOpenAiOnYourDataApiKeyAuthenticationOptions)
  | ({
      type: 'connection_string';
    } & AzureOpenAiOnYourDataConnectionStringAuthenticationOptions)
  | ({
      type: 'system_assigned_managed_identity';
    } & AzureOpenAiOnYourDataSystemAssignedManagedIdentityAuthenticationOptions)
  | ({
      type: 'user_assigned_managed_identity';
    } & AzureOpenAiOnYourDataUserAssignedManagedIdentityAuthenticationOptions);
