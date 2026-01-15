/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MergeStrategyType } from './merge-strategy-type.js';
/**
 * The MergeStrategyScoreReuse merges the given PerFilterSearchResult instances according to the scores returned by the downstream retrieval process. It is important that the scores are comparable, meaning they should come from the same embedding model or reranker model.
 */
export type MergeStrategyScoreReuse = {
  /**
   * The type of merge strategy.
   * Default: "scoreReuse".
   */
  type?: MergeStrategyType | any;
} & Record<string, any>;
