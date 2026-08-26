/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SqlApiAffectedObject } from './sql-api-affected-object.js';
/**
 * Representation of the 'SqlApiDdlResponse' schema.
 */
export type SqlApiDdlResponse = {
  status?: 'SUCCESS' | 'SKIPPED';
  affectedObject?: SqlApiAffectedObject;
  executedAt?: string;
} & Record<string, any>;
