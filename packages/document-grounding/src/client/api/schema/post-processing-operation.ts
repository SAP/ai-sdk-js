/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MergeStrategyScoreReuse } from './merge-strategy-score-reuse.js';
import type { MergeStrategyReranker } from './merge-strategy-reranker.js';
import type { PostProcessingObjectReference } from './post-processing-object-reference.js';
/**
 * Representation of the 'PostProcessingOperation' schema.
 */
export type PostProcessingOperation = {
  /**
   * New ID for each PostProcessingOperation.
   * Default: "ae9eee48-4671-4321-a3e5-640adaaf26ae".
   */
  id?: string | any;
  /**
   * Maximum number of chunks to be retained in final PerSearchFilterResult.
   * Default: 5.
   */
  maxChunkCount?: number | any;
  /**
   * Merging and scoring strategy to derive final PerSearchFilterResult.
   */
  strategy: MergeStrategyScoreReuse | MergeStrategyReranker;
  inputs: (PostProcessingObjectReference | PostProcessingOperation)[];
} & Record<string, any>;
