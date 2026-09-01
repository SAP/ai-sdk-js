/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { DataDestinationCreateBase } from './data-destination-create-base.js';
import type { DeltaSharingConnectionConfig } from './delta-sharing-connection-config.js';
/**
 * Representation of the 'DeltaSharingDataDestinationCreateRequest' schema.
 */
export type DeltaSharingDataDestinationCreateRequest =
  DataDestinationCreateBase & {
    type: 'DELTA_SHARING';
    config: DeltaSharingConnectionConfig;
    /**
     * Adapter type for Delta Sharing
     * Default: "DeltaShare".
     */
    adapterType?: 'DeltaShare';
  } & Record<string, any>;
