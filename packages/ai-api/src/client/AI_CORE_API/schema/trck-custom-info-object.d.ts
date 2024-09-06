import type { TrckGenericName } from './trck-generic-name.js';
import type { TrckCustomInfoObjectData } from './trck-custom-info-object-data.js';
/**
 * large object which provides rendering/semantic information regarding certain metric for consuming application or can be complex metrics in JSON format
 * @example {
 *   "name": "Confusion Matrix",
 *   "value": "[{'Predicted': 'False',  'Actual': 'False','value': 34},{'Predicted': 'False','Actual': 'True',  'value': 124}, {'Predicted': 'True','Actual': 'False','value': 165},{  'Predicted': 'True','Actual': 'True','value': 36}]"
 * }
 */
export type TrckCustomInfoObject = {
    name: TrckGenericName;
    value: TrckCustomInfoObjectData;
} & Record<string, any>;
//# sourceMappingURL=trck-custom-info-object.d.ts.map