/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TextOnlyBaseChunk } from './text-only-base-chunk.js';
import type { DocumentKeyValueListPair } from './document-key-value-list-pair.js';
/**
 * Base class for documents, document requests and responses.
 */
export type BaseDocument = {
  chunks: TextOnlyBaseChunk[];
  metadata: DocumentKeyValueListPair[];
} & Record<string, any>;
