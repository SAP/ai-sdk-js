/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorSearchConfiguration } from './vector-search-configuration.js';
import type { VectorKeyValueListPair } from './vector-key-value-list-pair.js';
import type { VectorSearchDocumentKeyValueListPair } from './vector-search-document-key-value-list-pair.js';
import type { BinaryBooleanFilter } from './binary-boolean-filter.js';
import type { ScopedKeyValueListPair } from './scoped-key-value-list-pair.js';
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
   */
  collectionMetadata?: VectorKeyValueListPair[] | any;
  /**
   * Restrict documents considered during search to those annotated with the given metadata.
   * Default: [].
   */
  documentMetadata?: VectorSearchDocumentKeyValueListPair[] | any;
  /**
   * Restrict chunks considered during search to those with the given metadata.
   * Default: [].
   */
  chunkMetadata?: VectorKeyValueListPair[];
  /**
   * Advanced filter expression for combining metadata filters with boolean logic
   */
  filter?: BinaryBooleanFilter | ScopedKeyValueListPair | any;
} & Record<string, any>;
