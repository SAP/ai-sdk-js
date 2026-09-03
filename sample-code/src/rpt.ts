import { openAsBlob } from 'node:fs';
import { join } from 'node:path';

import { RptClient } from '@sap-ai-sdk/rpt';
import { resilience } from '@sap-cloud-sdk/resilience';

import type { PredictResponsePayload, PredictionData } from '@sap-ai-sdk/rpt';

const schema = [
  { name: 'PRODUCT_ID', dtype: 'uuid' },
  { name: 'PRODUCT', dtype: 'string' },
  { name: 'PRICE', dtype: 'double' },
  { name: 'IN_STOCK', dtype: 'boolean' },
  { name: 'LAST_UPDATED', dtype: 'datetime' },
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
      PRODUCT_ID: '550e8400-e29b-41d4-a716-446655440000',
      PRODUCT: 'Laptop',
      PRICE: 999.99,
      IN_STOCK: true,
      LAST_UPDATED: '2025-01-15T10:30:00',
      __row_idx__: '35',
      SALESGROUP: '[PREDICT]'
    },
    {
      PRODUCT_ID: '550e8400-e29b-41d4-a716-446655440001',
      PRODUCT: 'Office Chair',
      PRICE: 142.99,
      IN_STOCK: true,
      LAST_UPDATED: '2025-07-13T14:00:00',
      __row_idx__: '571',
      SALESGROUP: '[PREDICT]'
    },
    {
      PRODUCT_ID: '550e8400-e29b-41d4-a716-446655440002',
      PRODUCT: 'Desktop Computer',
      PRICE: 921.5,
      IN_STOCK: false,
      LAST_UPDATED: '2024-12-02T08:00:00',
      __row_idx__: '42',
      SALESGROUP: 'Electronics'
    },
    {
      PRODUCT_ID: '550e8400-e29b-41d4-a716-446655440003',
      PRODUCT: 'MacBook',
      PRICE: 1220.99,
      IN_STOCK: true,
      LAST_UPDATED: '2026-01-31T09:15:00',
      __row_idx__: '99',
      SALESGROUP: 'Electronics'
    },
    {
      PRODUCT_ID: '550e8400-e29b-41d4-a716-446655440004',
      PRODUCT: 'Office Desk',
      PRICE: 750.5,
      IN_STOCK: false,
      LAST_UPDATED: '2024-12-05T11:45:00',
      __row_idx__: '689',
      SALESGROUP: 'Furniture'
    }
  ]
};

/**
 * Predict the sales group of products by passing a schema.
 * @returns The prediction results.
 */
export async function predictWithSchema(): Promise<PredictResponsePayload> {
  const client = new RptClient('sap-rpt-1.5');
  return client.predictWithSchema(schema, data);
}

/**
 * Predict the sales group of products with gzip compression.
 * @returns The prediction results.
 */
export async function predictWithSchemaCompressed(): Promise<PredictResponsePayload> {
  const client = new RptClient('sap-rpt-1.5');
  return client.predictWithSchema(schema, data, {
    compress: {
      mode: 'always' // force-enable compression
    }
  });
}

/**
 * Predict the sales group of products using automatic data type parsing.
 * @returns The prediction results.
 */
export async function predictAutomaticParsing(): Promise<PredictResponsePayload> {
  const client = new RptClient('sap-rpt-1.5');
  return client.predictWithoutSchema(data);
}

const parquetFilePath = join(
  import.meta.dirname,
  '../resources/product_data.parquet'
);

/**
 * Predict the sales group of products by passing a Parquet file with filename (`File`).
 * @returns The prediction results.
 */
export async function predictParquetFile(): Promise<PredictResponsePayload> {
  const parquetFileBlob = await openAsBlob(parquetFilePath, {
    type: 'application/vnd.apache.parquet'
  });
  // Create a File with a filename that will be forwarded to the RPT service
  const parquetFile = new File([parquetFileBlob], 'product_data.parquet', {
    type: 'application/vnd.apache.parquet'
  });
  // Send the Parquet file to the RPT service for predictions
  const client = new RptClient('sap-rpt-1.5');
  return client.predictParquet({
    file: parquetFile,
    prediction_config: data.prediction_config,
    index_column: data.index_column,
    parse_data_types: false
  });
}

/**
 * Predict the sales group of products by passing a Parquet file without a filename (`Blob`).
 * @returns The prediction results.
 */
export async function predictParquetBlob(): Promise<PredictResponsePayload> {
  const parquetFileBlob = await openAsBlob(parquetFilePath, {
    type: 'application/vnd.apache.parquet'
  });
  // Send the Parquet blob to the RPT service for predictions
  const client = new RptClient('sap-rpt-1.5');
  return client.predictParquet({
    file: parquetFileBlob,
    prediction_config: data.prediction_config,
    index_column: data.index_column,
    parse_data_types: false
  });
}

/**
 * Predict the sales group of products using resilience middleware.
 * Configures a 30-second timeout, circuit breaker, and one retry attempt.
 * @returns The prediction results.
 */
export async function predictWithSchemaResilient(): Promise<PredictResponsePayload> {
  const client = new RptClient('sap-rpt-1.5');
  return client.predictWithSchema(schema, data, {
    middleware: resilience({ timeout: 30000, circuitBreaker: true, retry: 1 })
  });
}

const columnarData: PredictionData<typeof schema> = {
  prediction_config: {
    target_columns: [
      { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
    ]
  },
  index_column: '__row_idx__',
  columns: {
    PRODUCT_ID: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002'
    ],
    PRODUCT: ['Laptop', 'Office Chair', 'Desktop Computer'],
    PRICE: [999.99, 142.99, 921.5],
    IN_STOCK: [true, true, false],
    LAST_UPDATED: [
      '2025-01-15T10:30:00',
      '2025-07-13T14:00:00',
      '2024-12-02T08:00:00'
    ],
    __row_idx__: ['35', '571', '42'],
    SALESGROUP: ['[PREDICT]', '[PREDICT]', 'Electronics']
  }
};

/**
 * Predict the sales group of products using the columnar data format.
 * @returns The prediction results.
 */
export async function predictColumnarFormat(): Promise<PredictResponsePayload> {
  const client = new RptClient('sap-rpt-1.5');
  return client.predictWithSchema(schema, columnarData);
}

/**
 * Predict the sales group of products with explainability.
 * Returns column importance scores and relevant context rows per query row.
 * @returns The prediction results including explanation data.
 */
export async function predictWithExplanations(): Promise<PredictResponsePayload> {
  const client = new RptClient('sap-rpt-1.5');
  return client.predictWithSchema(schema, {
    ...data,
    prediction_config: {
      target_columns: [
        { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
      ],
      explanations: {
        top_column_scores: 3,
        top_relevant_context_rows: 2
      }
    }
  });
}

/**
 * Predict the sales group of products returning the top 3 predictions per row.
 * Setting `top_k` on a classification target column returns multiple ranked predictions instead of a single one.
 * @returns The prediction results including the top K predictions per row.
 */
export async function predictWithTopK(): Promise<PredictResponsePayload> {
  const client = new RptClient('sap-rpt-1.5');
  return client.predictWithSchema(schema, {
    ...data,
    prediction_config: {
      target_columns: [
        {
          name: 'SALESGROUP',
          prediction_placeholder: '[PREDICT]',
          top_k: 3
        }
      ]
    }
  });
}

const regressionSchema = [
  { name: 'PRODUCT', dtype: 'string' },
  { name: 'PRODUCTION_DATE', dtype: 'date' },
  { name: '__row_idx__', dtype: 'string' },
  { name: 'SALESGROUP', dtype: 'string' },
  { name: 'PRICE', dtype: 'numeric' }
] as const;

const regressionData: PredictionData<typeof regressionSchema> = {
  prediction_config: {
    target_columns: [
      {
        name: 'PRICE',
        prediction_placeholder: -1,
        task_type: 'regression'
      }
    ]
  },
  index_column: '__row_idx__',
  rows: [
    {
      PRODUCT: 'Laptop',
      PRODUCTION_DATE: '2025-01-15',
      __row_idx__: '35',
      SALESGROUP: 'Electronics',
      PRICE: -1
    },
    {
      PRODUCT: 'Office Chair',
      PRODUCTION_DATE: '2025-07-13',
      __row_idx__: '571',
      SALESGROUP: 'Furniture',
      PRICE: -1
    },
    {
      PRODUCT: 'Desktop Computer',
      PRODUCTION_DATE: '2024-12-02',
      __row_idx__: '42',
      SALESGROUP: 'Electronics',
      PRICE: 921.5
    }
  ]
};

/**
 * Predict the price of products using regression with confidence intervals.
 * The response includes a `confidence_interval` field with lower and upper bounds per prediction.
 * @returns The prediction results including confidence intervals.
 */
export async function predictRegressionWithConfidenceIntervals(): Promise<PredictResponsePayload> {
  const client = new RptClient('sap-rpt-1.5');
  return client.predictWithSchema(regressionSchema, regressionData);
}
