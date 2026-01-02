/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalKeyValueListPair } from './retrieval-key-value-list-pair.js';
import type { Document } from './document.js';
/**
 * DataRepository schema returned by the Vector search endpoint
 */
export type DataRepositoryWithDocuments = {
  /**
   * Unique identifier of this DataRepository.
   * Format: "uuid".
   */
  id: string;
  title: string;
  /**
   * Metadata attached to DataRepository. Useful to later limit search to a subset of DataRepositories.
   */
  metadata?: RetrievalKeyValueListPair[];
  documents: Document[];
} & Record<string, any>;
