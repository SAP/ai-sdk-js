import type { RTAtimestamp } from './rt-atimestamp.js';
import type { RTAmessage } from './rt-amessage.js';
/**
 * Common log record.
 */
export type RTALogCommonResultItem = {
    timestamp?: RTAtimestamp;
    msg?: RTAmessage;
} & Record<string, any>;
//# sourceMappingURL=rta-log-common-result-item.d.ts.map