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
import type { ColumnSource } from 'hyparquet-writer';
import type {
  ColumnType,
  SchemaFieldConfig
} from '@sap-ai-sdk/rpt/internal.js';
import type { RowType } from '@sap-ai-sdk/rpt';

type DataSchema = readonly ({ name: string } & SchemaFieldConfig)[];

const rptToParquetType: Record<ColumnType, ColumnSource['type']> = {
  string: 'STRING',
  numeric: 'DOUBLE',
  date: 'STRING'
};

/**
 * Converts an array of row objects into the column-oriented format expected by {@link parquetWriteFile}.
 * @param rows - The row data to write.
 * @param schema - Column definitions describing the name and parquet type of each column.
 * @returns Column data in the format expected by {@link parquetWriteFile}.
 */
function rowsToColumnData<T extends DataSchema>(
  rows: RowType<T>[],
  schema: T
): ColumnSource[] {
  return schema.map(({ name, dtype }) => ({
    name,
    data: rows.map(r => r[name as keyof RowType<T>]),
    type: rptToParquetType[dtype]
  }));
}

/**
 * Writes an array of row objects to a parquet file.
 * @param filename - Absolute path of the output file.
 * @param rows - The row data to write.
 * @param schema - Column definitions describing the name and parquet type of each column.
 */
export function writeRowsToParquet<T extends DataSchema>(
  filename: string,
  rows: RowType<T>[],
  schema: T
): void {
  parquetWriteFile({ filename, columnData: rowsToColumnData(rows, schema) });
}

// ----- Data -----

const predictSchema = [
  { name: 'PRODUCT', dtype: 'string' },
  { name: 'PRICE', dtype: 'numeric' },
  { name: 'PRODUCTION_DATE', dtype: 'date' },
  { name: '__row_idx__', dtype: 'string' },
  { name: 'SALESGROUP', dtype: 'string' }
] as const satisfies DataSchema;

const predictRows: RowType<typeof predictSchema>[] = [
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

const regularRows: RowType<typeof predictSchema>[] = [
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

// ----- Script entry point -----
function run(): void {
  const includePredictRows = !process.argv.includes('--no-predict');
  const data = includePredictRows
    ? [...predictRows, ...regularRows]
    : regularRows;
  const filename = includePredictRows
    ? 'product_data.parquet'
    : 'product_data_no_predict.parquet';

  const outputPath = join(import.meta.dirname, filename);

  writeRowsToParquet(outputPath, data, predictSchema);

  console.log(
    `Successfully exported ${data.length} rows to ${outputPath}${includePredictRows ? ' (including [PREDICT] rows)' : ' (excluding [PREDICT] rows)'}`
  );
}

run();
