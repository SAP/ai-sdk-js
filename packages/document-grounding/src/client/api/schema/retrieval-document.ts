/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentKeyValueListPair } from './document-key-value-list-pair.js';
import type { Chunk } from './chunk.js';
/**
 * Representation of the 'RetrievalDocument' schema.
 */
export type RetrievalDocument = {
  id: string;
  /**
   * Default: [].
   */
  metadata?: DocumentKeyValueListPair[];
  chunks: Chunk[];
} & Record<string, any>;
