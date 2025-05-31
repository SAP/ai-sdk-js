/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineResponse } from './base-pipeline-response.js';
import type { MSSharePointConfigurationGetResponse } from './ms-share-point-configuration-get-response.js';
/**
 * Representation of the 'MSSharePointPipelineGetResponse' schema.
 */
export type MSSharePointPipelineGetResponse = BasePipelineResponse & {
  type?: 'MSSharePoint';
  configuration: MSSharePointConfigurationGetResponse;
} & Record<string, any>;
