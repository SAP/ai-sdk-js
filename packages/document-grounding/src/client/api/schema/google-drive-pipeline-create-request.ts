/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { GoogleDriveConfigurationStruct } from './google-drive-configuration-struct.js';
import type { MetaData } from './meta-data.js';
/**
 * Representation of the 'GoogleDrivePipelineCreateRequest' schema.
 */
export type GoogleDrivePipelineCreateRequest = {
  type: 'GoogleDrive';
  metadata?: MetaData;
  configuration: GoogleDriveConfigurationStruct;
} & Record<string, any>;
