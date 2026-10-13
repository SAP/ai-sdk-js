/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * A single filter condition for context selection.
 */
export type FilterCondition = {
  /**
   * Field name to filter on
   */
  field: string;
  /**
   * Filter operator (e.g., 'eq', 'gte', 'lte')
   */
  op: string;
  /**
   * Value to compare against
   */
  value: any;
} & Record<string, any>;
