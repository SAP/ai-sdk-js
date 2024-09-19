/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiOnYourDataAuthenticationType } from './on-your-data-authentication-type.js';
/**
 * The authentication options for Azure OpenAI On Your Data when using a user-assigned managed identity.
 */
export type AzureOpenAiOnYourDataUserAssignedManagedIdentityAuthenticationOptions =
  {
    type: AzureOpenAiOnYourDataAuthenticationType;
  } & {
    /**
     * The resource ID of the user-assigned managed identity to use for authentication.
     */
    managed_identity_resource_id: string;
  } & Record<string, any>;
