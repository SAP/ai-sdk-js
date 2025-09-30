/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BasePipelineMinimalResponse' schema.
 */
export type BasePipelineMinimalResponse = {
  /**
   * @example "uuid"
   */
  id: string;
  status:
    | 'NEW'
    | 'UNKNOWN'
    | 'INPROGRESS'
    | 'FINISHED'
    | 'FINISHEDWITHERRORS'
    | 'TIMEOUT'
    | any;
} & Record<string, any>;
