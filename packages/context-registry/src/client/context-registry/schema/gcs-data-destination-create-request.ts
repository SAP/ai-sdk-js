/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { DataDestinationCreateBase } from './data-destination-create-base.js';
import type { GCSConnectionConfig } from './gcs-connection-config.js';
/**
 * Representation of the 'GCSDataDestinationCreateRequest' schema.
 */
export type GCSDataDestinationCreateRequest = DataDestinationCreateBase & {
  type: 'GCS';
  config: GCSConnectionConfig;
} & Record<string, any>;
