/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationCommonAzureConnectionConfig } from './data-destination-common-azure-connection-config.js';
/**
 * Representation of the 'DataDestinationCommonValidateAzureRequest' schema.
 */
export type DataDestinationCommonValidateAzureRequest = {
  type: 'AZURE';
  /**
   * Default: "File".
   */
  adapterType?: 'File';
  config: DataDestinationCommonAzureConnectionConfig;
} & Record<string, any>;
