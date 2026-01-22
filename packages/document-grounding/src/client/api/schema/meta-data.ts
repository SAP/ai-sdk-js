/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataRepositoryMetaDataStrict } from './data-repository-meta-data-strict.js';
/**
 * Representation of the 'MetaData' schema.
 */
export type MetaData = {
  /**
   * @example "destination-name"
   */
  destination?: string;
  dataRepositoryMetadata?: DataRepositoryMetaDataStrict;
} & Record<string, any>;
