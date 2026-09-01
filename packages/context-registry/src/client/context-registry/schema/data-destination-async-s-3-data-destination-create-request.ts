/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncDataDestinationCreateBase } from './data-destination-async-data-destination-create-base.js';
import type { DataDestinationCommonS3ConnectionConfig } from './data-destination-common-s-3-connection-config.js';
/**
 * Representation of the 'DataDestinationAsyncS3DataDestinationCreateRequest' schema.
 */
export type DataDestinationAsyncS3DataDestinationCreateRequest =
  DataDestinationAsyncDataDestinationCreateBase & {
    type: 'S3';
    config: DataDestinationCommonS3ConnectionConfig;
  } & Record<string, any>;
