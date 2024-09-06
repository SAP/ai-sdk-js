/**
 * Representation of the 'AiExecutableParameter' schema.
 */
export type AiExecutableParameter = {
    /**
     * Name of the executable parameter
     */
    name: string;
    /**
     * Description of the signature argument
     */
    description?: string;
    /**
     * Default value of the signature argument
     */
    default?: string;
    /**
     * Type of the executable parameter
     */
    type?: 'string';
} & Record<string, any>;
//# sourceMappingURL=ai-executable-parameter.d.ts.map