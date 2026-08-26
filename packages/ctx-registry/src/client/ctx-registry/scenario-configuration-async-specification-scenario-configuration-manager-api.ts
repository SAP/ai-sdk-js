/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  ScenarioConfigurationAsyncGetScenarioConfigurations,
  ScenarioConfigurationCommonSearchScenarioConfiguration,
  ScenarioConfigurationAsyncScenarioConfigurationObject,
  ScenarioConfigurationAsyncCreateScenarioConfiguration,
  ScenarioConfigurationCommonScenarioConfigurationNameObject,
  ScenarioConfigurationAsyncPatchScenarioConfiguration
} from './schema/index.js';
/**
 * Representation of the 'ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi'.
 * This API is part of the 'ctx-registry' service.
 */
export const ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi =
  {
    _defaultBasePath: '/v2/admin/tcr',
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
      new OpenApiRequestBuilder<ScenarioConfigurationAsyncGetScenarioConfigurations>(
        'get',
        '/scenarioConfigurations',
        {
          headerParameters,
          queryParameters
        },
        ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi._defaultBasePath
      ),
    /**
     * Search for scenario configurations that match ALL specified labels (AND logic)
     * @param body - Request body.
     * @param queryParameters - Object containing the following keys: $top, $skip, $count.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    searchScenarioConfigurationsByLabel: (
      body: ScenarioConfigurationCommonSearchScenarioConfiguration,
      queryParameters: { $top?: number; $skip?: number; $count?: boolean },
      headerParameters: { 'AI-Resource-Group': string }
    ) =>
      new OpenApiRequestBuilder<ScenarioConfigurationAsyncGetScenarioConfigurations>(
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
        ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi._defaultBasePath
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
      new OpenApiRequestBuilder<ScenarioConfigurationAsyncScenarioConfigurationObject>(
        'get',
        '/scenarioConfigurations/{scenarioConfigurationName}',
        {
          pathParameters: { scenarioConfigurationName },
          headerParameters
        },
        ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi._defaultBasePath
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
      body: ScenarioConfigurationAsyncCreateScenarioConfiguration,
      headerParameters: { 'AI-Resource-Group': string }
    ) =>
      new OpenApiRequestBuilder<ScenarioConfigurationCommonScenarioConfigurationNameObject>(
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
        ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi._defaultBasePath
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
      body: ScenarioConfigurationAsyncPatchScenarioConfiguration,
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
        ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi._defaultBasePath
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
        ScenarioConfigurationAsyncSpecificationScenarioConfigurationManagerApi._defaultBasePath
      )
  };
