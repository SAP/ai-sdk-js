/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  BckndResourceGetResponse,
  BckndResourcePatchBody,
  BckndResourcePatchResponse
} from './schema/index.js';
/**
 * Representation of the 'ResourceApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ResourceApi = {
  _defaultBasePath: undefined,
  /**
   * Lists all hot spare nodes, used nodes and total nodes corresponding to tenant.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourcesGet: (headerParameters?: { Authorization?: string }) =>
    new OpenApiRequestBuilder<BckndResourceGetResponse>(
      'get',
      '/admin/resources/nodes',
      {
        headerParameters
      },
      ResourceApi._defaultBasePath
    ),
  /**
   * Set hot spare nodes corresponding to tenant at main tenant level.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourcesPatch: (
    body: BckndResourcePatchBody,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndResourcePatchResponse>(
      'patch',
      '/admin/resources/nodes',
      {
        body,
        headerParameters
      },
      ResourceApi._defaultBasePath
    )
};
