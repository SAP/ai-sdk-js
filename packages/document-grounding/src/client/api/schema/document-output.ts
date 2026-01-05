/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorDocumentKeyValueListPair } from './vector-document-key-value-list-pair.js';
import type { VectorChunk } from './vector-chunk.js';
/**
 * Representation of the 'DocumentOutput' schema.
 */
export type DocumentOutput = {
  /**
   * Format: "uuid".
   */
  id: string;
  /**
   * Default: [].
   */
  metadata?: VectorDocumentKeyValueListPair[];
  chunks: VectorChunk[];
} & Record<string, any>;
