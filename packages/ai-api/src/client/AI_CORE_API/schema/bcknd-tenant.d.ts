/**
 * Representation of the 'BckndTenant' schema.
 */
export type BckndTenant = {
    /**
     * tenant id
     */
    tenantId?: string;
    /**
     * zone id
     */
    zoneId?: string;
    /**
     * real sub account id
     */
    realSubaccountId?: string;
    /**
     * service plan
     */
    servicePlan?: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-tenant.d.ts.map