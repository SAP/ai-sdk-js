/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * A feature table, at least one row. Row-oriented (list of equal-length rows; columns are then named by position) or column-oriented (object of column name → list of values). Cells are numbers, strings, booleans or null; null is a missing value. String columns are handled as categorical or free text by the preprocessing pipeline.
 */
export type Table =
  | (number | string | boolean | null)[][]
  | Record<string, (number | string | boolean | null)[]>;
