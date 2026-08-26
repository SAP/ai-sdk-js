/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ProvisioningTimestamps } from './provisioning-timestamps.js';
import type { ProvisioningTenantProvisioningStatus } from './provisioning-tenant-provisioning-status.js';
/**
 * Representation of the 'ProvisioningMainTenant' schema.
 */
export type ProvisioningMainTenant = ProvisioningTimestamps & {
  /**
   * Id of tenant
   */
  id: string;
  status: ProvisioningTenantProvisioningStatus;
} & Record<string, any>;
