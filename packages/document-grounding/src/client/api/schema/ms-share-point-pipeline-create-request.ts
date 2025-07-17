/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MSSharePointConfiguration } from './ms-share-point-configuration.js';
import type { MetaData } from './meta-data.js';
/**
 * Representation of the 'MSSharePointPipelineCreateRequest' schema.
 */
export type MSSharePointPipelineCreateRequest = {
  type: 'MSSharePoint';
  configuration: MSSharePointConfiguration;
  metadata?: MetaData;
} & Record<string, any>;
