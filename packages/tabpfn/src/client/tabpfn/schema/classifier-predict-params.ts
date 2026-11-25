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
   * What `prediction` contains:
   *
   * * `probas`: one probability for each class, for each row.
   * * `preds`: one label for each row.
   * * `top_k`: the most probable classes for each row.
   */
  output_type?: ClassifierOutputType;
  /**
   * Number of classes that `top_k` returns for each row. Required with `output_type=top_k`. Other output types do not permit it.
   */
  top_k?: number | null;
};
