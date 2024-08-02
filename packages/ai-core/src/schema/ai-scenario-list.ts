/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiScenario } from './ai-scenario';
/**
 * Representation of the 'AiScenarioList' schema.
 */
export type AiScenarioList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiScenario[];
} & Record<string, any>;
