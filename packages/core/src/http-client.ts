import { removeLeadingSlashes } from '@sap-cloud-sdk/util';
import {
  executeHttpRequest,
  HttpRequestConfig,
  HttpResponse
} from '@sap-cloud-sdk/http-client';
import { getAiCoreDestination } from './context.js';

/**
 * Input parameters with Deployment ID.
 */
export interface BaseLlmParametersWithDeploymentId {
  /**
   * Deployment ID of the model to use.
   */
  deploymentId: string;
}
/**
 * Base LLM Input Parameters.
 */
export interface BaseLlmParameters {
  /**
   * Deployment configuration.
   */
  deploymentConfiguration: BaseLlmParametersWithDeploymentId;
}

/**
 * The type for parameters in custom request configuration.
 */
export type CustomRequestConfig = Omit<
  HttpRequestConfig,
  'body' | 'method' | 'url' | 'baseURL'
>;

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
}
/**
 * Executes a request to the AI Core service.
 * @param endpointOptions - The options to call an endpoint.
 * @param data - The input parameters for the request.
 * @param requestConfig - The request configuration.
 * @returns The {@link HttpResponse} from the AI Core service.
 */
export async function executeRequest<D extends BaseLlmParameters>(
  endpointOptions: EndpointOptions,
  data: D,
  requestConfig?: CustomRequestConfig
): Promise<HttpResponse> {
  const aiCoreDestination = await getAiCoreDestination();
  const { deploymentConfiguration, ...body } = data;
  const { url, apiVersion } = endpointOptions;

  const mergedRequestConfig = {
    ...mergeWithDefaultRequestConfig(apiVersion, requestConfig),
    data: JSON.stringify(body)
  };

  const targetUrl =
    aiCoreDestination.url +
    '/v2/inference/deployments/' +
    deploymentConfiguration.deploymentId +
    `/${removeLeadingSlashes(url)}`;

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
  requestConfig?: CustomRequestConfig
): HttpRequestConfig {
  const defaultConfig: HttpRequestConfig = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'ai-resource-group': 'default'
    },
    params: apiVersion ? { 'api-version': apiVersion } : {}
  };
  return {
    ...defaultConfig,
    ...requestConfig,
    headers: {
      ...defaultConfig.headers,
      ...requestConfig?.headers
    },
    params: {
      ...defaultConfig.params,
      ...requestConfig?.params
    }
  };
}
