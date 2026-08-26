/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SqlApiTableDefinition' schema.
 */
export type SqlApiTableDefinition = {
  tableName?: string;
  schemaName?: string;
  managed?: boolean;
  status?: 'ACTIVE' | 'DROPPED';
  dmlGranted?: boolean;
  selectGranted?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
} & Record<string, any>;
