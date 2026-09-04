import { RptClient } from '@sap-ai-sdk/rpt';

import { expectError, expectType } from 'tsd';

import type {
  DateString,
  PredictResponsePayload,
  RowType,
  TimeString
} from '@sap-ai-sdk/rpt';

/**
 * Prediction with schema.
 */
expectType<Promise<PredictResponsePayload>>(
  new RptClient('sap-rpt-1.5').predictWithSchema(
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
  new RptClient('sap-rpt-1.5').predictWithoutSchema({
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
  new RptClient('sap-rpt-1.5').predictWithSchema(
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

/**
 * Prediction with null prediction_placeholder for regression.
 */
expectType<Promise<PredictResponsePayload>>(
  new RptClient('sap-rpt-1.5').predictWithSchema(
    [
      { name: 'PRICE', dtype: 'numeric' },
      { name: '__row_idx__', dtype: 'string' }
    ],
    {
      prediction_config: {
        target_columns: [{ name: 'PRICE', prediction_placeholder: null }]
      },
      index_column: '__row_idx__',
      rows: [{ PRICE: 25.0, __row_idx__: '1' }]
    }
  )
);

/**
 * Prediction with explanation config.
 */
expectType<Promise<PredictResponsePayload>>(
  new RptClient('sap-rpt-1.5').predictWithSchema(
    [
      { name: 'SALESGROUP', dtype: 'string' },
      { name: '__row_idx__', dtype: 'string' }
    ],
    {
      prediction_config: {
        target_columns: [
          { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
        ],
        explanations: { top_column_scores: 5, top_relevant_context_rows: 3 }
      },
      index_column: '__row_idx__',
      rows: [{ SALESGROUP: '[PREDICT]', __row_idx__: '1' }]
    }
  )
);
