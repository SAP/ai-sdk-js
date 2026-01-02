/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineMinimalResponse } from './base-pipeline-minimal-response.js';
import type { S3ConfigurationMinimal } from './s-3-configuration-minimal.js';
/**
 * Representation of the 'S3PipelineMinimalResponse' schema.
 */
export type S3PipelineMinimalResponse = BasePipelineMinimalResponse & {
  type: 'S3';
  configuration: S3ConfigurationMinimal;
  /**
   * @example true
   */
  metadata?: boolean;
} & Record<string, any>;
