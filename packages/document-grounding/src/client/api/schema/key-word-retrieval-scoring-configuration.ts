/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'KeyWordRetrievalScoringConfiguration' schema.
 */
export type KeyWordRetrievalScoringConfiguration = {
  /**
   * Enable dense retrieval.
   * Default: true.
   */
  enabled?: boolean | null;
  /**
   * Contribution to final score.
   * Default: 1.
   */
  weight?: number | null;
  /**
   * Extract Keywords from Query.
   */
  extractKeyWordsFromQuery?: boolean | null;
} & Record<string, any>;
