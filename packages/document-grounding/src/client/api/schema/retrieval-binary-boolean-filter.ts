/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalScopedKeyValueListPair } from './retrieval-scoped-key-value-list-pair.js';
/**
 * Representation of the 'RetrievalBinaryBooleanFilter' schema.
 */
export type RetrievalBinaryBooleanFilter = {
  operator: 'and' | 'or';
  left: RetrievalBinaryBooleanFilter | RetrievalScopedKeyValueListPair;
  right: RetrievalBinaryBooleanFilter | RetrievalScopedKeyValueListPair;
} & Record<string, any>;
