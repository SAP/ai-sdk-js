/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndServiceBrokerSecret } from './bcknd-service-broker-secret';
import type { BckndServiceCapabilities } from './bcknd-service-capabilities';
import type { BckndServiceServiceCatalog } from './bcknd-service-service-catalog';
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
  /**
   * aggregated status of the service
   */
  status?: 'PROVISIONED' | 'ERROR' | 'PROVISIONING' | 'DEPROVISIONING';
  /**
   * status message
   */
  statusMessage?: string;
} & Record<string, any>;
