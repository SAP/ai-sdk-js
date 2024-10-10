import { mergeIgnoreCase, removeLeadingSlashes } from '@sap-cloud-sdk/util';
import { executeHttpRequest } from '@sap-cloud-sdk/http-client';
import { getAiCoreDestination } from './context.js';
import type {
  HttpRequestConfig,
  HttpResponse
} from '@sap-cloud-sdk/http-client';

/**
 * The type for parameters in custom request configuration.
 */
export type CustomRequestConfig = Pick<
  HttpRequestConfig,
  | 'headers'
  | 'params'
  | 'middleware'
  | 'maxContentLength'
  | 'proxy'
  | 'httpAgent'
  | 'httpsAgent'
  | 'parameterEncoder'
> &
  Record<string, any>;

/**
 * The options to call an endpoint.
 */
export interface EndpointOptions {
  /**
   * The specific endpoint to call.
   */
  url: string;
  /**
   * The API version to use.
   */
  apiVersion?: string;
  /**
   * The resource group to use.
   */
  resourceGroup?: string;
}
/**
 * Executes a request to the AI Core service.
 * @param endpointOptions - The options to call an endpoint.
 * @param data - The input parameters for the request.
 * @param requestConfig - The request configuration.
 * @returns The {@link HttpResponse} from the AI Core service.
 */
export async function executeRequest(
  endpointOptions: EndpointOptions,
  data: any,
  requestConfig?: CustomRequestConfig
): Promise<HttpResponse> {
  const aiCoreDestination = await getAiCoreDestination();
  const { url, apiVersion, resourceGroup = 'default' } = endpointOptions;

  const mergedRequestConfig = {
    ...mergeWithDefaultRequestConfig(apiVersion, resourceGroup, requestConfig),
    data: JSON.stringify(data)
  };

  const targetUrl = aiCoreDestination.url + `/v2/${removeLeadingSlashes(url)}`;

  return executeHttpRequest(
    { ...aiCoreDestination, url: targetUrl },
    mergedRequestConfig,
    {
      fetchCsrfToken: false
    }
  );
}

function mergeWithDefaultRequestConfig(
  apiVersion?: string,
  resourceGroup?: string,
  requestConfig?: CustomRequestConfig
): HttpRequestConfig {
  const defaultConfig: HttpRequestConfig = {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'ai-resource-group': resourceGroup,
      'ai-client-type': 'AI SDK JavaScript'
    },
    params: apiVersion ? { 'api-version': apiVersion } : {}
  };
  return {
    ...defaultConfig,
    ...requestConfig,
    headers: mergeIgnoreCase(defaultConfig.headers, requestConfig?.headers),
    params: mergeIgnoreCase(defaultConfig.params, requestConfig?.params)
  };
}
