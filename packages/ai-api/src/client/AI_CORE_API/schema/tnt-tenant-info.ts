/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'TntTenantInfo' schema.
 */
export type TntTenantInfo = {
  /**
   * tenant id
   * @example "aa97b177-9383-4934-8543-0f91a7a0283a"
   */
  tenantId: string;
  servicePlan: string;
  /**
   * Provisioning status of the tenant
   */
  status: string;
} & Record<string, any>;
