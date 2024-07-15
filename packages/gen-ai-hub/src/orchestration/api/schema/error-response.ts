/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResultsItem } from './module-results-item.js';
/**
 * Representation of the 'ErrorResponse' schema.
 */
export type ErrorResponse = {
  request_id: string;
  code: number;
  message: string;
  /**
   * Where the error occurred.
   * @example "LLM Module"
   */
  location: string;
  /**
   * Results of each module up until the error.
   */
  module_results?: ModuleResultsItem[];
} & Record<string, any>;
