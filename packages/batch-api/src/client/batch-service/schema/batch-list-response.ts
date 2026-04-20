/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BatchListResponse' schema.
 */
export type BatchListResponse = {
  count?: number;
  resources?: ({
    /**
     * Format: "uuid".
     */
    id?: string;
    type?: string;
    provider?: string;
    /**
     * Format: "date-time".
     */
    created_at?: string;
    status?: string;
  } & Record<string, any>)[];
} & Record<string, any>;
