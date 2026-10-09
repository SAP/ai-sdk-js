/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ModelRpt15Explanations' schema.
 */
export type ModelRpt15Explanations = {
  /**
   * (Optional, RPT Default: 0) Number of top column scores to return. A value of 0 disables explainability.
   * Maximum: 20.
   */
  top_column_scores?: number;
  /**
   * (Optional) Number of most relevant context rows to return for each query row.
   * Maximum: 20.
   */
  top_relevant_context_rows?: number | null;
} & Record<string, any>;
