/**
 * This represents the meta-data of a stored secret. The 'data' field of the secret is never retrieved.
 */
export type BckndobjectStoreSecretStatus = {
    /**
     * Key value pairs of meta-data assigned to the secret when the secret was being created.
     */
    metadata?: {
        /**
         * 0 and 1 values for setting the flag
         * @example "1"
         */
        'serving.kubeflow.org/s3-usehttps'?: string;
        /**
         * 0 and 1 values for setting the flag
         * @example "0"
         */
        'serving.kubeflow.org/s3-verifyssl'?: string;
        /**
         * Annotation for endpoint required by KF_Serving
         * @example "some_endpoint"
         */
        'serving.kubeflow.org/s3-endpoint'?: string;
        /**
         * Annotation for region required by KF_Serving
         * @example "EU"
         */
        'serving.kubeflow.org/s3-region'?: string;
        /**
         * Storage type of the secret
         * @example "S3"
         */
        'storage.ai.sap.com/type'?: string;
        /**
         * bucket assigned to the secret on creation
         * @example "my_bucket"
         */
        'storage.ai.sap.com/bucket'?: string;
        /**
         * Endpoint assigned to the secret on creation
         * @example "some_endpoint"
         */
        'storage.ai.sap.com/endpoint'?: string;
        /**
         * Region of the storage server
         * @example "EU"
         */
        'storage.ai.sap.com/region'?: string;
        /**
         * Pathprefix type assigned to the secret on creation.
         * @example "mnist_folder"
         */
        'storage.ai.sap.com/pathPrefix'?: string;
        /**
         * name node of the HDFS file system
         * @example "https://c3272xxxxxfa8f.files.hdl.canary-eu10.hanacloud.ondemand.com"
         */
        'storage.ai.sap.com/hdfsNameNode'?: string;
        /**
         * headers for webHDFS and other protocols
         * @example "{\"x-sap-filecontainer\": \"c32727xxxxxxx322dcfa8f\"}"
         */
        'storage.ai.sap.com/headers'?: string;
        /**
         * container uri of azure storage
         * @example "https://sapcv842awjkfb2.blob.core.windows.net/sapcp-osaas-xxx-xxxx-xxxx-xxxx-xxxx-zrs"
         */
        'storage.ai.sap.com/containerUri'?: string;
        /**
         * subscription id
         * @example "dgewg2-gkrwnegiw"
         */
        'storage.ai.sap.com/subscriptionId'?: string;
        /**
         * tenant id
         * @example "dawd2120-dadwad2"
         */
        'storage.ai.sap.com/tenantId'?: string;
        /**
         * project id of google cloud platform
         * @example "sap-gcp-oaas-us31-1"
         */
        'storage.ai.sap.com/projectId'?: string;
    } & Record<string, any>;
    /**
     * Name of objectstore
     * @example "myobjectstore-object-store-secret"
     */
    name?: string;
} & Record<string, any>;
//# sourceMappingURL=bckndobject-store-secret-status.d.ts.map