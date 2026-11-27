/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ScoreQuestion' schema.
 */
export type ScoreQuestion = {
  type: 'score';
  /**
   * The evaluation task. This frames what is being asked and informs the answer, so phrase it to describe the decision precisely.
   */
  instructions: string | Record<string, any> | any[];
  /**
   * Ordered list of level descriptions, lowest first. The descriptions inform the answer, so filling them in gives a more accurate result.
   * Min Items: 2.
   * Max Items: 255.
   */
  criteria: (string | Record<string, any> | any[])[];
};
