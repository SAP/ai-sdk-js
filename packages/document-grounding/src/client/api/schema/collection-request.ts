/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { EmbeddingConfig } from './embedding-config.js';
import type { KeyValueListPair } from './key-value-list-pair.js';
/**
 * A request for creating a new, single collection.
 */
export type CollectionRequest = {
  title?: string | null;
  embeddingConfig: EmbeddingConfig;
  /**
   * Metadata attached to collection. Useful to restrict search to a subset of collections.
   * Default: [].
   */
  metadata?: KeyValueListPair[];
} & Record<string, any>;
