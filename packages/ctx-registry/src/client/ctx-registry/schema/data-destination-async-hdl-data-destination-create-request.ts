/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncDataDestinationCreateBase } from './data-destination-async-data-destination-create-base.js';
import type { DataDestinationCommonHDLConnectionConfig } from './data-destination-common-hdl-connection-config.js';
/**
 * Representation of the 'DataDestinationAsyncHDLDataDestinationCreateRequest' schema.
 */
export type DataDestinationAsyncHDLDataDestinationCreateRequest =
  DataDestinationAsyncDataDestinationCreateBase & {
    type: 'HDL';
    config: DataDestinationCommonHDLConnectionConfig;
  } & Record<string, any>;
