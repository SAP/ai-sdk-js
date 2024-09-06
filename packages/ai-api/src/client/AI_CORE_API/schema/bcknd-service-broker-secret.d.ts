/**
 * Representation of the 'BckndServiceBrokerSecret' schema.
 */
export type BckndServiceBrokerSecret = {
    /**
     * broker secret name
     */
    name?: string;
    /**
     * username key reference in broker secret
     */
    passwordKeyRef?: string;
    /**
     * password key reference in broker secret
     */
    usernameKeyRef?: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-service-broker-secret.d.ts.map