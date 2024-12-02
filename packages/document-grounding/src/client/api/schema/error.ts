/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ErrorDetail } from './error-detail.js';
/**
 * Representation of the 'Error' schema.
 */
export type Error = {
  code: number;
  message: string;
  target: string;
  details: ErrorDetail[];
} & Record<string, any>;
