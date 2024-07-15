/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { GenericModuleResult } from './generic-module-result.js';
import type { ChatMessages } from './chat-messages.js';
import type { LLMModuleOutput } from './llm-module-output.js';
/**
 * Representation of the 'ModuleResultsItem' schema.
 */
export type ModuleResultsItem = {
  /**
   * Name of the module.
   */
  name: string;
  /**
   * Whether the module was configured. If false, the module was not executed.
   */
  was_configured: boolean;
  output: GenericModuleResult | ChatMessages | LLMModuleOutput;
} & Record<string, any>;
