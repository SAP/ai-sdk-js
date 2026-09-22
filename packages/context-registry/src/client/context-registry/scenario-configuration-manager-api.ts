/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type {
  GetScenarioConfigurations,
  SearchScenarioConfiguration,
  ScenarioConfigurationObject,
  CreateScenarioConfiguration,
  ScenarioConfigurationNameObject,
  PatchScenarioConfiguration
} from './schema/index.js';
/**
 * Representation of the 'ScenarioConfigurationManagerApi'.
 * This API is part of the 'context-registry' service.
 */
export const ScenarioConfigurationManagerApi = {
  _defaultBasePath: '/tcr',
  /**
   * Get all scenario configurations in the tenant (resource group)
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAllScenarioConfigurations: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetScenarioConfigurations>(
      'get',
      '/scenarioConfigurations',
      {
        headerParameters,
        queryParameters
      },
      ScenarioConfigurationManagerApi._defaultBasePath
    ),
  /**
   * Search for scenario configurations that match ALL specified labels (AND logic)
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  searchScenarioConfigurationsByLabel: (
    body: SearchScenarioConfiguration,
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetScenarioConfigurations>(
      'post',
      '/scenarioConfigurations/search',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        },
        queryParameters
      },
      ScenarioConfigurationManagerApi._defaultBasePath
    ),
  /**
   * Get a scenario configuration by its name
   * @param scenarioConfigurationName - The name of the scenario configuration to retrieve
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getScenarioConfigurationByName: (
    scenarioConfigurationName: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<ScenarioConfigurationObject>(
      'get',
      '/scenarioConfigurations/{scenarioConfigurationName}',
      {
        pathParameters: { scenarioConfigurationName },
        headerParameters
      },
      ScenarioConfigurationManagerApi._defaultBasePath
    ),
  /**
   * Create a scenario configuration asynchronously. Schema validation happens synchronously; background processing runs asynchronously. Poll GET /scenarioConfigurations/{name} to track progress via status and errorMessage. Returns 202 (not exists or ERROR retry), 409 (ACTIVE or DELETING), 422 (retry exhausted).
   *
   * @param scenarioConfigurationName - Name of the scenario configuration
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createScenarioConfiguration: (
    scenarioConfigurationName: string,
    body: CreateScenarioConfiguration,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<ScenarioConfigurationNameObject>(
      'put',
      '/scenarioConfigurations/{scenarioConfigurationName}',
      {
        pathParameters: { scenarioConfigurationName },
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      ScenarioConfigurationManagerApi._defaultBasePath
    ),
  /**
   * Update a scenario configuration (excluding name)
   * @param scenarioConfigurationName - The name of the scenario configuration to update
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  patchScenarioConfigurationByName: (
    scenarioConfigurationName: string,
    body: PatchScenarioConfiguration,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/scenarioConfigurations/{scenarioConfigurationName}',
      {
        pathParameters: { scenarioConfigurationName },
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      ScenarioConfigurationManagerApi._defaultBasePath
    ),
  /**
   * Delete a scenario configuration by name
   * @param scenarioConfigurationName - The name of the scenario configuration to delete
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteScenarioConfigurationByName: (
    scenarioConfigurationName: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/scenarioConfigurations/{scenarioConfigurationName}',
      {
        pathParameters: { scenarioConfigurationName },
        headerParameters
      },
      ScenarioConfigurationManagerApi._defaultBasePath
    )
};
