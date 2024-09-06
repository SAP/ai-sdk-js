/**
 * Argument of an executable
 */
export type RTAExecutableParameter = {
    /**
     * Name of the signature argument
     */
    name: string;
    /**
     * Description of the signature argument
     * Max Length: 5000.
     */
    description?: string;
    /**
     * Default value of the signature argument
     */
    default?: string;
    /**
     * Type of the signature argument
     */
    type?: 'string';
} & Record<string, any>;
//# sourceMappingURL=rta-executable-parameter.d.ts.map