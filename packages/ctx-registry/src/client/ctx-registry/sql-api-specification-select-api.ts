/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  SqlApiQueryRequest,
  SqlApiQueryResponse
} from './schema/index.js';
/**
 * Representation of the 'SqlApiSpecificationSELECTApi'.
 * This API is part of the 'ctx-registry' service.
 */
export const SqlApiSpecificationSELECTApi = {
  _defaultBasePath: '/v2/admin/tcr',
  /**
   * Executes a read-only SQL query via SQL_SELECT_USER.  Only SELECT statements (including CTEs introduced with WITH) are accepted. All user-supplied filter values must be passed as named bind parameters.
   * Pagination modes:
   * - **Single-shot** (omit top): returns up to maxRows rows.
   *   If the result is capped, truncated is true.
   *
   * - **Paginated** (provide top + skip): the service wraps your statement
   *   as ``SELECT * FROM (<statement>) AS "__paged" LIMIT <top> OFFSET <skip>``
   *   and executes it on HANA.  Iterate by incrementing skip by top on each
   *   request until hasMore is false.  Include an ORDER BY in your statement
   *   to guarantee a stable page order.
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersSqlApiV1EndpointsExecuteQuery: (
    body: SqlApiQueryRequest,
    headerParameters: { 'AI-Main-Tenant': string; 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SqlApiQueryResponse>(
      'post',
      '/query',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      SqlApiSpecificationSELECTApi._defaultBasePath
    )
};
