/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ErrorResponse } from './error-response.js';
import type { ModuleResultsStreaming } from './module-results-streaming.js';
/**
 * Representation of the 'ErrorResponseStreaming' schema.
 */
export type ErrorResponseStreaming = ErrorResponse & {
  module_results?: ModuleResultsStreaming;
} & Record<string, any>;
