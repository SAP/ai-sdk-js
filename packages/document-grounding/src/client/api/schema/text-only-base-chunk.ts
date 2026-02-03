/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorKeyValueListPair } from './vector-key-value-list-pair.js';
/**
 * Schema for a text-only chunk.
 */
export type TextOnlyBaseChunk = {
  content: string;
  /**
   * Default: [].
   */
  metadata?: VectorKeyValueListPair[];
  /**
   * Unique identifier of a chuk.
   * Format: "uuid".
   */
  id: string;
} & Record<string, any>;
