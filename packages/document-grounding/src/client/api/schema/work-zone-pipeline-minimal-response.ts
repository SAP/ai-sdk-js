/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineMinimalResponse } from './base-pipeline-minimal-response.js';
/**
 * Representation of the 'WorkZonePipelineMinimalResponse' schema.
 */
export type WorkZonePipelineMinimalResponse = BasePipelineMinimalResponse & {
  type: 'WorkZone';
  /**
   * @example true
   */
  metadata?: boolean;
} & Record<string, any>;
