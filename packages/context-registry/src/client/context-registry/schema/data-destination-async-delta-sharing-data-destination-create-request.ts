/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncDataDestinationCreateBase } from './data-destination-async-data-destination-create-base.js';
import type { DataDestinationCommonDeltaSharingConnectionConfig } from './data-destination-common-delta-sharing-connection-config.js';
/**
 * Representation of the 'DataDestinationAsyncDeltaSharingDataDestinationCreateRequest' schema.
 */
export type DataDestinationAsyncDeltaSharingDataDestinationCreateRequest =
  DataDestinationAsyncDataDestinationCreateBase & {
    type: 'DELTA_SHARING';
    config: DataDestinationCommonDeltaSharingConnectionConfig;
    /**
     * Adapter type for Delta Sharing
     * Default: "DeltaShare".
     */
    adapterType?: 'DeltaShare';
  } & Record<string, any>;
