/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentWithoutChunks } from './document-without-chunks.js';
/**
 * A response containing documents retrieved from the server.
 */
export type Documents = {
  resources: DocumentWithoutChunks[];
  count?: number;
} & Record<string, any>;
