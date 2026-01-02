/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineMinimalResponse } from './base-pipeline-minimal-response.js';
/**
 * Representation of the 'SDMPipelineMinimalResponse' schema.
 */
export type SDMPipelineMinimalResponse = BasePipelineMinimalResponse & {
  type: 'SDM';
  /**
   * @example true
   */
  metadata?: boolean;
} & Record<string, any>;
