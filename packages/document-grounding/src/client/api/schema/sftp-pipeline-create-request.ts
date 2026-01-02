/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SFTPConfiguration } from './sftp-configuration.js';
import type { MetaData } from './meta-data.js';
/**
 * Representation of the 'SFTPPipelineCreateRequest' schema.
 */
export type SFTPPipelineCreateRequest = {
  type: 'SFTP';
  configuration: SFTPConfiguration;
  metadata?: MetaData;
} & Record<string, any>;
