/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { GroundingFilterId } from './grounding-filter-id.js';
import type { GroundingFilterSearchConfiguration } from './grounding-filter-search-configuration.js';
import type { DataRepositoryType } from './data-repository-type.js';
import type { KeyValueListPair } from './key-value-list-pair.js';
import type { SearchDocumentKeyValueListPair } from './search-document-key-value-list-pair.js';
/**
 * Representation of the 'DocumentGroundingFilter' schema.
 */
export type DocumentGroundingFilter = {
  id: GroundingFilterId;
  search_config?: GroundingFilterSearchConfiguration;
  /**
   * Specify ['*'] to search across all DataRepositories or give a specific list of DataRepository ids.
   * Default: [
   *   "*"
   * ].
   */
  data_repositories?: string[];
  data_repository_type: DataRepositoryType;
  /**
   * Restrict DataRepositories considered during search to those annotated with the given metadata. Useful when combined with dataRepositories=['*']
   */
  data_repository_metadata?: KeyValueListPair[];
  /**
   * Restrict documents considered during search to those annotated with the given metadata.
   */
  document_metadata?: SearchDocumentKeyValueListPair[];
  /**
   * Restrict chunks considered during search to those with the given metadata.
   */
  chunk_metadata?: KeyValueListPair[];
} & Record<string, any>;
