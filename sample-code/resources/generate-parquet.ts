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

type ColumnType = ColumnSource['type'];
type RowData = Record<string, unknown>;

interface ColumnSchema<T extends RowData> {
  name: keyof T & string;
  type: ColumnType;
}

/**
 * Converts an array of row objects into the column-oriented format expected by {@link parquetWriteFile}.
 * @param rows - The row data to write.
 * @param schema - Column definitions describing the name and parquet type of each column.
 * @returns Column data in the format expected by {@link parquetWriteFile}.
 */
function rowsToColumnData<T extends RowData>(
  rows: T[],
  schema: ColumnSchema<T>[]
): ColumnSource[] {
  return schema.map(({ name, type }) => ({
    name,
    data: rows.map(r => r[name]),
    type
  }));
}

/**
 * Writes an array of row objects to a parquet file.
 * @param filename - Absolute path of the output file.
 * @param rows - The row data to write.
 * @param schema - Column definitions describing the name and parquet type of each column.
 */
export function writeRowsToParquet<T extends RowData>(
  filename: string,
  rows: T[],
  schema: ColumnSchema<T>[]
): void {
  parquetWriteFile({ filename, columnData: rowsToColumnData(rows, schema) });
}

// ----- Data -----

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ProductRow = {
  PRODUCT: string;
  PRICE: number;
  PRODUCTION_DATE: string;
  __row_idx__: string;
  SALESGROUP: string;
};

const predictSchema: ColumnSchema<ProductRow>[] = [
  { name: 'PRODUCT', type: 'STRING' },
  { name: 'PRICE', type: 'DOUBLE' },
  { name: 'PRODUCTION_DATE', type: 'STRING' },
  { name: '__row_idx__', type: 'STRING' },
  { name: 'SALESGROUP', type: 'STRING' }
];

const predictRows: ProductRow[] = [
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

const regularRows: ProductRow[] = [
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
