/**
 * Request object for changing the target status of an execution (currently only STOPPED is supported)
 */
export type AiExecutionModificationRequest = {
    /**
     * Desired target status of the execution (currently only STOPPED is supported)
     */
    targetStatus: 'STOPPED';
} & Record<string, any>;
//# sourceMappingURL=ai-execution-modification-request.d.ts.map