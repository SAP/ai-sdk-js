#!/usr/bin/env node
/**
 * This script generates parquet files containing product data.
 *
 * RPT format (simple, type-inferred):
 *   node generate-parquet.ts                    // Include [PREDICT] rows
 *   node generate-parquet.ts --no-predict       // Exclude [PREDICT] rows
 *
 * CDS/HANA format (explicit Parquet schema, DECIMAL and DATE encoded for HANA):
 *   node generate-parquet.ts --cds              // CDS-typed output for tabular artifacts
 */
/* oxlint-disable no-console */

import { join } from 'node:path';

import { parquetWriteFile } from 'hyparquet-writer';

import type {
  ColumnType,
  SchemaFieldConfig
} from '@sap-ai-sdk/rpt/internal.js';

import type { ColumnSource, SchemaElement } from 'hyparquet-writer';

// ----- RPT schema types -----

type DataSchema = readonly ({ name: string } & SchemaFieldConfig)[];

const rptToParquetType: Record<ColumnType, ColumnSource['type']> = {
  string: 'STRING',
  numeric: 'DOUBLE',
  date: 'STRING'
};

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
 * Writes an array of row objects to a parquet file using RPT column types.
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

// ----- CDS schema types (for HANA-compatible tabular artifacts) -----

type CdsField =
  | { name: string; type: 'cds.String'; length?: number }
  | { name: string; type: 'cds.Decimal'; precision: number; scale: number }
  | { name: string; type: 'cds.Date' };

type CdsSchema = readonly CdsField[];

type CdsValue<T extends CdsField> = T extends { type: 'cds.Decimal' }
  ? number
  : string;

type CdsRow<T extends CdsSchema> = {
  [Field in T[number] as Field['name']]: CdsValue<Field>;
};

function cdsFieldToParquetSchema(field: CdsField): SchemaElement {
  const common = { name: field.name, repetition_type: 'REQUIRED' as const };
  switch (field.type) {
    case 'cds.String':
      return { ...common, type: 'BYTE_ARRAY', converted_type: 'UTF8' };
    case 'cds.Decimal':
      return {
        ...common,
        type: 'INT64',
        converted_type: 'DECIMAL',
        precision: field.precision,
        scale: field.scale
      };
    case 'cds.Date':
      return { ...common, type: 'INT32', converted_type: 'DATE' };
  }
}

function encodeCdsValue(
  value: CdsValue<CdsField>,
  field: CdsField
): string | number | Date {
  switch (field.type) {
    case 'cds.String':
      return value;
    case 'cds.Decimal':
      return Number(value);
    case 'cds.Date':
      return new Date(`${value}T00:00:00Z`);
  }
}

/**
 * Writes an array of CDS-typed row objects to a parquet file with an explicit schema.
 * Produces HANA-compatible output suitable for tabular artifacts in the context-registry.
 * @param filename - Absolute path of the output file.
 * @param rows - The row data to write.
 * @param schema - CDS column definitions.
 */
export function writeCdsRowsToParquet<T extends CdsSchema>(
  filename: string,
  rows: readonly CdsRow<T>[],
  schema: T
): void {
  parquetWriteFile({
    filename,
    columnData: schema.map(field => ({
      name: field.name,
      data: rows.map(row =>
        encodeCdsValue(
          row[field.name as keyof CdsRow<T>] as CdsValue<CdsField>,
          field
        )
      )
    })),
    schema: [
      { name: 'root', num_children: schema.length },
      ...schema.map(cdsFieldToParquetSchema)
    ]
  });
}

// ----- Data -----

const rptSchema = [
  { name: 'PRODUCT', dtype: 'string' },
  { name: 'PRICE', dtype: 'numeric' },
  { name: 'PRODUCTION_DATE', dtype: 'date' },
  { name: '__row_idx__', dtype: 'string' },
  { name: 'SALESGROUP', dtype: 'string' }
] as const satisfies DataSchema;

const cdsSchema = [
  { name: 'PRODUCT', type: 'cds.String', length: 100 },
  { name: 'PRICE', type: 'cds.Decimal', precision: 15, scale: 2 },
  { name: 'PRODUCTION_DATE', type: 'cds.Date' },
  { name: '__row_idx__', type: 'cds.String', length: 100 },
  { name: 'SALESGROUP', type: 'cds.String', length: 100 }
] as const satisfies CdsSchema;

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

// ----- Script entry point -----

function run(): void {
  const useCds = process.argv.includes('--cds');
  const includePredictRows = !process.argv.includes('--no-predict');
  const data = includePredictRows
    ? [...predictRows, ...regularRows]
    : regularRows;
  const suffix = includePredictRows ? '' : '_no_predict';

  if (useCds) {
    const filename = join(
      import.meta.dirname,
      `product_data_hana${suffix}.parquet`
    );
    writeCdsRowsToParquet(filename, data, cdsSchema);
    console.log(
      `Successfully exported ${data.length} rows (CDS/HANA format) to ${filename}`
    );
  } else {
    const filename = join(import.meta.dirname, `product_data${suffix}.parquet`);
    writeRowsToParquet(
      filename,
      data as RowType<typeof rptSchema>[],
      rptSchema
    );
    console.log(
      `Successfully exported ${data.length} rows (RPT format) to ${filename}`
    );
  }
}

run();
