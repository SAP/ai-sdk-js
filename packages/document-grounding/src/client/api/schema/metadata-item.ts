/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorKeyValueListPair } from './vector-key-value-list-pair.js';
/**
 * Representation of the 'MetadataItem' schema.
 */
export type MetadataItem = {
  /**
   * ID of collection
   * Format: "uuid".
   */
  id: string;
  /**
   * List of metadata of the collections or documents or chunks
   * Default: [].
   */
  metadata?: VectorKeyValueListPair[] | null;
} & Record<string, any>;
