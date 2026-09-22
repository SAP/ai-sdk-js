/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { AzurePatchConfig } from './azure-patch-config.js';
import type { GCSPatchConfig } from './gcs-patch-config.js';
import type { Labels } from './labels.js';
import type { S3PatchConfig } from './s-3-patch-config.js';
/**
 * Representation of the 'PatchDataDestination' schema.
 */
export type PatchDataDestination = {
  labels?: Labels;
  /**
   * Data destination description.
   * Max Length: 253.
   */
  description?: string;
  /**
   * Credential fields for the destination's provider type.
   */
  config?: S3PatchConfig | GCSPatchConfig | AzurePatchConfig;
};
