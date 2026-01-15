/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DenseRetrievalScoringConfiguration' schema.
 */
export type DenseRetrievalScoringConfiguration = {
  /**
   * Enable dense retrieval.
   * Default: true.
   */
  enabled?: boolean | any;
  /**
   * Contribution to final score.
   * Default: 1.
   */
  weight?: number | any;
} & Record<string, any>;
