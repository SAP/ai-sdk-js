/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierOutputType } from './classifier-output-type.js';
/**
 * Representation of the 'ClassifierPredictParams' schema.
 */
export type ClassifierPredictParams = {
  /**
   * `probas`: one probability per class per test row. `preds`: one label per test row. `top_k`: the k most probable classes per row, as positions plus probabilities.
   */
  output_type?: ClassifierOutputType;
  /**
   * Required with `output_type: top_k`, rejected with any other output type.
   */
  top_k?: number | null;
};
