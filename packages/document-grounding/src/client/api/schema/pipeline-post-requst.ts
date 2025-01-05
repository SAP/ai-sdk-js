/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'PipelinePostRequst' schema.
 */
export type PipelinePostRequst = {
  /**
   * @example "MSSharePoint"
   */
  type: string;
  configuration: {
    /**
     * @example "destination-name"
     */
    destination: string;
    sharePoint?: {
      site?: {
        /**
         * @example "sharepoint-site-name"
         */
        name?: string;
        /**
         * @example [
         *   "/testFolder1",
         *   "testFolder2"
         * ]
         */
        includePaths?: string[];
      } & Record<string, any>;
    } & Record<string, any>;
  } & Record<string, any>;
} & Record<string, any>;
