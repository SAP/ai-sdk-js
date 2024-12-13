/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { KeyValueListPair } from './key-value-list-pair.js';
/**
 * Representation of the 'Chunk' schema.
 */
export type Chunk = {
  id: string;
  content: string;
  /**
   * Default: [].
   */
  metadata?: KeyValueListPair[];
} & Record<string, any>;
