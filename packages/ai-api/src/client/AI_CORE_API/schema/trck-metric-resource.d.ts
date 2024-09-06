import type { TrckExecutionId } from './trck-execution-id.js';
import type { TrckMetricList } from './trck-metric-list.js';
import type { TrckTagList } from './trck-tag-list.js';
import type { TrckCustomInfoObjectList } from './trck-custom-info-object-list.js';
/**
 * Collection of various metrics/tags/labels associated against some execution/deployment
 */
export type TrckMetricResource = {
    executionId: TrckExecutionId;
    metrics?: TrckMetricList;
    tags?: TrckTagList;
    customInfo?: TrckCustomInfoObjectList;
} & Record<string, any>;
//# sourceMappingURL=trck-metric-resource.d.ts.map