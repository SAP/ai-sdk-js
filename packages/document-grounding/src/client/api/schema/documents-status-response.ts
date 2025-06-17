/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentStatus } from './document-status.js';
/**
 * Representation of the 'DocumentsStatusResponse' schema.
 */
export type DocumentsStatusResponse = {
  /**
   * @example 1
   */
  count?: number;
  resources?: ({
    /**
     * @example "uuid"
     */
    id?: string;
    status?: DocumentStatus;
  } & Record<string, any>)[];
} & Record<string, any>;
