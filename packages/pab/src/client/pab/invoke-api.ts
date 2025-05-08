/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AgentControllerServicereturnAgentControllerServiceThreadsInvoke } from './schema/index.js';
/**
 * Representation of the 'InvokeApi'.
 * This API is part of the 'pab' service.
 */
export const InvokeApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/AgentControllerService.invoke' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param body - Action parameters
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1AgentControllerServiceInvoke: (
    id: string,
    id1: string,
    body:
      | ({
          message?: string;
          returnTrace?: boolean | null;
          outputFormat?: 'JSON' | 'Markdown' | 'Text' | null;
          outputFormatOptions?: string | null;
        } & Record<string, any>)
      | undefined
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceThreadsInvoke>(
      'post',
      '/Agents({id})/threads({id1})/AgentControllerService.invoke',
      {
        pathParameters: { id, id1 },
        body
      },
      InvokeApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/messages({id2})/thread/AgentControllerService.invoke' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param body - Action parameters
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1MessagesId2ThreadAgentControllerServiceInvoke: (
    id: string,
    id1: string,
    id2: string,
    body:
      | ({
          message?: string;
          returnTrace?: boolean | null;
          outputFormat?: 'JSON' | 'Markdown' | 'Text' | null;
          outputFormatOptions?: string | null;
        } & Record<string, any>)
      | undefined
  ) =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceThreadsInvoke>(
      'post',
      '/Agents({id})/threads({id1})/messages({id2})/thread/AgentControllerService.invoke',
      {
        pathParameters: { id, id1, id2 },
        body
      },
      InvokeApi._defaultBasePath
    )
};
