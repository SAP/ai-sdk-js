/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SqlApiTableDefinition } from './sql-api-table-definition.js';
/**
 * Representation of the 'SqlApiTableList' schema.
 */
export type SqlApiTableList = {
  /**
   * Total count when $count=true
   */
  count?: number | null;
  resources?: SqlApiTableDefinition[];
} & Record<string, any>;
