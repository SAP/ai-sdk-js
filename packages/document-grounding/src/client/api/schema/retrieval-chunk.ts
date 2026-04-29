/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalKeyValueListPair } from './retrieval-key-value-list-pair.js';
import type { SearchScores } from './search-scores.js';
import type { Score } from './score.js';
/**
 * Representation of the 'RetrievalChunk' schema.
 */
export type RetrievalChunk = {
  id: string;
  content: string;
  /**
   * Default: [].
   */
  metadata?: RetrievalKeyValueListPair[];
  searchScores?: SearchScores;
  postProcessingScore?: Score;
} & Record<string, any>;
