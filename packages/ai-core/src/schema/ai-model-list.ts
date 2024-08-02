/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiModelBaseData } from './ai-model-base-data';
/**
 * Representation of the 'AiModelList' schema.
 */
export type AiModelList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiModelBaseData[];
} & Record<string, any>;
