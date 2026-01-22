/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineMinimalResponse } from './base-pipeline-minimal-response.js';
import type { GoogleDriveConfigurationMinimal } from './google-drive-configuration-minimal.js';
/**
 * Representation of the 'GoogleDrivePipelineMinimalResponse' schema.
 */
export type GoogleDrivePipelineMinimalResponse = BasePipelineMinimalResponse & {
  type: 'GoogleDrive';
  configuration?: GoogleDriveConfigurationMinimal;
  /**
   * @example true
   */
  metadata?: boolean;
} & Record<string, any>;
