/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type { PredictRequest, PredictResponse } from './schema/index.js';
/**
 * Representation of the 'PredictApi'.
 * This API is part of the 'tabular-orchestration' service.
 */
export const PredictApi = {
  _defaultBasePath: undefined,
  /**
   * Make predictions for tabular data using a deployed Tabular Foundation Model.
   *
   *     Required Headers:
   *     - ai-resource-group: AI Core resource group identifier
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: ai-resource-group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  predictV1PredictPost: (
    body: PredictRequest,
    headerParameters: { 'ai-resource-group': string }
  ) =>
    new OpenApiRequestBuilder<PredictResponse>(
      'post',
      '/v1/predict',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      PredictApi._defaultBasePath
    )
};
