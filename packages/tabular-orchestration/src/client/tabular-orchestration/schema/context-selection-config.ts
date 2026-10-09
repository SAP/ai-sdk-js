/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ContextSelectionStrategyEnum } from './context-selection-strategy-enum.js';
import type { FilterCondition } from './filter-condition.js';
import type { FilterConditions } from './filter-conditions.js';
import type { SamplingHeuristicConfig } from './sampling-heuristic-config.js';
import type { SamplingNoneConfig } from './sampling-none-config.js';
import type { SamplingRandomConfig } from './sampling-random-config.js';
/**
 * Configuration for context selection.
 */
export type ContextSelectionConfig = {
  /**
   * Name of the unique row-identifier column (e.g. 'ROW_INDEX'). Required for 'heuristic', and deterministic 'random' strategies.
   */
  indexColumn?: string | null;
  /**
   * Number of rows to select for context. If not provided or set to 0, context selection is skipped.
   */
  numRows?: number | null;
  /**
   * Sampling strategy for context selection.
   */
  strategy?: ContextSelectionStrategyEnum;
  /**
   * Strategy-specific configuration parameters.
   */
  strategyConfig:
    | SamplingNoneConfig
    | SamplingRandomConfig
    | SamplingHeuristicConfig;
  /**
   * Filter conditions for context selection
   */
  filterConditions?: FilterConditions | FilterCondition | null;
} & Record<string, any>;
