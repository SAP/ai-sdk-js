/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TextOnlyBaseChunk } from './text-only-base-chunk.js';
import type { DocumentKeyValueListPair } from './document-key-value-list-pair.js';
/**
 * A single document stored in a collection by ID.
 */
export type DocumentInput = {
  chunks: TextOnlyBaseChunk[];
  metadata: DocumentKeyValueListPair[];
  /**
   * Unique identifier of a document.
   * Format: "uuid".
   */
  id: string;
} & Record<string, any>;
