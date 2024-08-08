/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type { AiModelList } from './schema/index.js';
/**
 * Representation of the 'ModelApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ModelApi = {
  /**
   * Retrieve information about all models available in LLM global scenario
   * @param scenarioId - Scenario identifier
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  modelsGet: (scenarioId: string) =>
    new OpenApiRequestBuilder<AiModelList>(
      'get',
      '/lm/scenarios/{scenarioId}/models',
      {
        pathParameters: { scenarioId }
      }
    )
};
