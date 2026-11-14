/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * The training target: exactly one column, one value per training row. A flat list, a list of one-element rows, or an object with a single column. Classification labels may be strings, integers, floats or booleans; regression targets must be numeric.
 */
export type Target =
  | (number | string | boolean | null)[]
  | (number | string | boolean | null)[][]
  | Record<string, (number | string | boolean | null)[]>;
