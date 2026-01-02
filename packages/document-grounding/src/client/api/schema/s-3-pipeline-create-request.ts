/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { S3Configuration } from './s-3-configuration.js';
import type { MetaData } from './meta-data.js';
/**
 * Representation of the 'S3PipelineCreateRequest' schema.
 */
export type S3PipelineCreateRequest = {
  type: 'S3';
  configuration: S3Configuration;
  metadata?: MetaData;
} & Record<string, any>;
