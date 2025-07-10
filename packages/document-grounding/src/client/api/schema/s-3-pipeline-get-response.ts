/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineResponse } from './base-pipeline-response.js';
import type { CommonConfiguration } from './common-configuration.js';
/**
 * Representation of the 'S3PipelineGetResponse' schema.
 */
export type S3PipelineGetResponse = BasePipelineResponse & {
  type?: 'S3';
  configuration: CommonConfiguration;
} & Record<string, any>;
