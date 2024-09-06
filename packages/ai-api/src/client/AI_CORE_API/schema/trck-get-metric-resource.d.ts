import type { TrckExecutionId } from './trck-execution-id.js';
import type { TrckGetMetricList } from './trck-get-metric-list.js';
import type { TrckTagList } from './trck-tag-list.js';
import type { TrckCustomInfoObjectList } from './trck-custom-info-object-list.js';
/**
 * Collection of various metrics/tags/labels associated against some execution/deployment
 */
export type TrckGetMetricResource = {
    executionId: TrckExecutionId;
    metrics?: TrckGetMetricList;
    tags?: TrckTagList;
    customInfo?: TrckCustomInfoObjectList;
} & Record<string, any>;
//# sourceMappingURL=trck-get-metric-resource.d.ts.map