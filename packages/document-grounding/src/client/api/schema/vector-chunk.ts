/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorKeyValueListPair } from './vector-key-value-list-pair.js';
/**
 * Representation of the 'VectorChunk' schema.
 */
export type VectorChunk = {
  id: string;
  content: string;
  /**
   * Default: [].
   */
  metadata?: VectorKeyValueListPair[];
} & Record<string, any>;
