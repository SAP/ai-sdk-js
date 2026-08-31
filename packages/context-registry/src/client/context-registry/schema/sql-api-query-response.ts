/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SqlApiColumnInfo } from './sql-api-column-info.js';
/**
 * Representation of the 'SqlApiQueryResponse' schema.
 */
export type SqlApiQueryResponse = {
  columns?: SqlApiColumnInfo[];
  rows?: any[][];
  rowCount?: number;
  truncated?: boolean;
  hasMore?: boolean;
  executedAt?: string;
} & Record<string, any>;
