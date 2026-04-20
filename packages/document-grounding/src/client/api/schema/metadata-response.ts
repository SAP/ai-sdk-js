/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MetadataItem } from './metadata-item.js';
/**
 * Representation of the 'MetadataResponse' schema.
 */
export type MetadataResponse = {
  /**
   * List of metadata after updates.
   * Default: [].
   */
  current_metadata?: MetadataItem[] | null;
} & Record<string, any>;
