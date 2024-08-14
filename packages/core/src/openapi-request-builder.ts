import { OpenApiRequestBuilder as CloudSDKOpenApiRequestBuilder, OpenApiRequestParameters } from '@sap-cloud-sdk/openapi';
import { HttpResponse, Method } from '@sap-cloud-sdk/http-client';
import { executeRequest } from './http-client.js';

export class OpenApiRequestBuilder<ResponseT> extends CloudSDKOpenApiRequestBuilder<ResponseT> {
    constructor(
        method: Method,
        pathPattern: string,
        parameters?: OpenApiRequestParameters
    ) {
        super(method, pathPattern, parameters);
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

    /**
     * Execute request and get the response data. Use this to conveniently access the data of a service without technical information about the response.
     */
    async executeRaw(): Promise<HttpResponse> {
        const { url, data, ...rest } = await this.requestConfig();
        // TODO: Add fetchCsrfToken logic. Need to change executeRequest param type.
        return executeRequest(
            { url: url! },
            {
                deploymentConfiguration: { deploymentId: '' },
                ...data
            },
            {
                ...rest
            });
    }
}
