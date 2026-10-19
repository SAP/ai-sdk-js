/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Shape depends on the task and `output_type`. Non-finite numbers are serialised as null.
 */
export type Prediction =
  | (number | null)[][]
  | (string | number | boolean)[]
  | ({
      /**
       * Class labels in ascending order.
       */
      classes: (string | number | boolean)[];
      /**
       * `[row][rank]` → position in `classes`.
       */
      values: number[][];
      /**
       * `[row][rank]` → that class's probability.
       */
      probabilities: (number | null)[][];
    } & Record<string, any>)
  | (number | null)[]
  | (number | null)[][]
  | ({
      mean: (number | null)[];
      median: (number | null)[];
      mode: (number | null)[];
      /**
       * `[quantile][row]`.
       */
      quantiles: (number | null)[][];
      /**
       * `full` only. `[row][bucket]` over the predicted distribution.
       */
      logits?: (number | null)[][];
      /**
       * `full` only. Bucket borders; one more than buckets.
       */
      borders?: (number | null)[];
    } & Record<string, any>);
