/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MetadataConfigurationStruct } from './metadata-configuration-struct.js';
import type { DataRepositoryMetaDataStrict } from './data-repository-meta-data-strict.js';
/**
 * Representation of the 'MetadataConfiguration' schema.
 */
export type MetadataConfiguration = {
  type: 'metadata';
  configuration: MetadataConfigurationStruct;
  metadata?: {
    dataRepositoryMetadata: DataRepositoryMetaDataStrict;
  } & Record<string, any>;
} & Record<string, any>;
