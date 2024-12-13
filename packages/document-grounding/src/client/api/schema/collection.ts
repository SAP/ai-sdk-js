/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { EmbeddingConfig } from './embedding-config.js';
import type { KeyValueListPair } from './key-value-list-pair.js';
/**
 * A logical grouping of content.
 */
export type Collection = {
  title?: string;
  embeddingConfig: EmbeddingConfig;
  /**
   * Metadata attached to collection. Useful to restrict search to a subset of collections.
   * Default: [].
   */
  metadata?: KeyValueListPair[];
  /**
   * Unique identifier of a collection.
   * Format: "uuid".
   */
  id: string;
} & Record<string, any>;
