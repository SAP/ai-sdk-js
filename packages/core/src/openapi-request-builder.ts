import { OpenApiRequestBuilder as CloudSDKOpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import { executeRequest } from './http-client.js';
import type { OpenApiRequestParameters } from '@sap-cloud-sdk/openapi';
import type { HttpResponse, Method } from '@sap-cloud-sdk/http-client';

/**
 * Request builder for OpenAPI requests.
 * @typeParam ResponseT - Type of the response for the request.
 */
export class OpenApiRequestBuilder<
  ResponseT
> extends CloudSDKOpenApiRequestBuilder<ResponseT> {
  constructor(
    method: Method,
    pathPattern: string,
    parameters?: OpenApiRequestParameters
  ) {
    super(method, pathPattern, parameters);
  }

  /**
   * Execute request and get the response data. Use this to conveniently access the data of a service without technical information about the response.
   * @returns A promise resolving to an HttpResponse.
   */
  async executeRaw(): Promise<HttpResponse> {
    const { url, data, ...rest } = await this.requestConfig();
    // TODO: Remove explicit url! once we updated the type in the Cloud SDK, since url is always defined.
    return executeRequest({ url: url! }, data, {
      ...rest,
      headers: {
        ...rest.headers?.requestConfig,
        ...rest.headers?.custom
      },
      params: {
        ...rest.params?.requestConfig,
        ...rest.params?.custom
      }
    });
  }

  /**
   * Execute request and get the response data. Use this to conveniently access the data of a service without technical information about the response.
   * @returns A promise resolving to the requested return type.
   */
  async execute(): Promise<ResponseT> {
    const response = await this.executeRaw();
    if ('data' in response) {
      return response.data;
    }
    throw new Error(
      'Could not access response data. Response was not an axios response.'
    );
  }
}
