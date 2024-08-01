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
   * The deployment ID to call.
   */
  deploymentId: string;
  /**
   * The specific endpoint to call.
   */
  path: string;
}
/**
 * Executes a request to the AI Core service.
 * @param endpointOptions - The options to call an endpoint.
 * @param data - The input parameters for the request.
 * @param requestConfig - The request configuration.
 * @returns The {@link HttpResponse} from the AI Core service.
 */
async function executeRequest(
  endpointOptions: EndpointOptions,
  data: any,
  requestConfig?: CustomRequestConfig
): Promise<HttpResponse> {
  const aiCoreDestination = await getAiCoreDestination();

  const targetUrl =
    aiCoreDestination.url +
    '/v2/inference/deployments/' +
    endpointOptions.deploymentId +
    `/${removeLeadingSlashes(endpointOptions.path)}`;

  return executeHttpRequest(
    { ...aiCoreDestination, url: targetUrl },
    data,
    {
      fetchCsrfToken: false
    }
  );
}

function mergeWithDefaultRequestConfig(
  requestConfig?: CustomRequestConfig
): HttpRequestConfig {
  
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
