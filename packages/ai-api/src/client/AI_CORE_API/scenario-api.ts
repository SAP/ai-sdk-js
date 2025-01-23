/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  AiScenarioList,
  AiScenario,
  AiVersionList,
  AiModelList
} from './schema/index.js';
/**
 * Representation of the 'ScenarioApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ScenarioApi = {
  _defaultBasePath: undefined,
  /**
   * Retrieve a list of all available scenarios.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  scenarioQuery: (headerParameters: { 'AI-Resource-Group': string }) =>
    new OpenApiRequestBuilder<AiScenarioList>(
      'get',
      '/lm/scenarios',
      {
        headerParameters
      },
      ScenarioApi._defaultBasePath
    ),
  /**
   * Retrieve details for a scenario specified by scenarioId.
   * @param scenarioId - Scenario identifier
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  scenarioGet: (
    scenarioId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiScenario>(
      'get',
      '/lm/scenarios/{scenarioId}',
      {
        pathParameters: { scenarioId },
        headerParameters
      },
      ScenarioApi._defaultBasePath
    ),
  /**
   * Retrieve a list of scenario versions based on the versions of executables
   * available within that scenario.
   *
   * @param scenarioId - Scenario identifier
   * @param queryParameters - Object containing the following keys: labelSelector.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  scenarioQueryVersions: (
    scenarioId: string,
    queryParameters: { labelSelector?: string[] },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiVersionList>(
      'get',
      '/lm/scenarios/{scenarioId}/versions',
      {
        pathParameters: { scenarioId },
        queryParameters,
        headerParameters
      },
      ScenarioApi._defaultBasePath
    ),
  /**
   * Retrieve information about all models available in LLM global scenario
   * @param scenarioId - Scenario identifier
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  modelsGet: (
    scenarioId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiModelList>(
      'get',
      '/lm/scenarios/{scenarioId}/models',
      {
        pathParameters: { scenarioId },
        headerParameters
      },
      ScenarioApi._defaultBasePath
    )
};
