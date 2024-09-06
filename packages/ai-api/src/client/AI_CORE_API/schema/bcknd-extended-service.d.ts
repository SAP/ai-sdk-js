import type { BckndServiceBrokerSecret } from './bcknd-service-broker-secret.js';
import type { BckndServiceCapabilities } from './bcknd-service-capabilities.js';
import type { BckndServiceServiceCatalog } from './bcknd-service-service-catalog.js';
/**
 * Representation of the 'BckndExtendedService' schema.
 */
export type BckndExtendedService = {
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
    brokerSecret?: BckndServiceBrokerSecret;
    capabilities?: BckndServiceCapabilities;
    serviceCatalog?: BckndServiceServiceCatalog;
    /**
     * aggregated status of the service
     */
    status?: 'PROVISIONED' | 'ERROR' | 'PROVISIONING' | 'DEPROVISIONING';
    /**
     * status message
     */
    statusMessage?: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-extended-service.d.ts.map