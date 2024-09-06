/**
 * Representation of the 'BckndService' schema.
 */
export type BckndService = {
    /**
     * service name
     */
    name?: string;
    /**
     * service description
     */
    description?: string;
    /**
     * service broker url
     */
    url?: string;
    /**
     * aggregated status of the service
     */
    status?: 'PROVISIONED' | 'ERROR' | 'PROVISIONING' | 'DEPROVISIONING';
    /**
     * status message
     */
    statusMessage?: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-service.d.ts.map