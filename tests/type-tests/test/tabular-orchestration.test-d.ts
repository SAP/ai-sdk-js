import { TabularOrchestrationClient } from '@sap-ai-sdk/tabular-orchestration';

import { expectError, expectType } from 'tsd';

import type {
  PredictRequest,
  PredictResponse
} from '@sap-ai-sdk/tabular-orchestration';

const client = new TabularOrchestrationClient();

const commonRequest = {
  modelName: 'sap-rpt-1.5' as const,
  scenarioConfigName: 'product-prediction-scenario'
};

const typedRequest: PredictRequest<
  'custom-model',
  { customParameter: boolean }
> = {
  ...commonRequest,
  modelName: 'custom-model',
  predictionConfig: { targetColumns: [{ name: 'category' }] },
  modelConfig: { customParameter: true },
  rows: [{ category: '[PREDICT]' }]
};

expectType<Promise<PredictResponse>>(
  client.predict<'custom-model', { customParameter: boolean }>(typedRequest)
);

expectType<Promise<PredictResponse>>(
  client.predict({
    ...commonRequest,
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    rows: [{ category: '[PREDICT]' }]
  })
);

expectType<Promise<PredictResponse>>(
  client.predict({
    ...commonRequest,
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    modelConfig: {
      index_column: 'requisition_id',
      parse_data_types: false,
      data_schema: {
        category: { dtype: 'string' }
      },
      prediction_config: {},
      extra_param: 123
    },
    rows: [{ category: '[PREDICT]' }]
  })
);

expectError(
  client.predict({
    ...commonRequest,
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    modelConfig: { parse_data_types: 'false' },
    rows: [{ category: '[PREDICT]' }]
  })
);

expectType<Promise<PredictResponse>>(
  client.predict({
    ...commonRequest,
    modelName: 'unknown-model',
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    modelConfig: { customParameter: true },
    rows: [{ category: '[PREDICT]' }]
  })
);
expectType<Promise<PredictResponse>>(
  client.predict({
    ...commonRequest,
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    columns: { category: ['[PREDICT]'] }
  })
);

expectError(
  client.predict({
    ...commonRequest,
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    rows: [{ category: '[PREDICT]' }],
    columns: { category: ['[PREDICT]'] }
  })
);

expectError(
  client.predict({
    ...commonRequest,
    predictionConfig: { targetColumns: [{ name: 'category' }] }
  })
);

expectError(
  client.predict({
    ...commonRequest,
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    rows: [{ category: '[PREDICT]' }],
    contextColumns: { category: ['context'] }
  })
);

expectError(
  client.predict({
    ...commonRequest,
    predictionConfig: { targetColumns: [{ name: 'category' }] },
    columns: { category: ['[PREDICT]'] },
    contextRows: [{ category: 'context' }]
  })
);
