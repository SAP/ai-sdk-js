/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineResponse } from './base-pipeline-response.js';
import type { MetaData } from './meta-data.js';
/**
 * Representation of the 'WorkZonePipelineGetResponse' schema.
 */
export type WorkZonePipelineGetResponse = BasePipelineResponse & {
  type?: 'WorkZone';
  metadata: MetaData;
} & Record<string, any>;
