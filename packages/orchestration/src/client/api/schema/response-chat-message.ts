/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MessageToolCalls } from './message-tool-calls.js';
/**
 * Representation of the 'ResponseChatMessage' schema.
 */
export type ResponseChatMessage = {
  role: 'assistant';
  content: string;
  refusal?: string;
  tool_calls?: MessageToolCalls;
};
