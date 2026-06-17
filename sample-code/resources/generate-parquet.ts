#!/usr/bin/env node
/**
 * This script generates a parquet file containing product data.
 * By default, the generated file includes cells with '[PREDICT]'-placeholders for prediction with SAP RPT.
 * Use the --no-predict flag to exclude rows with '[PREDICT]' placeholders.
 * @example
 * npx tsx generate-parquet.ts                    // Include all data (with [PREDICT] placeholders)
 * npx tsx generate-parquet.ts --no-predict       // Exclude rows with [PREDICT] placeholders
 */
/* eslint-disable no-console */

import { join } from 'node:path';
import { parquetWriteFile } from 'hyparquet-writer';

// Parse command line arguments
const includePredictRows = !process.argv.includes('--no-predict');

// Rows with [PREDICT] placeholders (for SAP RPT prediction)
const predictRows = [
  {
    PRODUCT: 'Laptop',
    PRICE: 999.99,
    PRODUCTION_DATE: '2025-01-15',
    __row_idx__: '35',
    SALESGROUP: '[PREDICT]'
  },
  {
    PRODUCT: 'Office Chair',
    PRICE: 142.99,
    PRODUCTION_DATE: '2025-07-13',
    __row_idx__: '571',
    SALESGROUP: '[PREDICT]'
  }
];

// Rows with actual SALESGROUP values
const regularRows = [
  {
    PRODUCT: 'Desktop Computer',
    PRICE: 921.5,
    PRODUCTION_DATE: '2024-12-02',
    __row_idx__: '42',
    SALESGROUP: 'Electronics'
  },
  {
    PRODUCT: 'Macbook',
    PRICE: 1220.99,
    PRODUCTION_DATE: '2026-01-31',
    __row_idx__: '99',
    SALESGROUP: 'Electronics'
  },
  {
    PRODUCT: 'Office Desk',
    PRICE: 750.5,
    PRODUCTION_DATE: '2024-12-05',
    __row_idx__: '689',
    SALESGROUP: 'Furniture'
  }
];

// Combine data based on flag
const rows = includePredictRows
  ? [...predictRows, ...regularRows]
  : regularRows;
const filename = includePredictRows
  ? 'product_data.parquet'
  : 'product_data_no_predict.parquet';

const outputPath = join(import.meta.dirname, filename);

parquetWriteFile({
  filename: outputPath,
  columnData: [
    { name: 'PRODUCT', data: rows.map(r => r.PRODUCT), type: 'STRING' },
    { name: 'PRICE', data: rows.map(r => r.PRICE), type: 'DOUBLE' },
    {
      name: 'PRODUCTION_DATE',
      data: rows.map(r => r.PRODUCTION_DATE),
      type: 'STRING'
    },
    { name: '__row_idx__', data: rows.map(r => r.__row_idx__), type: 'STRING' },
    { name: 'SALESGROUP', data: rows.map(r => r.SALESGROUP), type: 'STRING' }
  ]
});

console.log(
  `Successfully exported ${rows.length} rows to ${outputPath}${includePredictRows ? ' (including [PREDICT] rows)' : ' (excluding [PREDICT] rows)'}`
);
