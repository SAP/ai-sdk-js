/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentMetadata } from './document-metadata.js';
/**
 * Representation of the 'BatchUpdateDocumentSuccess' schema.
 */
export type BatchUpdateDocumentSuccess = {
  /**
   * Unique identifier of the document.
   * Format: "uuid".
   */
  id: string;
  /**
   * Metadata updates for this document.
   */
  metadata: DocumentMetadata[];
} & Record<string, any>;
