/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AgentControllerServicereturnAgentControllerServiceAgentsDeploy } from './schema/index.js';
/**
 * Representation of the 'DeployApi'.
 * This API is part of the 'pab' service.
 */
export const DeployApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/AgentControllerService.deploy' endpoint.
   * @param id - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdAgentControllerServiceDeploy: (id: string) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceAgentsDeploy>(
      'post',
      '/Agents({id})/AgentControllerService.deploy',
      {
        pathParameters: { id }
      },
      DeployApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/agent/AgentControllerService.deploy' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1AgentAgentControllerServiceDeploy: (
    id: string,
    id1: string
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceAgentsDeploy>(
      'post',
      '/Agents({id})/threads({id1})/agent/AgentControllerService.deploy',
      {
        pathParameters: { id, id1 }
      },
      DeployApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/toolkits({id1})/agent/AgentControllerService.deploy' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdToolkitsId1AgentAgentControllerServiceDeploy: (
    id: string,
    id1: string
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceAgentsDeploy>(
      'post',
      '/Agents({id})/toolkits({id1})/agent/AgentControllerService.deploy',
      {
        pathParameters: { id, id1 }
      },
      DeployApi._defaultBasePath
    )
};
