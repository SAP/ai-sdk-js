/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { DataDestinationCreateBase } from './data-destination-create-base.js';
import type { HDLConnectionConfig } from './hdl-connection-config.js';
/**
 * Representation of the 'HDLDataDestinationCreateRequest' schema.
 */
export type HDLDataDestinationCreateRequest = DataDestinationCreateBase & {
  type: 'HDL';
  config: HDLConnectionConfig;
} & Record<string, any>;
