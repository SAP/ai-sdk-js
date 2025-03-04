import {
  ErrorWithCause,
  mergeIgnoreCase,
  removeLeadingSlashes,
  removeTrailingSlashes
} from '@sap-cloud-sdk/util';
import { executeHttpRequest } from '@sap-cloud-sdk/http-client';
import { getAiCoreDestination } from './context.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
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
 * @param destination - The destination to use for the request.
 * @returns The {@link HttpResponse} from the AI Core service.
 */
export async function executeRequest(
  endpointOptions: EndpointOptions,
  data: any,
  requestConfig?: CustomRequestConfig,
  destination?: HttpDestinationOrFetchOptions
): Promise<HttpResponse> {
  const aiCoreDestination = await getAiCoreDestination(destination);
  const { url, apiVersion, resourceGroup = 'default' } = endpointOptions;

  const mergedRequestConfig = {
    ...mergeWithDefaultRequestConfig(apiVersion, resourceGroup, requestConfig),
    data: JSON.stringify(data)
  };

  try {
    const response = await executeHttpRequest(
      { ...aiCoreDestination, url: getTargetUrl(aiCoreDestination.url, url) },
      mergedRequestConfig,
      {
        fetchCsrfToken: false
      }
    );
    return response;
  } catch (error: any) {
    throw new ErrorWithCause(`Request failed with status code ${error.status}.`, error);
  }
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

/**
 * Get target url with endpoint path appended.
 * Append path `v2` if the url contains empty pathname `/`.
 * @param url - The url, e.g., `http://example.com` or `http://example.com:8000/abc`.
 * @param endpointPath - The path to the endpoint, e.g., `/some/endpoint`.
 * @returns Target url combining the url and endpoint path.
 * @internal
 */
export function getTargetUrl(url: string, endpointPath: string): string {
  // Remove the last trailing slash
  url = removeTrailingSlashes(url);
  // Remove the first leading slashes
  endpointPath = removeLeadingSlashes(endpointPath);

  const urlObj = new URL(url);
  if (urlObj.pathname === '/') {
    return url + '/v2/' + endpointPath;
  }
  return url + '/' + endpointPath;
}
