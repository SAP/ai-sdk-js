/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SearchConfiguration } from './search-configuration.js';
import type { KeyValueListPair } from './key-value-list-pair.js';
import type { SearchDocumentKeyValueListPair } from './search-document-key-value-list-pair.js';
/**
 * Representation of the 'SearchFilter' schema.
 */
export type SearchFilter = {
  /**
   * Identifier of this SearchFilter - unique per request.
   */
  id: string;
  collectionIds: string[];
  configuration: SearchConfiguration;
  /**
   * Restrict collections considered during search to those annotated with the given metadata. Useful when combined with collections=['*']
   * Default: [].
   * Max Items: 2000.
   */
  collectionMetadata?: KeyValueListPair[];
  /**
   * Restrict documents considered during search to those annotated with the given metadata.
   * Default: [].
   * Max Items: 2000.
   */
  documentMetadata?: SearchDocumentKeyValueListPair[];
  /**
   * Restrict chunks considered during search to those with the given metadata.
   * Default: [].
   * Max Items: 2000.
   */
  chunkMetadata?: KeyValueListPair[];
} & Record<string, any>;
