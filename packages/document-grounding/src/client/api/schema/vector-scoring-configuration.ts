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
  denseRetrieval?: DenseRetrievalScoringConfiguration;
  keywordRetrieval?: KeyWordRetrievalScoringConfiguration;
  boosting?: BoostingScoringConfiguration;
  /**
   * Minimum chunk score threshold.
   */
  scoreThreshold?: number | null;
  aggregationStrategy?: ScoresAggregationStrategy;
} & Record<string, any>;
