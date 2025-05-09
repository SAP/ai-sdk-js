/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  Count,
  AgentControllerServiceAgents,
  AgentControllerServiceAgentsCreate,
  AgentControllerServiceAgentsUpdate,
  AgentControllerServiceThreads,
  AgentControllerServiceThreadsCreate,
  AgentControllerServiceThreadsUpdate,
  AgentControllerServiceMessages,
  AgentControllerServiceMessagesCreate,
  AgentControllerServiceMessagesUpdate,
  AgentControllerServiceInputs,
  AgentControllerServiceInputsCreate,
  AgentControllerServiceInputsUpdate,
  AgentControllerServiceTokens,
  AgentControllerServiceTokensCreate,
  AgentControllerServiceTokensUpdate,
  AgentControllerServiceTraces,
  AgentControllerServiceTracesCreate,
  AgentControllerServiceTracesUpdate,
  AgentControllerServiceToolkits,
  AgentControllerServiceToolkitsCreate,
  AgentControllerServiceToolkitsUpdate
} from './schema/index.js';
/**
 * Representation of the 'AgentsApi'.
 * This API is part of the 'pab' service.
 */
export const AgentsApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of get requests to the '/Agents' endpoint.
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgents: (queryParameters?: {
    $top?: number;
    $skip?: number;
    $search?: string;
    $filter?: string;
    $count?: boolean;
    $orderby?: Set<
      | 'ID'
      | 'ID desc'
      | 'createdAt'
      | 'createdAt desc'
      | 'modifiedAt'
      | 'modifiedAt desc'
      | 'name'
      | 'name desc'
      | 'version'
      | 'version desc'
      | 'deploymentStatus'
      | 'deploymentStatus desc'
      | 'expertIn'
      | 'expertIn desc'
      | 'task'
      | 'task desc'
      | 'additionalContext'
      | 'additionalContext desc'
      | 'iterations'
      | 'iterations desc'
      | 'baseModel'
      | 'baseModel desc'
      | 'backupBaseModel'
      | 'backupBaseModel desc'
      | 'advancedModel'
      | 'advancedModel desc'
      | 'backupAdvancedModel'
      | 'backupAdvancedModel desc'
      | 'preprocessingEnabled'
      | 'preprocessingEnabled desc'
      | 'postprocessingEnabled'
      | 'postprocessingEnabled desc'
      | 'defaultOutputFormat'
      | 'defaultOutputFormat desc'
      | 'defaultOutputFormatOptions'
      | 'defaultOutputFormatOptions desc'
      | 'callbackDestination'
      | 'callbackDestination desc'
    >;
    $select?: Set<
      | 'ID'
      | 'createdAt'
      | 'modifiedAt'
      | 'name'
      | 'version'
      | 'deploymentStatus'
      | 'expertIn'
      | 'task'
      | 'additionalContext'
      | 'iterations'
      | 'orchestrationConfig'
      | 'baseModel'
      | 'backupBaseModel'
      | 'advancedModel'
      | 'backupAdvancedModel'
      | 'preprocessingEnabled'
      | 'postprocessingEnabled'
      | 'defaultOutputFormat'
      | 'defaultOutputFormatOptions'
      | 'callbackDestination'
    >;
    $expand?: Set<'*' | 'threads' | 'toolkits'>;
  }) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceAgents[];
      } & Record<string, any>
    >(
      'get',
      '/Agents',
      {
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents' endpoint.
   * @param body - List of Agents
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgents: (body: AgentControllerServiceAgentsCreate) =>
    new OpenApiRequestBuilder<AgentControllerServiceAgents>(
      'post',
      '/Agents',
      {
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})' endpoint.
   * @param id - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsId: (
    id: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'name'
        | 'version'
        | 'deploymentStatus'
        | 'expertIn'
        | 'task'
        | 'additionalContext'
        | 'iterations'
        | 'orchestrationConfig'
        | 'baseModel'
        | 'backupBaseModel'
        | 'advancedModel'
        | 'backupAdvancedModel'
        | 'preprocessingEnabled'
        | 'postprocessingEnabled'
        | 'defaultOutputFormat'
        | 'defaultOutputFormatOptions'
        | 'callbackDestination'
      >;
      $expand?: Set<'*' | 'threads' | 'toolkits'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceAgents>(
      'get',
      '/Agents({id})',
      {
        pathParameters: { id },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/Agents({id})' endpoint.
   * @param id - key: ID
   * @param body - List of Agents
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateAgentsId: (id: string, body: AgentControllerServiceAgentsUpdate) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/Agents({id})',
      {
        pathParameters: { id },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/Agents({id})' endpoint.
   * @param id - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteAgentsId: (id: string) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/Agents({id})',
      {
        pathParameters: { id }
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads' endpoint.
   * @param id - key: ID
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreads: (
    id: string,
    queryParameters?: {
      $top?: number;
      $skip?: number;
      $search?: string;
      $filter?: string;
      $count?: boolean;
      $orderby?: Set<
        | 'ID'
        | 'ID desc'
        | 'createdAt'
        | 'createdAt desc'
        | 'modifiedAt'
        | 'modifiedAt desc'
        | 'name'
        | 'name desc'
        | 'state'
        | 'state desc'
      >;
      $select?: Set<'ID' | 'createdAt' | 'modifiedAt' | 'name' | 'state'>;
      $expand?: Set<'*' | 'messages' | 'agent'>;
    }
  ) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceThreads[];
      } & Record<string, any>
    >(
      'get',
      '/Agents({id})/threads',
      {
        pathParameters: { id },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads' endpoint.
   * @param id - key: ID
   * @param body - List of Threads
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreads: (
    id: string,
    body: AgentControllerServiceThreadsCreate
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceThreads>(
      'post',
      '/Agents({id})/threads',
      {
        pathParameters: { id },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1: (
    id: string,
    id1: string,
    queryParameters?: {
      $select?: Set<'ID' | 'createdAt' | 'modifiedAt' | 'name' | 'state'>;
      $expand?: Set<'*' | 'messages' | 'agent'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceThreads>(
      'get',
      '/Agents({id})/threads({id1})',
      {
        pathParameters: { id, id1 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/Agents({id})/threads({id1})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param body - List of Threads
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateAgentsIdThreadsId1: (
    id: string,
    id1: string,
    body: AgentControllerServiceThreadsUpdate
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/Agents({id})/threads({id1})',
      {
        pathParameters: { id, id1 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/Agents({id})/threads({id1})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteAgentsIdThreadsId1: (id: string, id1: string) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/Agents({id})/threads({id1})',
      {
        pathParameters: { id, id1 }
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/agent' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1Agent: (
    id: string,
    id1: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'name'
        | 'version'
        | 'deploymentStatus'
        | 'expertIn'
        | 'task'
        | 'additionalContext'
        | 'iterations'
        | 'orchestrationConfig'
        | 'baseModel'
        | 'backupBaseModel'
        | 'advancedModel'
        | 'backupAdvancedModel'
        | 'preprocessingEnabled'
        | 'postprocessingEnabled'
        | 'defaultOutputFormat'
        | 'defaultOutputFormatOptions'
        | 'callbackDestination'
      >;
      $expand?: Set<'*' | 'threads' | 'toolkits'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceAgents>(
      'get',
      '/Agents({id})/threads({id1})/agent',
      {
        pathParameters: { id, id1 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1Messages: (
    id: string,
    id1: string,
    queryParameters?: {
      $top?: number;
      $skip?: number;
      $search?: string;
      $filter?: string;
      $count?: boolean;
      $orderby?: Set<
        | 'ID'
        | 'ID desc'
        | 'createdAt'
        | 'createdAt desc'
        | 'modifiedAt'
        | 'modifiedAt desc'
        | 'previous_ID'
        | 'previous_ID desc'
        | 'type'
        | 'type desc'
        | 'canceled'
        | 'canceled desc'
        | 'sender'
        | 'sender desc'
        | 'content'
        | 'content desc'
        | 'outputFormat'
        | 'outputFormat desc'
        | 'outputFormatOptions'
        | 'outputFormatOptions desc'
        | 'scratchpad'
        | 'scratchpad desc'
        | 'group_ID'
        | 'group_ID desc'
        | 'guardrailed'
        | 'guardrailed desc'
      >;
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'previous_ID'
        | 'type'
        | 'canceled'
        | 'sender'
        | 'content'
        | 'outputFormat'
        | 'outputFormatOptions'
        | 'scratchpad'
        | 'group_ID'
        | 'guardrailed'
      >;
      $expand?: Set<
        '*' | 'thread' | 'traces' | 'tokens' | 'previous' | 'inputs' | 'group'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceMessages[];
      } & Record<string, any>
    >(
      'get',
      '/Agents({id})/threads({id1})/messages',
      {
        pathParameters: { id, id1 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/messages' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param body - New message
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1Messages: (
    id: string,
    id1: string,
    body: AgentControllerServiceMessagesCreate
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceMessages>(
      'post',
      '/Agents({id})/threads({id1})/messages',
      {
        pathParameters: { id, id1 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2: (
    id: string,
    id1: string,
    id2: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'previous_ID'
        | 'type'
        | 'canceled'
        | 'sender'
        | 'content'
        | 'outputFormat'
        | 'outputFormatOptions'
        | 'scratchpad'
        | 'group_ID'
        | 'guardrailed'
      >;
      $expand?: Set<
        '*' | 'thread' | 'traces' | 'tokens' | 'previous' | 'inputs' | 'group'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceMessages>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})',
      {
        pathParameters: { id, id1, id2 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/Agents({id})/threads({id1})/messages({id2})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param body - New property values
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateAgentsIdThreadsId1MessagesId2: (
    id: string,
    id1: string,
    id2: string,
    body: AgentControllerServiceMessagesUpdate
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/Agents({id})/threads({id1})/messages({id2})',
      {
        pathParameters: { id, id1, id2 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/Agents({id})/threads({id1})/messages({id2})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteAgentsIdThreadsId1MessagesId2: (id: string, id1: string, id2: string) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/Agents({id})/threads({id1})/messages({id2})',
      {
        pathParameters: { id, id1, id2 }
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/group' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2Group: (
    id: string,
    id1: string,
    id2: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'previous_ID'
        | 'type'
        | 'canceled'
        | 'sender'
        | 'content'
        | 'outputFormat'
        | 'outputFormatOptions'
        | 'scratchpad'
        | 'group_ID'
        | 'guardrailed'
      >;
      $expand?: Set<
        '*' | 'thread' | 'traces' | 'tokens' | 'previous' | 'inputs' | 'group'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceMessages>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/group',
      {
        pathParameters: { id, id1, id2 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/inputs' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2Inputs: (
    id: string,
    id1: string,
    id2: string,
    queryParameters?: {
      $top?: number;
      $skip?: number;
      $search?: string;
      $filter?: string;
      $count?: boolean;
      $orderby?: Set<
        | 'ID'
        | 'ID desc'
        | 'createdAt'
        | 'createdAt desc'
        | 'modifiedAt'
        | 'modifiedAt desc'
        | 'name'
        | 'name desc'
        | 'description'
        | 'description desc'
        | 'type'
        | 'type desc'
        | 'possibleValues'
        | 'possibleValues desc'
        | 'suggestions'
        | 'suggestions desc'
      >;
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'name'
        | 'description'
        | 'type'
        | 'possibleValues'
        | 'suggestions'
      >;
      $expand?: Set<'*' | 'message'>;
    }
  ) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceInputs[];
      } & Record<string, any>
    >(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/inputs',
      {
        pathParameters: { id, id1, id2 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/messages({id2})/inputs' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param body - New input
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1MessagesId2Inputs: (
    id: string,
    id1: string,
    id2: string,
    body: AgentControllerServiceInputsCreate
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceInputs>(
      'post',
      '/Agents({id})/threads({id1})/messages({id2})/inputs',
      {
        pathParameters: { id, id1, id2 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/inputs({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2InputsId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'name'
        | 'description'
        | 'type'
        | 'possibleValues'
        | 'suggestions'
      >;
      $expand?: Set<'*' | 'message'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceInputs>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/inputs({id3})',
      {
        pathParameters: { id, id1, id2, id3 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/Agents({id})/threads({id1})/messages({id2})/inputs({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param body - New property values
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateAgentsIdThreadsId1MessagesId2InputsId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    body: AgentControllerServiceInputsUpdate
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/Agents({id})/threads({id1})/messages({id2})/inputs({id3})',
      {
        pathParameters: { id, id1, id2, id3 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/Agents({id})/threads({id1})/messages({id2})/inputs({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteAgentsIdThreadsId1MessagesId2InputsId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/Agents({id})/threads({id1})/messages({id2})/inputs({id3})',
      {
        pathParameters: { id, id1, id2, id3 }
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/inputs({id3})/message' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2InputsId3Message: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'previous_ID'
        | 'type'
        | 'canceled'
        | 'sender'
        | 'content'
        | 'outputFormat'
        | 'outputFormatOptions'
        | 'scratchpad'
        | 'group_ID'
        | 'guardrailed'
      >;
      $expand?: Set<
        '*' | 'thread' | 'traces' | 'tokens' | 'previous' | 'inputs' | 'group'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceMessages>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/inputs({id3})/message',
      {
        pathParameters: { id, id1, id2, id3 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/previous' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2Previous: (
    id: string,
    id1: string,
    id2: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'previous_ID'
        | 'type'
        | 'canceled'
        | 'sender'
        | 'content'
        | 'outputFormat'
        | 'outputFormatOptions'
        | 'scratchpad'
        | 'group_ID'
        | 'guardrailed'
      >;
      $expand?: Set<
        '*' | 'thread' | 'traces' | 'tokens' | 'previous' | 'inputs' | 'group'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceMessages>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/previous',
      {
        pathParameters: { id, id1, id2 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/thread' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2Thread: (
    id: string,
    id1: string,
    id2: string,
    queryParameters?: {
      $select?: Set<'ID' | 'createdAt' | 'modifiedAt' | 'name' | 'state'>;
      $expand?: Set<'*' | 'messages' | 'agent'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceThreads>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/thread',
      {
        pathParameters: { id, id1, id2 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/tokens' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2Tokens: (
    id: string,
    id1: string,
    id2: string,
    queryParameters?: {
      $top?: number;
      $skip?: number;
      $search?: string;
      $filter?: string;
      $count?: boolean;
      $orderby?: Set<
        | 'ID'
        | 'ID desc'
        | 'createdAt'
        | 'createdAt desc'
        | 'modifiedAt'
        | 'modifiedAt desc'
        | 'modelName'
        | 'modelName desc'
        | 'inputTokens'
        | 'inputTokens desc'
        | 'outputTokens'
        | 'outputTokens desc'
        | 'inputTokensCost'
        | 'inputTokensCost desc'
        | 'outputTokensCost'
        | 'outputTokensCost desc'
      >;
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'modelName'
        | 'inputTokens'
        | 'outputTokens'
        | 'inputTokensCost'
        | 'outputTokensCost'
      >;
      $expand?: Set<'*' | 'message' | 'trace'>;
    }
  ) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceTokens[];
      } & Record<string, any>
    >(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/tokens',
      {
        pathParameters: { id, id1, id2 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/messages({id2})/tokens' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param body - New token
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1MessagesId2Tokens: (
    id: string,
    id1: string,
    id2: string,
    body: AgentControllerServiceTokensCreate
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceTokens>(
      'post',
      '/Agents({id})/threads({id1})/messages({id2})/tokens',
      {
        pathParameters: { id, id1, id2 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TokensId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'modelName'
        | 'inputTokens'
        | 'outputTokens'
        | 'inputTokensCost'
        | 'outputTokensCost'
      >;
      $expand?: Set<'*' | 'message' | 'trace'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceTokens>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})',
      {
        pathParameters: { id, id1, id2, id3 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param body - New property values
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateAgentsIdThreadsId1MessagesId2TokensId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    body: AgentControllerServiceTokensUpdate
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})',
      {
        pathParameters: { id, id1, id2, id3 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteAgentsIdThreadsId1MessagesId2TokensId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})',
      {
        pathParameters: { id, id1, id2, id3 }
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})/message' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TokensId3Message: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'previous_ID'
        | 'type'
        | 'canceled'
        | 'sender'
        | 'content'
        | 'outputFormat'
        | 'outputFormatOptions'
        | 'scratchpad'
        | 'group_ID'
        | 'guardrailed'
      >;
      $expand?: Set<
        '*' | 'thread' | 'traces' | 'tokens' | 'previous' | 'inputs' | 'group'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceMessages>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})/message',
      {
        pathParameters: { id, id1, id2, id3 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})/trace' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TokensId3Trace: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    queryParameters?: {
      $select?: Set<
        'ID' | 'createdAt' | 'modifiedAt' | 'fromId' | 'toId' | 'type' | 'data'
      >;
      $expand?: Set<'*' | 'message' | 'tokens'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceTraces>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/tokens({id3})/trace',
      {
        pathParameters: { id, id1, id2, id3 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/traces' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2Traces: (
    id: string,
    id1: string,
    id2: string,
    queryParameters?: {
      $top?: number;
      $skip?: number;
      $search?: string;
      $filter?: string;
      $count?: boolean;
      $orderby?: Set<
        | 'ID'
        | 'ID desc'
        | 'createdAt'
        | 'createdAt desc'
        | 'modifiedAt'
        | 'modifiedAt desc'
        | 'fromId'
        | 'fromId desc'
        | 'toId'
        | 'toId desc'
        | 'type'
        | 'type desc'
        | 'data'
        | 'data desc'
      >;
      $select?: Set<
        'ID' | 'createdAt' | 'modifiedAt' | 'fromId' | 'toId' | 'type' | 'data'
      >;
      $expand?: Set<'*' | 'message' | 'tokens'>;
    }
  ) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceTraces[];
      } & Record<string, any>
    >(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/traces',
      {
        pathParameters: { id, id1, id2 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/messages({id2})/traces' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param body - New trace
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1MessagesId2Traces: (
    id: string,
    id1: string,
    id2: string,
    body: AgentControllerServiceTracesCreate
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceTraces>(
      'post',
      '/Agents({id})/threads({id1})/messages({id2})/traces',
      {
        pathParameters: { id, id1, id2 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TracesId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    queryParameters?: {
      $select?: Set<
        'ID' | 'createdAt' | 'modifiedAt' | 'fromId' | 'toId' | 'type' | 'data'
      >;
      $expand?: Set<'*' | 'message' | 'tokens'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceTraces>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})',
      {
        pathParameters: { id, id1, id2, id3 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param body - New property values
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateAgentsIdThreadsId1MessagesId2TracesId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    body: AgentControllerServiceTracesUpdate
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})',
      {
        pathParameters: { id, id1, id2, id3 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteAgentsIdThreadsId1MessagesId2TracesId3: (
    id: string,
    id1: string,
    id2: string,
    id3: string
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})',
      {
        pathParameters: { id, id1, id2, id3 }
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/message' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TracesId3Message: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'previous_ID'
        | 'type'
        | 'canceled'
        | 'sender'
        | 'content'
        | 'outputFormat'
        | 'outputFormatOptions'
        | 'scratchpad'
        | 'group_ID'
        | 'guardrailed'
      >;
      $expand?: Set<
        '*' | 'thread' | 'traces' | 'tokens' | 'previous' | 'inputs' | 'group'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceMessages>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/message',
      {
        pathParameters: { id, id1, id2, id3 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TracesId3Tokens: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    queryParameters?: {
      $top?: number;
      $skip?: number;
      $search?: string;
      $filter?: string;
      $count?: boolean;
      $orderby?: Set<
        | 'ID'
        | 'ID desc'
        | 'createdAt'
        | 'createdAt desc'
        | 'modifiedAt'
        | 'modifiedAt desc'
        | 'modelName'
        | 'modelName desc'
        | 'inputTokens'
        | 'inputTokens desc'
        | 'outputTokens'
        | 'outputTokens desc'
        | 'inputTokensCost'
        | 'inputTokensCost desc'
        | 'outputTokensCost'
        | 'outputTokensCost desc'
      >;
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'modelName'
        | 'inputTokens'
        | 'outputTokens'
        | 'inputTokensCost'
        | 'outputTokensCost'
      >;
      $expand?: Set<'*' | 'message' | 'trace'>;
    }
  ) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceTokens[];
      } & Record<string, any>
    >(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens',
      {
        pathParameters: { id, id1, id2, id3 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param body - New token
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdThreadsId1MessagesId2TracesId3Tokens: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    body: AgentControllerServiceTokensCreate
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceTokens>(
      'post',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens',
      {
        pathParameters: { id, id1, id2, id3 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param id4 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TracesId3TokensId4: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    id4: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'modelName'
        | 'inputTokens'
        | 'outputTokens'
        | 'inputTokensCost'
        | 'outputTokensCost'
      >;
      $expand?: Set<'*' | 'message' | 'trace'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceTokens>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})',
      {
        pathParameters: { id, id1, id2, id3, id4 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param id4 - key: ID
   * @param body - New property values
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateAgentsIdThreadsId1MessagesId2TracesId3TokensId4: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    id4: string,
    body: AgentControllerServiceTokensUpdate
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})',
      {
        pathParameters: { id, id1, id2, id3, id4 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param id4 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteAgentsIdThreadsId1MessagesId2TracesId3TokensId4: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    id4: string
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})',
      {
        pathParameters: { id, id1, id2, id3, id4 }
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})/message' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param id4 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TracesId3TokensId4Message: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    id4: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'previous_ID'
        | 'type'
        | 'canceled'
        | 'sender'
        | 'content'
        | 'outputFormat'
        | 'outputFormatOptions'
        | 'scratchpad'
        | 'group_ID'
        | 'guardrailed'
      >;
      $expand?: Set<
        '*' | 'thread' | 'traces' | 'tokens' | 'previous' | 'inputs' | 'group'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceMessages>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})/message',
      {
        pathParameters: { id, id1, id2, id3, id4 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})/trace' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param id2 - key: ID
   * @param id3 - key: ID
   * @param id4 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdThreadsId1MessagesId2TracesId3TokensId4Trace: (
    id: string,
    id1: string,
    id2: string,
    id3: string,
    id4: string,
    queryParameters?: {
      $select?: Set<
        'ID' | 'createdAt' | 'modifiedAt' | 'fromId' | 'toId' | 'type' | 'data'
      >;
      $expand?: Set<'*' | 'message' | 'tokens'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceTraces>(
      'get',
      '/Agents({id})/threads({id1})/messages({id2})/traces({id3})/tokens({id4})/trace',
      {
        pathParameters: { id, id1, id2, id3, id4 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/toolkits' endpoint.
   * @param id - key: ID
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdToolkits: (
    id: string,
    queryParameters?: {
      $top?: number;
      $skip?: number;
      $search?: string;
      $filter?: string;
      $count?: boolean;
      $orderby?: Set<
        | 'ID'
        | 'ID desc'
        | 'createdAt'
        | 'createdAt desc'
        | 'modifiedAt'
        | 'modifiedAt desc'
        | 'name'
        | 'name desc'
        | 'type'
        | 'type desc'
        | 'instanceId'
        | 'instanceId desc'
      >;
      $select?: Set<
        'ID' | 'createdAt' | 'modifiedAt' | 'name' | 'type' | 'instanceId'
      >;
      $expand?: Set<'*' | 'agent'>;
    }
  ) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceToolkits[];
      } & Record<string, any>
    >(
      'get',
      '/Agents({id})/toolkits',
      {
        pathParameters: { id },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/Agents({id})/toolkits' endpoint.
   * @param id - key: ID
   * @param body - List of Toolkits
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createAgentsIdToolkits: (
    id: string,
    body: AgentControllerServiceToolkitsCreate
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceToolkits>(
      'post',
      '/Agents({id})/toolkits',
      {
        pathParameters: { id },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/toolkits({id1})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdToolkitsId1: (
    id: string,
    id1: string,
    queryParameters?: {
      $select?: Set<
        'ID' | 'createdAt' | 'modifiedAt' | 'name' | 'type' | 'instanceId'
      >;
      $expand?: Set<'*' | 'agent'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceToolkits>(
      'get',
      '/Agents({id})/toolkits({id1})',
      {
        pathParameters: { id, id1 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/Agents({id})/toolkits({id1})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param body - List of Toolkits
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateAgentsIdToolkitsId1: (
    id: string,
    id1: string,
    body: AgentControllerServiceToolkitsUpdate
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/Agents({id})/toolkits({id1})',
      {
        pathParameters: { id, id1 },
        body
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/Agents({id})/toolkits({id1})' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteAgentsIdToolkitsId1: (id: string, id1: string) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/Agents({id})/toolkits({id1})',
      {
        pathParameters: { id, id1 }
      },
      AgentsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/Agents({id})/toolkits({id1})/agent' endpoint.
   * @param id - key: ID
   * @param id1 - key: ID
   * @param queryParameters - Object containing the following keys: $select, $expand.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAgentsIdToolkitsId1Agent: (
    id: string,
    id1: string,
    queryParameters?: {
      $select?: Set<
        | 'ID'
        | 'createdAt'
        | 'modifiedAt'
        | 'name'
        | 'version'
        | 'deploymentStatus'
        | 'expertIn'
        | 'task'
        | 'additionalContext'
        | 'iterations'
        | 'orchestrationConfig'
        | 'baseModel'
        | 'backupBaseModel'
        | 'advancedModel'
        | 'backupAdvancedModel'
        | 'preprocessingEnabled'
        | 'postprocessingEnabled'
        | 'defaultOutputFormat'
        | 'defaultOutputFormatOptions'
        | 'callbackDestination'
      >;
      $expand?: Set<'*' | 'threads' | 'toolkits'>;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceAgents>(
      'get',
      '/Agents({id})/toolkits({id1})/agent',
      {
        pathParameters: { id, id1 },
        queryParameters
      },
      AgentsApi._defaultBasePath
    )
};
