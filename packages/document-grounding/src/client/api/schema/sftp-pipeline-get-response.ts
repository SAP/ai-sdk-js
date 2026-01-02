/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BasePipelineResponse } from './base-pipeline-response.js';
import type { SFTPConfiguration } from './sftp-configuration.js';
/**
 * Representation of the 'SFTPPipelineGetResponse' schema.
 */
export type SFTPPipelineGetResponse = BasePipelineResponse & {
  type?: 'SFTP';
  configuration: SFTPConfiguration;
} & Record<string, any>;
