/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ChoiceQuestion' schema.
 */
export type ChoiceQuestion = {
  type: 'choice';
  /**
   * The evaluation task. This frames what is being asked and informs the answer, so phrase it to describe the decision precisely.
   */
  instructions: string | Record<string, any> | any[];
  /**
   * Map of option name to a description of that option. The descriptions inform the answer, so filling them in gives a more accurate result.
   */
  criteria: Record<string, string | Record<string, any> | any[] | null>;
};
