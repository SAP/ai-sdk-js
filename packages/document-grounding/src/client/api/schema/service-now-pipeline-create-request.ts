/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MetaData } from './meta-data.js';
import type { ServiceNowConfigurationStruct } from './service-now-configuration-struct.js';
/**
 * Representation of the 'ServiceNowPipelineCreateRequest' schema.
 */
export type ServiceNowPipelineCreateRequest = {
  type: 'ServiceNow';
  metadata?: MetaData;
  configuration?: ServiceNowConfigurationStruct;
};
