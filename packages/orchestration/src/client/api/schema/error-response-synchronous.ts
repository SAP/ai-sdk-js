/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ErrorResponse } from './error-response.js';
import type { ModuleResultsSynchronous } from './module-results-synchronous.js';
/**
 * Representation of the 'ErrorResponseSynchronous' schema.
 */
export type ErrorResponseSynchronous = ErrorResponse & {
  module_results?: ModuleResultsSynchronous;
} & Record<string, any>;
