/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AgentControllerServicereturnAgentControllerServiceDeployContent } from './schema/index.js';
/**
 * Representation of the 'DeployContentApi'.
 * This API is part of the 'pab' service.
 */
export const DeployContentApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the '/deployContent' endpoint.
   * @param body - Action parameters
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createDeployContent: (
    body:
      | ({
          /**
           * @example "{ \"name\": \"Report Expert Agent v1\", \"expertIn\": \"Business report writing\", \"task\": \"Do task x\", \"additionalContext\": \"When you see the value baf it stand for business-agent-foundation\", \"toolkits\": [{\"name\": \"Calculator\", \"type\": \"calculator\"}], \"iterations\": 20, \"orchestrationConfig\": \"{\\\"filtering_module_config\\\": { ... }}\", \"baseModel\": \"OpenAiGpt4oMini\", \"backupBaseModel\": \"OpenAiGpt4oMini\", \"advancedModel\": \"OpenAiGpt4o\", \"backupAdvancedModel\": \"OpenAiGpt4o\", \"preprocessingEnabled\": true, \"postprocessingEnabled\": true, \"defaultOutputFormat\": \"Markdown\", \"defaultOutputFormatOptions\": \"{\\\"schema\\\": \\\"https://json-schema.org/draft/2020-12/schema\\\"}\", \"callbackDestination\": \"MY_CALLBACK\"}"
           */
          config?: string;
        } & Record<string, any>)
      | undefined
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceDeployContent>(
      'post',
      '/deployContent',
      {
        body
      },
      DeployContentApi._defaultBasePath
    )
};
