/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalSearchConfiguration } from './retrieval-search-configuration.js';
import type { DataRepositoryType } from './data-repository-type.js';
import type { KeyValueListPair } from './key-value-list-pair.js';
import type { SearchDocumentKeyValueListPair } from './search-document-key-value-list-pair.js';
/**
 * Limit scope of search to certain DataRepositories, Documents or Chunks.
 */
export type RetrievalSearchFilter = {
  /**
   * Identifier of this SearchFilter - unique per request.
   */
  id: string;
  searchConfiguration?: RetrievalSearchConfiguration;
  /**
   * Specify ['*'] to search across all DataRepositories or give a specific list of DataRepository ids.
   * Default: [
   *   "*"
   * ].
   */
  dataRepositories?: string[];
  dataRepositoryType: DataRepositoryType;
  /**
   * Restrict DataRepositories considered during search to those annotated with the given metadata. Useful when combined with dataRepositories=['*']
   * Default: [].
   */
  dataRepositoryMetadata?: KeyValueListPair[];
  /**
   * Restrict documents considered during search to those annotated with the given metadata.
   * Default: [].
   */
  documentMetadata?: SearchDocumentKeyValueListPair[];
  /**
   * Restrict chunks considered during search to those with the given metadata.
   * Default: [].
   */
  chunkMetadata?: KeyValueListPair[];
} & Record<string, any>;
