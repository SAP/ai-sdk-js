/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type {
  SqlApiDmlRequest,
  SqlApiDmlResponse,
  SqlApiDmlBatchRequest,
  SqlApiDmlBatchResponse
} from './schema/index.js';
/**
 * Representation of the 'SqlApiSpecificationDMLApi'.
 * This API is part of the 'ctx-registry' service.
 */
export const SqlApiSpecificationDMLApi = {
  _defaultBasePath: '/admin/tcr',
  /**
   * Executes a single DML statement (INSERT, UPDATE, DELETE, UPSERT, MERGE) against the caller's tenant schema via SQL_DML_USER.  Any DDL or SELECT keyword causes a 400 INVALID_SQL_CLASS error.  All data values must be supplied as named bind parameters (:name); inline literals are rejected.
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsExecuteDml: (
    body: SqlApiDmlRequest,
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SqlApiDmlResponse>(
      'post',
      '/dml',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      SqlApiSpecificationDMLApi._defaultBasePath
    ),
  /**
   * Executes an ordered list of DML statements.  When transaction is true (default), all statements run inside a single HANA transaction: if any statement fails the entire batch is rolled back.  When transaction is false, each statement is auto-committed independently and results are collected per-statement.
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsExecuteDmlBatch: (
    body: SqlApiDmlBatchRequest,
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SqlApiDmlBatchResponse>(
      'post',
      '/dml/batch',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      SqlApiSpecificationDMLApi._defaultBasePath
    )
};
