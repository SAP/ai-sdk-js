/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncDataDestinationCreateBase } from './data-destination-async-data-destination-create-base.js';
import type { DataDestinationCommonAzureConnectionConfig } from './data-destination-common-azure-connection-config.js';
/**
 * Representation of the 'DataDestinationAsyncAzureDataDestinationCreateRequest' schema.
 */
export type DataDestinationAsyncAzureDataDestinationCreateRequest =
  DataDestinationAsyncDataDestinationCreateBase & {
    type: 'AZURE';
    config: DataDestinationCommonAzureConnectionConfig;
  } & Record<string, any>;
