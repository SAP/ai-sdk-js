/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'LLMModuleConfig' schema.
 */
export type LLMModuleConfig = {
  /**
   * Model name as in LLM Access configuration.
   * @example "gpt-4"
   */
  model_name: string;
  /**
   * Model parameters.
   */
  model_params: Record<string, any>;
  /**
   * Version of the model to use.
   * @example "2024-08-12T10:11:17.042Z"
   * Default: "latest".
   */
  model_version?: string;
} & Record<string, any>;
