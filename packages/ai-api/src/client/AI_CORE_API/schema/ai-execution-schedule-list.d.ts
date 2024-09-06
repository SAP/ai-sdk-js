import type { AiExecutionSchedule } from './ai-execution-schedule.js';
/**
 * Representation of the 'AiExecutionScheduleList' schema.
 */
export type AiExecutionScheduleList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiExecutionSchedule[];
} & Record<string, any>;
//# sourceMappingURL=ai-execution-schedule-list.d.ts.map