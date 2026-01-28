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
  enabled?: boolean | null;
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
    | null;
  /**
   * Contribution to final score.
   * Default: 1.
   */
  weight?: number | null;
  scoreComputationStrategy?: BoostingScoreComputationStrategy;
} & Record<string, any>;
