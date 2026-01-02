/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { IncludePathsArray } from './include-paths-array.js';
/**
 * Representation of the 'S3Configuration' schema.
 */
export type S3Configuration = {
  /**
   * @example "generic-secret-name"
   */
  destination: string;
  s3?: {
    includePaths?: IncludePathsArray;
  } & Record<string, any>;
  /**
   * @example "0 3 * * *"
   */
  cronExpression?: string;
} & Record<string, any>;
