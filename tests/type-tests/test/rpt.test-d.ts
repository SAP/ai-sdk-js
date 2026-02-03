import { expectError, expectType } from 'tsd';
import { RptClient } from '@sap-ai-sdk/rpt';
import type { PredictResponsePayload } from '@sap-ai-sdk/rpt';

/**
 * Prediction with schema.
 */
expectType<Promise<PredictResponsePayload>>(
  new RptClient().predictWithSchema(
    [
      { name: 'PRODUCT', dtype: 'string' },
      { name: '__row_idx__', dtype: 'string' },
      { name: 'SALESGROUP', dtype: 'string' }
    ],
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
 * Prediction without schema.
 */
expectType<Promise<PredictResponsePayload>>(
  new RptClient().predictWithoutSchema({
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
 * Prediction with schema and incorrect prediction config.
 */
expectError(
  new RptClient().predictWithSchema(
    [
      { name: 'PRODUCT', dtype: 'string' },
      { name: 'ID', dtype: 'string' },
      { name: 'SALESGROUP', dtype: 'string' }
    ],
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
