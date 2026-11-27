/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'NoulQuestion' schema.
 */
export type NoulQuestion = {
  type: 'noul';
  /**
   * The evaluation task. This frames what is being asked and informs the answer, so phrase it to describe the decision precisely.
   */
  instructions: string | Record<string, any> | any[];
  /**
   * Optional descriptions of the "true"/"false" answers. When set, each is used to inform the answer.
   */
  criteria?: Record<string, string | Record<string, any> | any[] | null> | null;
};
