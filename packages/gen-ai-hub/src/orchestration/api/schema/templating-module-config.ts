/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'TemplatingModuleConfig' schema.
 */
export type TemplatingModuleConfig = {
  /**
   * A string to be formatted with values from input_params. The role `user` will be assigned to the message. If messages_history is provided, the templated message will be appended.
   * @example "{{ ?user_message }}\n{{ ?context }}"
   * Max Length: 130000.
   */
  template: string;
  /**
   * Optional default values for the template. If a parameter has no default it is required.
   * @example "{\"context\": \"I am a default context\"}"
   */
  defaults?: Record<string, any>;
} & Record<string, any>;
