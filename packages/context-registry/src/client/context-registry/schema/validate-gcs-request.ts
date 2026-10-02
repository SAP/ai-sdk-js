/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { GCSConnectionConfig } from './gcs-connection-config.js';
/**
 * Representation of the 'ValidateGCSRequest' schema.
 */
export type ValidateGCSRequest = {
  type: 'GCS';
  /**
   * Default: "File".
   */
  adapterType?: 'File';
  config: GCSConnectionConfig;
} & Record<string, any>;
