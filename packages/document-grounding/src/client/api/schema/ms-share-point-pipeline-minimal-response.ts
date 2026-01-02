/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineMinimalResponse } from './base-pipeline-minimal-response.js';
import type { MSSharePointConfigurationMinimal } from './ms-share-point-configuration-minimal.js';
/**
 * Representation of the 'MSSharePointPipelineMinimalResponse' schema.
 */
export type MSSharePointPipelineMinimalResponse =
  BasePipelineMinimalResponse & {
    type: 'MSSharePoint';
    configuration: MSSharePointConfigurationMinimal;
    /**
     * @example true
     */
    metadata?: boolean;
  } & Record<string, any>;
