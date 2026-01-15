/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalSearchConfiguration } from './retrieval-search-configuration.js';
import type { DataRepositoryType } from './data-repository-type.js';
import type { RetrievalKeyValueListPair } from './retrieval-key-value-list-pair.js';
import type { RetrievalSearchDocumentKeyValueListPair } from './retrieval-search-document-key-value-list-pair.js';
import type { BinaryBooleanFilter } from './binary-boolean-filter.js';
import type { ScopedKeyValueListPair } from './scoped-key-value-list-pair.js';
import type { VectorScoringConfiguration } from './vector-scoring-configuration.js';
/**
 * Representation of the 'RetrievalVectorSearchFilter' schema.
 */
export type RetrievalVectorSearchFilter = {
  /**
   * Identifier of this RetrievalSearchFilter - unique per request.
   */
  id: string;
  /**
   * Default: {}.
   */
  searchConfiguration?: RetrievalSearchConfiguration | any;
  /**
   * Specify ['*'] to search across all DataRepositories or give a specific list of DataRepository ids.
   * Default: [
   *   "*"
   * ].
   */
  dataRepositories?: string[];
  /**
   * Default: "vector".
   */
  dataRepositoryType?: DataRepositoryType | any;
  /**
   * Destination Name of remote instance.
   */
  remoteName?: string | any;
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
  /**
   * Filter to apply on the search results. This cannot be used together with 'documentMetadata'. The depth of the filter must not exceed 5 levels.
   */
  filter?: BinaryBooleanFilter | ScopedKeyValueListPair | any;
  /**
   * Scoring configuration for retrieval and ranking.
   * Default: {
   *   "denseRetrieval": {
   *     "enabled": true,
   *     "weight": 1
   *   },
   *   "keywordRetrieval": {
   *     "enabled": true,
   *     "extractKeyWordsFromQuery": false,
   *     "weight": 1
   *   },
   *   "boosting": {
   *     "enabled": true,
   *     "metadata": [],
   *     "scoreComputationStrategy": "match_count",
   *     "weight": 1
   *   },
   *   "aggregationStrategy": "weighted_average"
   * }.
   */
  scoringConfiguration?: VectorScoringConfiguration | any;
} & Record<string, any>;
