import { removeLeadingSlashes } from '@sap-cloud-sdk/util';
import {
  executeHttpRequest,
  HttpRequestConfig,
  HttpResponse
} from '@sap-cloud-sdk/http-client';
import { getAiCoreDestination } from './context.js';

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
export async function executeRequest(
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
    {
      headers: {'content-type': 'application/json', 'ai-resource-group': 'default'},
      ...requestConfig,
      method: 'POST',
      body: data
    },
    {
      fetchCsrfToken: false
    }
  );
}
