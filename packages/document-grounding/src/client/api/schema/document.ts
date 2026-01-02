/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalDocumentKeyValueListPair } from './retrieval-document-key-value-list-pair.js';
import type { RetrievalChunk } from './retrieval-chunk.js';
/**
 * Representation of the 'Document' schema.
 */
export type Document = {
  id: string;
  /**
   * Default: [].
   */
  metadata?: RetrievalDocumentKeyValueListPair[];
  chunks: RetrievalChunk[];
} & Record<string, any>;
