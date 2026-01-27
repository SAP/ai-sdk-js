import { RptClient } from '@sap-ai-sdk/rpt';
import type { PredictResponsePayload, PredictionData } from '@sap-ai-sdk/rpt';

const schema = [
  { name: 'PRODUCT', dtype: 'string' },
  { name: 'PRICE', dtype: 'numeric' },
  { name: 'PRODUCTION_DATE', dtype: 'date' },
  { name: '__row_idx__', dtype: 'string' },
  { name: 'SALESGROUP', dtype: 'string' }
] as const;

const data: PredictionData<typeof schema> = {
  prediction_config: {
    target_columns: [
      { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
    ]
  },
  index_column: '__row_idx__',
  rows: [
    {
      PRODUCT: 'Laptop',
      PRICE: 999.99,
      PRODUCTION_DATE: '2025-01-15',
      __row_idx__: '35',
      SALESGROUP: '[PREDICT]'
    },
    {
      PRODUCT: 'Office chair',
      PRICE: 142.99,
      PRODUCTION_DATE: '2025-07-13',
      __row_idx__: '571',
      SALESGROUP: '[PREDICT]'
    },
    {
      PRODUCT: 'Desktop Computer',
      PRICE: 750.5,
      PRODUCTION_DATE: '2024-12-02',
      __row_idx__: '42',
      SALESGROUP: 'Enterprise Solutions'
    },
    {
      PRODUCT: 'Macbook',
      PRICE: 750.5,
      PRODUCTION_DATE: '2026-01-31',
      __row_idx__: '99',
      SALESGROUP: 'Enterprise Solutions'
    },
    {
      PRODUCT: 'Chromebook',
      PRICE: 750.5,
      PRODUCTION_DATE: '2024-12-05',
      __row_idx__: '689',
      SALESGROUP: 'Enterprise Solutions'
    }
  ]
};

/**
 * Predict the sales group of products by passing a schema.
 * @returns The prediction results.
 */
export async function predictWithSchema(): Promise<PredictResponsePayload> {
  const client = new RptClient();
  return client.predictWithSchema(schema, data);
}

/**
 * Predict the sales group of products using automatic data type parsing.
 * @returns The prediction results.
 */
export async function predictAutomaticParsing(): Promise<PredictResponsePayload> {
  const client = new RptClient();
  return client.predictWithoutSchema(data);
}
