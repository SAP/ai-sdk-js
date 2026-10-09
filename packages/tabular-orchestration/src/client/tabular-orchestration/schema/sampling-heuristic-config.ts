/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SamplingHeuristicConfig' schema.
 */
export type SamplingHeuristicConfig = {
  /**
   * Fraction of numRows filled by scoring method (remainder is random fill). Must be between 0 and 1.
   * Default: 0.67.
   */
  methodRatio?: number;
  /**
   * Numeric fuzzy threshold as a fraction of the absolute query value. E.g. 0.1 = ±10%.
   * Default: 0.1.
   */
  fuzzyNumPct?: number;
  /**
   * Max CASE WHEN expressions per subquery chunk (avoids HANA parse-tree depth limit).
   * Default: 100.
   */
  chunkSize?: number;
  /**
   * Column count above which chunked SQL is used instead of a flat query.
   * Default: 150.
   */
  chunkThreshold?: number;
  /**
   * If set, scoring runs against a random subsample of this many rows instead of the full table. None = full table scan.
   */
  poolSize?: number | null;
  /**
   * Day window for fuzzy date matching. A date column scores 1 if abs(DAYS_BETWEEN(row_date, query_date)) <= dateFuzzyDays. Set to 0 for exact date match.
   * Default: 30.
   */
  fuzzyDateDays?: number;
  /**
   * When true, heuristic sampling falls back to random on timeout instead of raising an error. Set by the orchestrator when strategy=AUTO.
   */
  allowTimeoutFallback?: boolean;
} & Record<string, any>;
