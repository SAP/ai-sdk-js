/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AgentControllerServicereturnAgentControllerServiceThreadsCancel } from './schema/index.js';
/**
 * Representation of the 'CancelApi'.
 * This API is part of the 'pab' service.
 */
export const CancelApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/AgentControllerService.cancel' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1AgentControllerServiceCancel: (
    id: string,
    id1: string
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceThreadsCancel>(
      'post',
      '/Agents({id})/threads({id1})/AgentControllerService.cancel',
      {
        pathParameters: { id, id1 }
      },
      CancelApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/messages({id2})/thread/AgentControllerService.cancel' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1MessagesId2ThreadAgentControllerServiceCancel: (
    id: string,
    id1: string,
    id2: string
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceThreadsCancel>(
      'post',
      '/Agents({id})/threads({id1})/messages({id2})/thread/AgentControllerService.cancel',
      {
        pathParameters: { id, id1, id2 }
      },
      CancelApi._defaultBasePath
    )
};
