/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Explanation data for predictions.
 */
export type ExplanationResult = {
  /**
   * Column scores per query row extracted from the model (higher means more weight was put on this column).
   */
  top_column_scores?: Record<string, number>[] | null;
  /**
   * 2D array where each subarray contains indices of most relevant context rows for that query row. The first dimension indexes query rows, the second dimension indexes all rows as a sequential integer index.
   */
  top_relevant_context_rows?: number[][] | null;
} & Record<string, any>;
