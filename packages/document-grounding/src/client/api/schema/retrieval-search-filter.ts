/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalSearchConfiguration } from './retrieval-search-configuration.js';
import type { DataRepositoryType } from './data-repository-type.js';
import type { RetrievalKeyValueListPair } from './retrieval-key-value-list-pair.js';
import type { RetrievalSearchDocumentKeyValueListPair } from './retrieval-search-document-key-value-list-pair.js';
/**
 * Limit scope of search to certain DataRepositories, Documents or Chunks.
 */
export type RetrievalSearchFilter = {
  /**
   * Identifier of this RetrievalSearchFilter - unique per request.
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
  dataRepositoryMetadata?: RetrievalKeyValueListPair[];
  /**
   * Restrict documents considered during search to those annotated with the given metadata.
   * Default: [].
   */
  documentMetadata?: RetrievalSearchDocumentKeyValueListPair[];
  /**
   * Restrict chunks considered during search to those with the given metadata.
   * Default: [].
   */
  chunkMetadata?: RetrievalKeyValueListPair[];
} & Record<string, any>;
