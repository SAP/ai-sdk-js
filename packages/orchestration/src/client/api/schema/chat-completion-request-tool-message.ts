/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TextContent } from './text-content.js';
/**
 * Representation of the 'ChatCompletionRequestToolMessage' schema.
 */
export type ChatCompletionRequestToolMessage = {
  /**
   * @example "tool"
   */
  role: 'tool';
  tool_call_id: string;
  content: string | TextContent[];
};
