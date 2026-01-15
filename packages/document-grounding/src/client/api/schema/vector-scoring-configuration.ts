/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DenseRetrievalScoringConfiguration } from './dense-retrieval-scoring-configuration.js';
import type { KeyWordRetrievalScoringConfiguration } from './key-word-retrieval-scoring-configuration.js';
import type { BoostingScoringConfiguration } from './boosting-scoring-configuration.js';
import type { ScoresAggregationStrategy } from './scores-aggregation-strategy.js';
/**
 * Representation of the 'VectorScoringConfiguration' schema.
 */
export type VectorScoringConfiguration = {
  /**
   * Default: {
   *   "enabled": true,
   *   "weight": 1
   * }.
   */
  denseRetrieval?: DenseRetrievalScoringConfiguration | any;
  /**
   * Default: {
   *   "enabled": true,
   *   "weight": 1,
   *   "extractKeyWordsFromQuery": false
   * }.
   */
  keywordRetrieval?: KeyWordRetrievalScoringConfiguration | any;
  /**
   * Default: {
   *   "enabled": true,
   *   "metadata": [],
   *   "weight": 1,
   *   "scoreComputationStrategy": "match_count"
   * }.
   */
  boosting?: BoostingScoringConfiguration | any;
  /**
   * Minimum chunk score threshold.
   */
  scoreThreshold?: number | any;
  /**
   * Methodology to calculate the final aggregate score.
   * Default: "weighted_average".
   */
  aggregationStrategy?: ScoresAggregationStrategy | any;
} & Record<string, any>;
