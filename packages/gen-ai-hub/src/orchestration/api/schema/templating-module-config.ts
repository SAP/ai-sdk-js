/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { ChatMessages } from './chat-messages.js';

/**
 * Representation of the 'TemplatingModuleConfig' schema.
 */
export type TemplatingModuleConfig = {
  /**
   * A chat message array to be formatted with values from input_params. Both role and content can be templated. If messages_history is provided, the templated messages will be appended.
   * @example {\n "role": "user",\n "content": "input text: {{ ?inputExample }}"\n }
   */
  template: ChatMessages;

  /**
   * Optional default values for the template. If a parameter has no default it is required.
   * @example "{\"context\": \"I am a default context\"}"
   */
  defaults?: Record<string, any>;
} & Record<string, any>;
