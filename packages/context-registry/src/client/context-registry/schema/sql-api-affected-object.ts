/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SqlApiAffectedObject' schema.
 */
export type SqlApiAffectedObject = {
  type?: 'TABLE' | 'INDEX' | 'VIEW' | 'SEQUENCE' | 'OTHER';
  schemaName?: string | null;
  objectName?: string | null;
} & Record<string, any>;
