/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Stream options for output filtering. Will be ignored if stream is false.
 */
export type FilteringStreamOptions = {
  /**
   * Number of characters that should be additionally sent to content filtering services from previous chunks as additional context.
   * Maximum: 10000.
   */
  overlap?: number;
};
