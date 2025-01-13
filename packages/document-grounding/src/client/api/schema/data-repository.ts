/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { KeyValueListPair } from './key-value-list-pair.js';
import type { DataRepositoryType } from './data-repository-type.js';
/**
 * DataRepository schema expected by Retrieval.
 */
export type DataRepository = {
  /**
   * Unique identifier of this DataRepository.
   * Format: "uuid".
   */
  id: string;
  title: string;
  /**
   * Metadata attached to DataRepository. Useful to later limit search to a subset of DataRepositories.
   * Default: [].
   */
  metadata?: KeyValueListPair[];
  type: DataRepositoryType;
} & Record<string, any>;
