/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiExecutableId } from './ai-executable-id.js';
import type { AiModelVersionList } from './ai-model-version-list.js';
import type { AiScenarioId } from './ai-scenario-id.js';
/**
 * Representation of the 'AiModelBaseData' schema.
 */
export type AiModelBaseData = {
  /**
   * Name of the model
   */
  model: string;
  executableId: AiExecutableId;
  /**
   * Description of the model and its capabilities
   */
  description: string;
  versions: AiModelVersionList;
  /**
   * Display name of the model
   */
  displayName?: string;
  /**
   * Access type of the model
   */
  accessType?: string;
  /**
   * Provider of the model
   */
  provider?: string;
  /**
   * List of scenarioId:executableId pair where the model supported
   */
  allowedScenarios?: ({
    scenarioId: AiScenarioId;
    executableId: AiExecutableId;
  } & Record<string, any>)[];
} & Record<string, any>;
