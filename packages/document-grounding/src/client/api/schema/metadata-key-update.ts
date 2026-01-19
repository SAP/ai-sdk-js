/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MetadataOperation } from './metadata-operation.js';
/**
 * Representation of the 'MetadataKeyUpdate' schema.
 */
export type MetadataKeyUpdate = {
  /**
   * Key to update
   * Min Length: 1.
   */
  key: string;
  /**
   * Update operation executed for the key
   */
  operations?: MetadataOperation[] | null;
} & Record<string, any>;
