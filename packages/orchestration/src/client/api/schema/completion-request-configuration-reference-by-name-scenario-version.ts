/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { CompletionRequestConfigurationReferenceByNameScenarioVersionConfigRef } from './completion-request-configuration-reference-by-name-scenario-version-config-ref.js';
import type { ChatMessages } from './chat-messages.js';
/**
 * Representation of the 'CompletionRequestConfigurationReferenceByNameScenarioVersion' schema.
 */
export type CompletionRequestConfigurationReferenceByNameScenarioVersion = {
  config_ref: CompletionRequestConfigurationReferenceByNameScenarioVersionConfigRef;
  /**
   * @example {
   *   "groundingInput": "What is SAP Joule?",
   *   "inputContext": "optimizing supply chain management"
   * }
   */
  placeholder_values?: Record<string, string>;
  /**
   * History of chat messages. Can be used to provide system and assistant messages to set the context of the conversation. Will be merged with the template message
   */
  messages_history?: ChatMessages;
};
