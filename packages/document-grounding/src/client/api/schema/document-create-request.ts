/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BaseDocument } from './base-document.js';
/**
 * A create request containing one or more new documents to create and store in a collection.
 */
export type DocumentCreateRequest = {
  documents: BaseDocument[];
} & Record<string, any>;
