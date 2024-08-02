/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiVersionDescription } from './ai-version-description';
import type { AiVersionId } from './ai-version-id';
import type { AiScenarioId } from './ai-scenario-id';
/**
 * Representation of the 'AiVersion' schema.
 */
export type AiVersion = {
  description?: AiVersionDescription;
  id: AiVersionId;
  scenarioId?: AiScenarioId;
  /**
   * Timestamp of resource creation
   * Format: "date-time".
   */
  createdAt: string;
  /**
   * Timestamp of latest resource modification
   * Format: "date-time".
   */
  modifiedAt: string;
} & Record<string, any>;
