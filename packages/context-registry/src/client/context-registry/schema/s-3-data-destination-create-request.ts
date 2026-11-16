/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { DataDestinationCreateBase } from './data-destination-create-base.js';
import type { S3ConnectionConfig } from './s-3-connection-config.js';
/**
 * Representation of the 'S3DataDestinationCreateRequest' schema.
 */
export type S3DataDestinationCreateRequest = DataDestinationCreateBase & {
  type: 'S3';
  config: S3ConnectionConfig;
} & Record<string, any>;
