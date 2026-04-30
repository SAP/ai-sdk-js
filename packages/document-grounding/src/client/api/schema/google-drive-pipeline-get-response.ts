/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineResponse } from './base-pipeline-response.js';
import type { GoogleDriveConfigurationMinimal } from './google-drive-configuration-minimal.js';
/**
 * Representation of the 'GoogleDrivePipelineGetResponse' schema.
 */
export type GoogleDrivePipelineGetResponse = BasePipelineResponse & {
  type?: 'GoogleDrive';
  configuration: GoogleDriveConfigurationMinimal;
} & Record<string, any>;
