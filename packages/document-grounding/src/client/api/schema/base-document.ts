/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TextOnlyBaseChunkCreate } from './text-only-base-chunk-create.js';
import type { VectorDocumentKeyValueListPair } from './vector-document-key-value-list-pair.js';
/**
 * Base class for documents, document requests and responses.
 */
export type BaseDocument = {
  chunks: TextOnlyBaseChunkCreate[];
  /**
   * Default: [].
   */
  metadata?: VectorDocumentKeyValueListPair[];
} & Record<string, any>;
