/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiId } from './ai-id.js';
import type { AiApiError } from './ai-api-error.js';
/**
 * Representation of the 'AiApiErrorWithId' schema.
 */
export type AiApiErrorWithId = {
  id: AiId;
  error: AiApiError;
} & Record<string, any>;
