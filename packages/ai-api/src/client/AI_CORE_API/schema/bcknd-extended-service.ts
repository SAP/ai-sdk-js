/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndServiceBrokerSecret } from './bcknd-service-broker-secret.js';
import type { BckndServiceCapabilities } from './bcknd-service-capabilities.js';
import type { BckndServiceServiceCatalog } from './bcknd-service-service-catalog.js';
import type { BckndSharedResourceGroupStatus } from './bcknd-shared-resource-group-status.js';
/**
 * Representation of the 'BckndExtendedService' schema.
 */
export type BckndExtendedService = {
  /**
   * service name
   */
  name?: string;
  /**
   * service description
   */
  description?: string;
  /**
   * service broker url
   */
  url?: string;
  brokerSecret?: BckndServiceBrokerSecret;
  capabilities?: BckndServiceCapabilities;
  serviceCatalog?: BckndServiceServiceCatalog;
  sharedResourceGroupStatus?: BckndSharedResourceGroupStatus;
  /**
   * aggregated status of the service
   */
  status?: 'PROVISIONED' | 'ERROR' | 'PROVISIONING' | 'DEPROVISIONING';
  /**
   * status message
   */
  statusMessage?: string;
} & Record<string, any>;
