/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type { MetaCapabilities } from './schema/index.js';
/**
 * Representation of the 'MetaApi'.
 * This API is part of the 'src' service.
 */
export const MetaApi = {
  /**
   * Meta information about an implementation of AI API, describing its capabilities, limits and extensions
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  metaGet: () => new OpenApiRequestBuilder<MetaCapabilities>('get', '/lm/meta')
};
