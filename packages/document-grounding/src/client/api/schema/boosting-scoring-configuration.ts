/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BoostingScoreComputationStrategy } from './boosting-score-computation-strategy.js';
/**
 * Representation of the 'BoostingScoringConfiguration' schema.
 */
export type BoostingScoringConfiguration = {
  /**
   * Enable metadata-based boosting.
   * Default: true.
   */
  enabled?: boolean | any;
  /**
   * Default: [].
   */
  metadata?:
    | ({
        /**
         * Max Length: 1024.
         */
        key: string;
        value: string[];
        /**
         * Default: "document".
         */
        scope?: 'repository' | 'document' | 'chunk';
        weight: number;
      } & Record<string, any>)[]
    | any;
  /**
   * Contribution to final score.
   * Default: 1.
   */
  weight?: number | any;
  /**
   * How the similarity between document metadata and boosted key-value pairs is computed.
   * Default: "match_count".
   */
  scoreComputationStrategy?: BoostingScoreComputationStrategy | any;
} & Record<string, any>;
