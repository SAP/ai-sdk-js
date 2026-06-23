/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentMetadata } from './document-metadata.js';
/**
 * Representation of the 'DocumentMetadataUpdate' schema.
 */
export type DocumentMetadataUpdate = {
  /**
   * Unique identifier of the document to update.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   * Format: "uuid".
   */
  id: string;
  /**
   * Metadata updates for this document.
   * Max Items: 10.
   */
  metadata: DocumentMetadata[];
} & Record<string, any>;
