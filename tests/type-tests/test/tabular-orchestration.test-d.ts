import { TabularOrchestrationClient } from '@sap-ai-sdk/tabular-orchestration';

import { expectError, expectType } from 'tsd';

import type {
  ModelConfigFor,
  ModelConfigRegistry,
  ModelRpt1,
  ModelRpt15,
  ModelRpt16,
  PredictResponse,
  TFMEnum
} from '@sap-ai-sdk/tabular-orchestration';

expectType<TFMEnum>({} as keyof ModelConfigRegistry);
expectType<keyof ModelConfigRegistry>({} as TFMEnum);

expectType<ModelRpt1>({} as ModelConfigFor<'sap-rpt-1-small'>);
expectType<ModelRpt1>({} as ModelConfigFor<'sap-rpt-1-large'>);
expectType<ModelRpt15>({} as ModelConfigFor<'sap-rpt-1.5'>);
expectType<ModelRpt15>({} as ModelConfigFor<'sap-rpt-1.5-large'>);
expectType<ModelRpt16>({} as ModelConfigFor<'sap-rpt-1.6'>);
expectType<ModelRpt16>({} as ModelConfigFor<'sap-rpt-1.6-large'>);

const client = new TabularOrchestrationClient();

expectType<Promise<PredictResponse>>(
  client.predict({
    modelName: 'sap-rpt-1.6',
    scenarioConfigName: 'product-prediction-scenario',
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    modelConfig: {
      prediction_config: { context_mode: 'deep' }
    },
    rows: [{ category: '[PREDICT]' }]
  })
);

expectError(
  client.predict({
    modelName: 'sap-rpt-1.6',
    scenarioConfigName: 'product-prediction-scenario',
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    modelConfig: { parse_data_types: 'false' },
    rows: [{ category: '[PREDICT]' }]
  })
);
