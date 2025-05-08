/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AgentControllerServicereturnAgentControllerServiceAgentsArchive } from './schema/index.js';
/**
 * Representation of the 'ArchiveApi'.
 * This API is part of the 'pab' service.
 */
export const ArchiveApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/AgentControllerService.archive' endpoint.
   * @param id - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdAgentControllerServiceArchive: (id: string) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceAgentsArchive>(
      'post',
      '/Agents({id})/AgentControllerService.archive',
      {
        pathParameters: { id }
      },
      ArchiveApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/agent/AgentControllerService.archive' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1AgentAgentControllerServiceArchive: (
    id: string,
    id1: string
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceAgentsArchive>(
      'post',
      '/Agents({id})/threads({id1})/agent/AgentControllerService.archive',
      {
        pathParameters: { id, id1 }
      },
      ArchiveApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/toolkits({id1})/agent/AgentControllerService.archive' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdToolkitsId1AgentAgentControllerServiceArchive: (
    id: string,
    id1: string
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceAgentsArchive>(
      'post',
      '/Agents({id})/toolkits({id1})/agent/AgentControllerService.archive',
      {
        pathParameters: { id, id1 }
      },
      ArchiveApi._defaultBasePath
    )
};
