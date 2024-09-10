/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ChatMessage' schema.
 */
export type ChatMessage = {
  /**
   * @example "user"
   */
  role: string;
  /**
   * @example "What is SAP S/4HANA?"
   */
  content: string;
} & Record<string, any>;