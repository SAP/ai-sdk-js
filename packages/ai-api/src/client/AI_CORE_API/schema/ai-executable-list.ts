/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiExecutable } from './ai-executable.js';
/**
 * Representation of the 'AiExecutableList' schema.
 */
export type AiExecutableList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiExecutable[];
} & Record<string, any>;
