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
export type CompletionPostRequest =
  | {
      config: OrchestrationConfig;
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
    }
  | {
      config_ref: {
        /**
         * @example "f47ac10b-58cc-4372-a567-0e02b2c3d479"
         */
        id: string;
      };
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
    }
  | {
      config_ref: {
        scenario: string;
        name: string;
        version: string;
        model_name: string;
      };
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
