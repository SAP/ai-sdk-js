import type { SchemaFieldConfig } from '@sap-ai-sdk/rpt/internal.js';

type DataSchema = readonly ({ name: string } & SchemaFieldConfig)[];

type CdsField =
  | { name: string; type: 'cds.String'; length?: number }
  | { name: string; type: 'cds.Decimal'; precision: number; scale: number }
  | { name: string; type: 'cds.Date' };

type CdsSchema = readonly CdsField[];

export const rptSchema = [
  { name: 'PRODUCT', dtype: 'string' },
  { name: 'PRICE', dtype: 'numeric' },
  { name: 'PRODUCTION_DATE', dtype: 'date' },
  { name: '__row_idx__', dtype: 'string' },
  { name: 'SALESGROUP', dtype: 'string' }
] as const satisfies DataSchema;

export const cdsSchema = [
  { name: 'PRODUCT', type: 'cds.String', length: 100 },
  { name: 'PRICE', type: 'cds.Decimal', precision: 15, scale: 2 },
  { name: 'PRODUCTION_DATE', type: 'cds.Date' },
  { name: '__row_idx__', type: 'cds.String', length: 100 },
  { name: 'SALESGROUP', type: 'cds.String', length: 100 }
] as const satisfies CdsSchema;

export const predictRows = [
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

export const regularRows = [
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
