/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { OrchestrationConfig } from './orchestration-config.js';
import type { ChatMessages } from './chat-messages.js';
/**
 * Representation of the 'CompletionPostRequest' schema.
 */
export type CompletionPostRequest = {
  orchestration_config: OrchestrationConfig;
  /**
   * @example {
   *   "groundingInput": "What is SAP Joule?",
   *   "inputContext": "optimizing supply chain management"
   * }
   */
  input_params?: Record<string, string>;
  /**
   * History of chat messages. Can be used to provide system and assistant messages to set the context of the conversation. Will be merged with the template message
   */
  messages_history?: ChatMessages;
};
