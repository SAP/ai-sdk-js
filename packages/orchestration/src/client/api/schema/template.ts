/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TemplatingChatMessage } from './templating-chat-message.js';
/**
 * Representation of the 'Template' schema.
 * @example {
 *   "template": [
 *     {
 *       "role": "user",
 *       "content": "How can the features of AI in SAP BTP specifically {{?groundingOutput}}, be applied to {{?inputContext}}"
 *     }
 *   ],
 *   "defaults": {
 *     "inputContext": "The default text that will be used in the template if inputContext is not set"
 *   }
 * }
 */
export type Template = {
  /**
   * A chat message array to be formatted with values from input_params. Both role and content can be templated. If messages_history is provided, the templated messages will be appended.
   */
  template: TemplatingChatMessage;
  /**
   * Optional default values for the template. If a parameter has no default it is required.
   */
  defaults?: Record<string, any>;
};
