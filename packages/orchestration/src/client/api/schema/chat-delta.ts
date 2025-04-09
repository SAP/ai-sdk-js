/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ToolCallChunk } from './tool-call-chunk.js';
/**
 * Representation of the 'ChatDelta' schema.
 */
export type ChatDelta = {
  role?: 'assistant';
  content?: string;
  /**
   * The refusal message generated by the model.
   */
  refusal?: string;
  tool_calls?: ToolCallChunk[];
} & Record<string, any>;
