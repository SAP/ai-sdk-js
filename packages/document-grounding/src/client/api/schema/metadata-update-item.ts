/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MetadataKeyUpdate } from './metadata-key-update.js';
/**
 * Representation of the 'MetadataUpdateItem' schema.
 */
export type MetadataUpdateItem = {
  /**
   * List of collection or document or chunk ids for which the metadata should be updated
   */
  ids: string[];
  /**
   * List of metadata updates for the given resource ids
   */
  metadataUpdates: MetadataKeyUpdate[];
} & Record<string, any>;
