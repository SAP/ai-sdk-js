/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'S3Configuration' schema.
 */
export type S3Configuration = {
  /**
   * @example "generic-secret-name"
   */
  destination: string;
  s3?: {
    /**
     * @example [
     *   "/testFolder1",
     *   "/testFolder2"
     * ]
     */
    includePaths?: string[];
  } & Record<string, any>;
} & Record<string, any>;
