/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncDataDestinationCreateBase } from './data-destination-async-data-destination-create-base.js';
import type { DataDestinationCommonGCSConnectionConfig } from './data-destination-common-gcs-connection-config.js';
/**
 * Representation of the 'DataDestinationAsyncGCSDataDestinationCreateRequest' schema.
 */
export type DataDestinationAsyncGCSDataDestinationCreateRequest =
  DataDestinationAsyncDataDestinationCreateBase & {
    type: 'GCS';
    config: DataDestinationCommonGCSConnectionConfig;
  } & Record<string, any>;
