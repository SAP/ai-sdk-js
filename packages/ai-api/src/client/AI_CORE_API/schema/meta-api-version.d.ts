/**
 * API version description
 */
export type MetaAPIVersion = {
    /**
     * API version identifier
     * @example "v1"
     */
    versionId?: string;
    /**
     * URL of the API version
     * @example "https://api.example.com/v1"
     */
    url?: string;
    /**
     * version description
     * @example "Example API"
     */
    description?: string;
} & Record<string, any>;
//# sourceMappingURL=meta-api-version.d.ts.map