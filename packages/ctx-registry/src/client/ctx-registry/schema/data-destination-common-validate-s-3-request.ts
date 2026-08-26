/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationCommonS3ConnectionConfig } from './data-destination-common-s-3-connection-config.js';
/**
 * Representation of the 'DataDestinationCommonValidateS3Request' schema.
 */
export type DataDestinationCommonValidateS3Request = {
  type: 'S3';
  /**
   * Default: "File".
   */
  adapterType?: 'File';
  config: DataDestinationCommonS3ConnectionConfig;
} & Record<string, any>;
