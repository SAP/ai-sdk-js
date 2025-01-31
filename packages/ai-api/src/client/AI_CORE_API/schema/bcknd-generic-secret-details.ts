/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BckndGenericSecretDetails' schema.
 */
export type BckndGenericSecretDetails = {
  /**
   * Name of the secret
   */
  name: string;
  /**
   * Timestamp at which secret was created
   */
  createdAt: string;
  /**
   * Sync status of the replicated secrets in all resource groups of the tenant
   */
  resourceGroupSecretsSyncStatus?: Record<string, boolean>;
} & Record<string, any>;
