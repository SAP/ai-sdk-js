/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { CommonConfiguration } from './common-configuration.js';
import type { MetaData } from './meta-data.js';
/**
 * Representation of the 'S3PipelineCreateRequest' schema.
 */
export type S3PipelineCreateRequest = {
  type: 'S3';
  configuration: CommonConfiguration;
  metadata?: MetaData;
} & Record<string, any>;
