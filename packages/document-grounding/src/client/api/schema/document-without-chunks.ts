/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorDocumentKeyValueListPair } from './vector-document-key-value-list-pair.js';
/**
 * A single document stored in a collection by ID without exposing its chunks.
 */
export type DocumentWithoutChunks = {
  metadata: VectorDocumentKeyValueListPair[];
  /**
   * Unique identifier of a document.
   * Format: "uuid".
   */
  id: string;
} & Record<string, any>;
