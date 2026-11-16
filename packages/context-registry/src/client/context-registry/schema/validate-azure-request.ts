/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { AzureConnectionConfig } from './azure-connection-config.js';
/**
 * Representation of the 'ValidateAzureRequest' schema.
 */
export type ValidateAzureRequest = {
  type: 'AZURE';
  /**
   * Default: "File".
   */
  adapterType?: 'File';
  config: AzureConnectionConfig;
} & Record<string, any>;
