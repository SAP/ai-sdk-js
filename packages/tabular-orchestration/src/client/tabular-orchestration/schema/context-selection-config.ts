/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ContextSelectionStrategyEnum } from './context-selection-strategy-enum.js';
import type { SamplingRandomConfig } from './sampling-random-config.js';
import type { SamplingHeuristicConfig } from './sampling-heuristic-config.js';
import type { FilterConditions } from './filter-conditions.js';
import type { FilterCondition } from './filter-condition.js';
/**
 * Configuration for context selection.
 */
export type ContextSelectionConfig = {
  /**
   * Number of rows to select for context. If not provided or set to 0, context selection is skipped.
   */
  numRows?: number | null;
  strategy?: ContextSelectionStrategyEnum;
  /**
   * Strategy-specific configuration parameters.
   */
  strategyConfig?: SamplingRandomConfig | SamplingHeuristicConfig | null;
  /**
   * Filter conditions for context selection
   */
  filterConditions?: FilterConditions | FilterCondition | null;
  /**
   * When true, show additional debug information for context selection
   */
  verbose?: boolean;
} & Record<string, any>;
