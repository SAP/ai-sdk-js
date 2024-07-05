/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ServiceBrokerSecret } from './service-broker-secret.js';
import type { ServiceCapabilities } from './service-capabilities.js';
import type { ServiceServiceCatalog } from './service-service-catalog.js';
/**
 * Representation of the 'ServiceDetails' schema.
 */
export type ServiceDetails = {
  brokerSecret?: ServiceBrokerSecret;
  capabilities?: ServiceCapabilities;
  serviceCatalog?: ServiceServiceCatalog;
} & Record<string, any>;
