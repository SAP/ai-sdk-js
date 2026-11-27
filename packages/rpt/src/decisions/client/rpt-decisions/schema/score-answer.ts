/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * A ``score`` answer in a ``/systemone`` response.
 */
export type ScoreAnswer = {
  type: 'score';
  /**
   * Probability-weighted score.
   */
  score: number;
  /**
   * Level index to description.
   */
  legend: Record<string, string>;
  /**
   * Probability per level.
   */
  probabilities: Record<string, number>;
  /**
   * Confidence of the answer, in [0, 1]. A certainty score derived from the probability distribution: 0 when the options are equally likely (no information) and 1 when all probability is on a single answer. Distinct from the raw answer probabilities, which are reported separately.
   * Maximum: 1.
   */
  confidence: number;
};
