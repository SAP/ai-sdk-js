import type { AiCron } from './ai-cron.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
/**
 * Start and end an execution schedule.
 */
export type AiExecutionScheduleCreationData = {
    cron: AiCron;
    /**
     * Name of the execution schedule
     * Max Length: 256.
     */
    name: string;
    configurationId: AiConfigurationId;
    /**
     * Timestamp, defining when the executions should start running periodically, defaults to now
     * Format: "date-time".
     */
    start?: string;
    /**
     * Timestamp, defining when the executions should stop running
     * Format: "date-time".
     */
    end?: string;
} & Record<string, any>;
//# sourceMappingURL=ai-execution-schedule-creation-data.d.ts.map