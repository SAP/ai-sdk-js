import type { TrckMetricName } from './trck-metric-name.js';
import type { TrckMetricValue } from './trck-metric-value.js';
import type { TrckTimestamp } from './trck-timestamp.js';
import type { TrckLabelList } from './trck-label-list.js';
/**
 * Key-value metrics, where the value is numeric. Metric can also have optional step and label fields.
 */
export type TrckGetMetric = {
    name: TrckMetricName;
    value: TrckMetricValue;
    timestamp: TrckTimestamp;
    /**
     * step is an optional integer that represents any measurement of training progress (number of training iterations, number of epochs, and so on) for the metric
     * @example 2
     */
    step?: number;
    labels?: TrckLabelList;
} & Record<string, any>;
//# sourceMappingURL=trck-get-metric.d.ts.map