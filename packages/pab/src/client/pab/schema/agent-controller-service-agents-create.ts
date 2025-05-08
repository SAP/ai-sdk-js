/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AgentControllerServiceThreadsCreate } from './agent-controller-service-threads-create.js';
import type { AgentControllerServiceToolkitsCreate } from './agent-controller-service-toolkits-create.js';
import type { AgentControllerServicecdsMapCreate } from './agent-controller-servicecds-map-create.js';
/**
 * Representation of the 'AgentControllerServiceAgentsCreate' schema.
 */
export type AgentControllerServiceAgentsCreate = {
  /**
   * @example "01234567-89ab-cdef-0123-456789abcdef"
   * Format: "uuid".
   */
  ID: string;
  /**
   * @example "Report Expert Agent v1"
   */
  name?: string;
  /**
   * @example "Business report writing"
   */
  expertIn?: string | null;
  /**
   * @example "Do task x"
   */
  task?: string | null;
  /**
   * @example "When you see the value baf it stand for business-agent-foundation"
   */
  additionalContext?: string | null;
  threads?: AgentControllerServiceThreadsCreate[];
  toolkits?: AgentControllerServiceToolkitsCreate[];
  /**
   * @example "20"
   * Format: "int32".
   * Default: 20.
   */
  iterations?: number | null;
  /**
   * @example "{ \"filtering_module_config\": { ... } }"
   */
  orchestrationConfig?: AgentControllerServicecdsMapCreate | null;
  /**
   * @example "OpenAiGpt4oMini"
   * Default: "OpenAiGpt4oMini".
   */
  baseModel?: string;
  /**
   * @example "OpenAiGpt4oMini"
   */
  backupBaseModel?: string | null;
  /**
   * @example "OpenAiGpt4o"
   * Default: "OpenAiGpt4o".
   */
  advancedModel?: string;
  /**
   * @example "OpenAiGpt4o"
   */
  backupAdvancedModel?: string | null;
  /**
   * @example "true"
   * Default: true.
   */
  preprocessingEnabled?: boolean;
  /**
   * @example "true"
   * Default: true.
   */
  postprocessingEnabled?: boolean;
  /**
   * @example "Markdown"
   * Default: "Markdown".
   */
  defaultOutputFormat?: string | null;
  /**
   * @example "{\"schema\": \"https://json-schema.org/draft/2020-12/schema\"}"
   */
  defaultOutputFormatOptions?: string | null;
  /**
   * @example "MY_CALLBACK"
   */
  callbackDestination?: string | null;
} & Record<string, any>;
