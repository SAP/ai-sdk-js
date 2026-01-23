/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ScopedKeyValueListPair } from './scoped-key-value-list-pair.js';
/**
 * Representation of the 'BinaryBooleanFilter' schema.
 */
export type BinaryBooleanFilter = {
  /**
   * Boolean operator for combining filter conditions
   */
  operator: 'and' | 'or';
  /**
   * Left operand of the boolean expression
   */
  left: BinaryBooleanFilter | ScopedKeyValueListPair;
  /**
   * Right operand of the boolean expression
   */
  right: BinaryBooleanFilter | ScopedKeyValueListPair;
} & Record<string, any>;
