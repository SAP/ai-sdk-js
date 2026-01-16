/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineMinimalResponse } from './base-pipeline-minimal-response.js';
import type { ServiceNowConfigurationMinimal } from './service-now-configuration-minimal.js';
/**
 * Representation of the 'ServiceNowPipelineMinimalResponse' schema.
 */
export type ServiceNowPipelineMinimalResponse = BasePipelineMinimalResponse & {
  type: 'ServiceNow';
  configuration?: ServiceNowConfigurationMinimal;
  /**
   * @example true
   */
  metadata?: boolean;
} & Record<string, any>;
