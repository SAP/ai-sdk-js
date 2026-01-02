/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'PatchPipeline' schema.
 */
export type PatchPipeline = {
  metadata?: {
    /**
     * Patch for metadata happens at key level. Value for the specific key would be inserted/replaced.
     * @example [
     *   {
     *     "key": "purpose",
     *     "value": [
     *       "demonstration"
     *     ]
     *   },
     *   {
     *     "key": "sample-key",
     *     "value": [
     *       "sample-value1",
     *       "sample-value2"
     *     ]
     *   }
     * ]
     */
    dataRepositoryMetadata?: ({
      /**
       * Max Length: 1024.
       * Min Length: 1.
       */
      key: string;
      /**
       * Min Items: 1.
       */
      value: string[];
    } & Record<string, any>)[];
  } & Record<string, any>;
  configuration?: {
    /**
     * @example "0 3 * * *"
     */
    cronExpression?: string;
  } & Record<string, any>;
} & Record<string, any>;
