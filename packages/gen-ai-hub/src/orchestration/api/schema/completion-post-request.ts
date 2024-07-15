/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { OrchestrationConfig } from './orchestration-config.js';
import type { InputParamsEntry } from './input-params-entry.js';
import type { ChatMessages } from './chat-messages.js';
/**
 * Representation of the 'CompletionPostRequest' schema.
 */
export type CompletionPostRequest = {
  orchestration_config: OrchestrationConfig;
  input_params: Record<string, InputParamsEntry>;
  messages_history?: ChatMessages;
  /**
   * Whether to return module results, which returns detailed information about each module execution. Be careful with the content of the individual module results as they may contain unchecked user or model content.
   */
  return_module_results?: boolean;
} & Record<string, any>;
