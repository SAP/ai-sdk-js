/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineResponse } from './base-pipeline-response.js';
import type { ServiceNowConfigurationMinimal } from './service-now-configuration-minimal.js';
/**
 * Representation of the 'ServiceNowPipelineGetResponse' schema.
 */
export type ServiceNowPipelineGetResponse = BasePipelineResponse & {
  type?: 'ServiceNow';
  configuration: ServiceNowConfigurationMinimal;
} & Record<string, any>;
