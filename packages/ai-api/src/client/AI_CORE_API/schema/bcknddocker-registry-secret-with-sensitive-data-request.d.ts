/**
 * This represents all the meta-data and extra information to be stored as a k8-secret
 */
export type BcknddockerRegistrySecretWithSensitiveDataRequest = {
    /**
     * key:value pairs of data
     */
    data: {
        /**
         * .dockerconfigjson data
         */
        '.dockerconfigjson': string;
    };
} & Record<string, any>;
//# sourceMappingURL=bcknddocker-registry-secret-with-sensitive-data-request.d.ts.map