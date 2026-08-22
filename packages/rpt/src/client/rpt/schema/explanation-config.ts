/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Configuration for explainability outputs.
 */
export type ExplanationConfig = {
  /**
   * For how many columns to output column scores (optional, default is 0). 0 by default (no explainability). Max value is 20.
   * Maximum: 20.
   */
  top_column_scores?: number;
  /**
   * For how many context rows to return indices per query row (optional, default is 0). 0 by default (no explainability). Max value is 20.
   * Maximum: 20.
   */
  top_relevant_context_rows?: number;
};
