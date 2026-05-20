/* eslint-disable no-console */
/**
 * This script generates a parquet file containing product data.
 * The parquet file is saved to 'sample-code/resources/product_data.parquet'.
 * By default, the generated file includes cells with '[PREDICT]'-placeholders for prediction with SAP RPT.
 * Use the --no-predict flag to exclude rows with '[PREDICT]' placeholders.
 * @example
 * npx tsx generate-parquet.ts                    // Include all data (with [PREDICT] placeholders)
 * npx tsx generate-parquet.ts --no-predict       // Exclude rows with [PREDICT] placeholders
 */
import * as path from 'path';
import * as parquet from '@dsnp/parquetjs';

// Parse command line arguments
const includePredictRows = !process.argv.includes('--no-predict');

const schema = new parquet.ParquetSchema({
  PRODUCT: { type: 'UTF8' },
  PRICE: { type: 'DOUBLE' },
  PRODUCTION_DATE: { type: 'UTF8' },
  __row_idx__: { type: 'UTF8' },
  SALESGROUP: { type: 'UTF8' }
});

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
    PRICE: 921.50,
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
const data = includePredictRows ? [...predictRows, ...regularRows] : regularRows;
const filename = includePredictRows ? 'product_data_with_placeholders.parquet' : 'product_data.parquet';

async function generateParquetFile() {
  const outputPath = path.join(import.meta.dirname, filename);

  const writer = await parquet.ParquetWriter.openFile(schema, outputPath);

  for (const row of data) {
    await writer.appendRow(row);
  }

  await writer.close();
  console.log(
    `Successfully exported ${data.length} rows to ${outputPath}${includePredictRows ? ' (including [PREDICT] rows)' : ' (excluding [PREDICT] rows)'}`
  );
}

generateParquetFile().catch(console.error);
