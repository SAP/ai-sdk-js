/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ErrorStreamingList } from './error-streaming-list.js';
import type { ErrorStreaming } from './error-streaming.js';
/**
 * Representation of the 'ErrorResponseStreaming' schema.
 */
export type ErrorResponseStreaming = {
  error: ErrorStreaming | ErrorStreamingList;
} & Record<string, any>;
