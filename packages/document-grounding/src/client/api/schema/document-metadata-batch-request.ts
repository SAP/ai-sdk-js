/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentMetadataUpdate } from './document-metadata-update.js';
/**
 * Representation of the 'DocumentMetadataBatchRequest' schema.
 */
export type DocumentMetadataBatchRequest = {
  /**
   * List of document metadata updates to be applied in batch.
   * Max Items: 1000.
   */
  value: DocumentMetadataUpdate[];
} & Record<string, any>;
