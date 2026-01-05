/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorSearchConfiguration } from './vector-search-configuration.js';
import type { VectorKeyValueListPair } from './vector-key-value-list-pair.js';
import type { VectorSearchDocumentKeyValueListPair } from './vector-search-document-key-value-list-pair.js';
/**
 * Representation of the 'VectorSearchFilter' schema.
 */
export type VectorSearchFilter = {
  /**
   * Identifier of this VectorSearchFilter - unique per request.
   */
  id: string;
  collectionIds: string[];
  configuration: VectorSearchConfiguration;
  /**
   * Restrict collections considered during search to those annotated with the given metadata. Useful when combined with collections=['*']
   * Default: [].
   * Max Items: 2000.
   */
  collectionMetadata?: VectorKeyValueListPair[];
  /**
   * Restrict documents considered during search to those annotated with the given metadata.
   * Default: [].
   * Max Items: 2000.
   */
  documentMetadata?: VectorSearchDocumentKeyValueListPair[];
  /**
   * Restrict chunks considered during search to those with the given metadata.
   * Default: [].
   * Max Items: 2000.
   */
  chunkMetadata?: VectorKeyValueListPair[];
} & Record<string, any>;
