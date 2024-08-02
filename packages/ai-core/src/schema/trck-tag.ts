/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TrckGenericName } from './trck-generic-name';
/**
 * A dictionary of name-value pairs to support segregation at execution level.
 * @example {
 *   "name": "Artifact Group",
 *   "value": "RFC-1"
 * }
 */
export type TrckTag = {
  name: TrckGenericName;
  /**
   * tag value
   * @example "RFC-1"
   * Max Length: 256.
   * Min Length: 1.
   */
  value: string;
} & Record<string, any>;
