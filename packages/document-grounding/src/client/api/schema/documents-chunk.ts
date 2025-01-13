/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { KeyValueListPair } from './key-value-list-pair.js';
import type { DocumentOutput } from './document-output.js';
/**
 * Representation of the 'DocumentsChunk' schema.
 */
export type DocumentsChunk = {
  /**
   * Format: "uuid".
   */
  id: string;
  title: string;
  /**
   * Default: [].
   */
  metadata?: KeyValueListPair[];
  documents: DocumentOutput[];
} & Record<string, any>;
