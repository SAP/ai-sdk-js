import { expectError, expectType } from 'tsd';
import { RptClient } from '@sap-ai-sdk/rpt';
import type { PredictResponsePayload } from '@sap-ai-sdk/rpt';

/**
 * Prediction.
 */
expectType<Promise<PredictResponsePayload>>(
  new RptClient().predict({
    prediction_config: {
      target_columns: [
        { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
      ]
    },
    index_column: '__row_idx__',
    rows: [
      {
        PRODUCT: 'Laptop',
        __row_idx__: '35',
        SALESGROUP: '[PREDICT]'
      },
      {
        PRODUCT: 'Office chair',
        __row_idx__: '571',
        SALESGROUP: '[PREDICT]'
      }
    ]
  })
);

/**
 * Prediction with schema.
 */
expectType<Promise<PredictResponsePayload>>(
  new RptClient().predict(
    {
      PRODUCT: { dtype: 'string' },
      __row_idx__: { dtype: 'string' },
      SALESGROUP: { dtype: 'string' }
    },
    {
      prediction_config: {
        target_columns: [
          { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
        ]
      },
      index_column: '__row_idx__',
      rows: [
        {
          PRODUCT: 'Laptop',
          __row_idx__: '35',
          SALESGROUP: '[PREDICT]'
        },
        {
          PRODUCT: 'Office chair',
          __row_idx__: '571',
          SALESGROUP: '[PREDICT]'
        }
      ]
    }
  )
);

/**
 * Prediction with schema and incorrect prediction config.
 */
expectError(
  new RptClient().predict(
    {
      PRODUCT: { dtype: 'string' },
      ID: { dtype: 'string' },
      SALESGROUP: { dtype: 'string' }
    },
    {
      prediction_config: {
        target_columns: [
          { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
        ]
      },
      index_column: '__row_idx__',
      rows: [
        {
          PRODUCT: 'Laptop',
          __row_idx__: '35',
          SALESGROUP: '[PREDICT]'
        },
        {
          PRODUCT: 'Office chair',
          __row_idx__: '571',
          SALESGROUP: '[PREDICT]'
        }
      ]
    }
  )
);
