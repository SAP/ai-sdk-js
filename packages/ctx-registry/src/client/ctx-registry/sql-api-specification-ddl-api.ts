/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type {
  SqlApiDdlRequest,
  SqlApiDdlResponse,
  SqlApiDdlBatchRequest,
  SqlApiDdlBatchResponse,
  SqlApiTableList,
  SqlApiDdlBatchDeleteRequest,
  SqlApiDdlBatchDeleteResponse,
  SqlApiTableDefinition
} from './schema/index.js';
/**
 * Representation of the 'SqlApiSpecificationDDLApi'.
 * This API is part of the 'ctx-registry' service.
 */
export const SqlApiSpecificationDDLApi = {
  _defaultBasePath: '/v2/admin/tcr',
  /**
   * Executes a DDL statement (CREATE TABLE/INDEX/VIEW, ALTER TABLE, DROP TABLE/INDEX/VIEW, GRANT, REVOKE) via SQL_DDL_USER. After a successful CREATE TABLE the service automatically grants INSERT/UPDATE/DELETE to SQL_DML_USER and SELECT to SQL_SELECT_USER, and registers the table in the internal registry. Schema-level operations (CREATE SCHEMA, DROP SCHEMA) are rejected.
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsExecuteDdl: (
    body: SqlApiDdlRequest,
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SqlApiDdlResponse>(
      'post',
      '/ddl',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      SqlApiSpecificationDDLApi._defaultBasePath
    ),
  /**
   * Executes an ordered list of DDL statements serially on a single SQL_DDL_USER connection.  Stops on the first error by default (stopOnError: true).
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsExecuteDdlBatch: (
    body: SqlApiDdlBatchRequest,
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SqlApiDdlBatchResponse>(
      'post',
      '/ddl/batch',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      SqlApiSpecificationDDLApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/ddl/tables' endpoint.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsListTables: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SqlApiTableList>(
      'get',
      '/ddl/tables',
      {
        headerParameters,
        queryParameters
      },
      SqlApiSpecificationDDLApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/ddl/tables/batch' endpoint.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsDropTableBatch: (
    body: SqlApiDdlBatchDeleteRequest,
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SqlApiDdlBatchDeleteResponse>(
      'post',
      '/ddl/tables/batch',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      SqlApiSpecificationDDLApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/ddl/tables/{tableName}' endpoint.
   * @param tableName - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsGetTable: (
    tableName: string,
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SqlApiTableDefinition>(
      'get',
      '/ddl/tables/{tableName}',
      {
        pathParameters: { tableName },
        headerParameters
      },
      SqlApiSpecificationDDLApi._defaultBasePath
    ),
  /**
   * Revokes INSERT/UPDATE/DELETE from SQL_DML_USER and SELECT from SQL_SELECT_USER, drops the HANA table, and marks the registry entry as DROPPED.
   *
   * @param tableName - Path parameter.
   * @param queryParameters - Object containing the following keys: ifExists.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsDropTable: (
    tableName: string,
    queryParameters: { ifExists?: boolean },
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/ddl/tables/{tableName}',
      {
        pathParameters: { tableName },
        headerParameters,
        queryParameters
      },
      SqlApiSpecificationDDLApi._defaultBasePath
    )
};
