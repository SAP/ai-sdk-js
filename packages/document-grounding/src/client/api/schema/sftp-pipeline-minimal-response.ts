/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineMinimalResponse } from './base-pipeline-minimal-response.js';
import type { SFTPConfigurationMinimal } from './sftp-configuration-minimal.js';
/**
 * Representation of the 'SFTPPipelineMinimalResponse' schema.
 */
export type SFTPPipelineMinimalResponse = BasePipelineMinimalResponse & {
  type: 'SFTP';
  configuration: SFTPConfigurationMinimal;
  /**
   * @example true
   */
  metadata?: boolean;
} & Record<string, any>;
