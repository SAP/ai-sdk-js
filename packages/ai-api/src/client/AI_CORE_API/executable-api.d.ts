import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AiExecutableList, AiExecutable } from './schema/index.js';
/**
 * Representation of the 'ExecutableApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ExecutableApi: {
    /**
     * Retrieve a list of executables for a scenario. Filter by version ID, if required.
     *
     * @param scenarioId - Scenario identifier
     * @param queryParameters - Object containing the following keys: versionId.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executableQuery: (scenarioId: string, queryParameters: {
        versionId?: string;
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiExecutableList>;
    /**
     * Retrieve details about an executable identified by executableId belonging
     * to a scenario identified by scenarioId.
     *
     * @param scenarioId - Scenario identifier
     * @param executableId - Executable identifier
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executableGet: (scenarioId: string, executableId: string, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiExecutable>;
};
//# sourceMappingURL=executable-api.d.ts.map