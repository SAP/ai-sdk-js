/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationCommonGCSConnectionConfig } from './data-destination-common-gcs-connection-config.js';
/**
 * Representation of the 'DataDestinationCommonValidateGCSRequest' schema.
 */
export type DataDestinationCommonValidateGCSRequest = {
  type: 'GCS';
  /**
   * Default: "File".
   */
  adapterType?: 'File';
  config: DataDestinationCommonGCSConnectionConfig;
} & Record<string, any>;
