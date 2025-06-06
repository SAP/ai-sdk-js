/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Model version information including whether it is latest version, its deprecation status and optional retirement date
 */
export type AiModelVersion = {
  /**
   * Name of model version
   */
  name: string;
  /**
   * Displays whether it is the latest version offered for the model
   */
  isLatest: boolean;
  /**
   * Deprecation status of model
   */
  deprecated: boolean;
  /**
   * Retirement date of model in ISO 8601 timestamp
   */
  retirementDate?: string;
  /**
   * Context length of the model
   */
  contextLength?: number;
  /**
   * List of input types supported by the model
   */
  inputTypes?: string[];
  /**
   * List of capabilities supported by the model
   */
  capabilities?: string[];
  /**
   * List of metadata supported by the model
   */
  metadata?: Record<string, string>[];
  /**
   * List of costs associated with the model
   */
  cost?: Record<string, string>[];
  /**
   * List of suggested replacements for the model
   */
  suggestedReplacements?: string[];
  /**
   * Streaming support status of the model
   */
  streamingSupported?: boolean;
  /**
   * List of model capabilities supported by orchestration service
   */
  orchestrationCapabilities?: string[];
} & Record<string, any>;
