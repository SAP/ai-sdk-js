/* eslint-disable no-console */
import * as path from 'path';
import * as fs from 'node:fs';
import * as parquet from '@dsnp/parquetjs';

const schema = new parquet.ParquetSchema({
  customer_id:    { type: 'UTF8' },
  amount:         { type: 'DOUBLE' },
  due_date:       { type: 'TIMESTAMP_MILLIS' },
  payment_status: { type: 'UTF8' }
});

const dummyData = [
  {
    customer_id: 'CUST-1001',
    amount: 150.50,
    due_date: new Date('2026-05-01'),
    payment_status: 'Paid'
  },
  {
    customer_id: 'CUST-1002',
    amount: 2400.00,
    due_date: new Date('2026-06-15'),
    payment_status: 'Pending'
  },
  {
    customer_id: 'CUST-1003',
    amount: 45.15,
    due_date: new Date('2026-04-20'),
    payment_status: 'Overdue'
  },
  {
    customer_id: 'CUST-1004',
    amount: 899.99,
    due_date: new Date('2026-07-01'),
    payment_status: 'Pending'
  },
  {
    customer_id: 'CUST-1005',
    amount: 0.00,
    due_date: new Date('2026-05-19'),
    payment_status: 'Cancelled'
  }
];

async function generateParquetFile() {
  const generatedDir = path.join(import.meta.dirname, 'generated');
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir);
  }

  const outputPath = path.join(generatedDir, 'payments.parquet');

  const writer = await parquet.ParquetWriter.openFile(schema, outputPath);

  for (const row of dummyData) {
    await writer.appendRow(row);
  }

  await writer.close();
  console.log(`Successfully generated Parquet file at: ${outputPath}`);
}

generateParquetFile().catch(console.error);
