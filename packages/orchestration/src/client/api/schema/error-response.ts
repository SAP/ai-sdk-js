/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Error } from './error.js';
import type { ErrorList } from './error-list.js';
/**
 * Representation of the 'ErrorResponse' schema.
 */
export type ErrorResponse = {
  error: Error | ErrorList;
} & Record<string, any>;
