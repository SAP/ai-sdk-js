import { RptClient } from '@sap-ai-sdk/rpt';
import type { PredictResponsePayload } from '@sap-ai-sdk/rpt';

/**
 * NOTES:
 *
 * Error due to incorrect usage of `null` in the spec.
 * Currently the spec is adjusted manually.
 * I replaced all occurrences of `"type": "null"` with `"nullable": true`.
 * Asked colleagues to fix, otherwise we need to add a workaround to the generator.
 */

/**
 * Predict the sales group of products.
 * @returns The prediction results.
 */
export async function predict(): Promise<PredictResponsePayload> {
  const client = new RptClient();
  return client.predict(
    {
      PRODUCT: { dtype: 'string' },
      PRICE: { dtype: 'numeric' },
      CUSTOMER: { dtype: 'string' },
      COUNTRY: { dtype: 'string' },
      __row_idx__: { dtype: 'string' },
      SALESGROUP: { dtype: 'string' }
    },
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
          PRICE: 999.99,
          CUSTOMER: 'Acme Corp',
          COUNTRY: 'USA',
          __row_idx__: '35',
          SALESGROUP: '[PREDICT]'
        },
        {
          PRODUCT: 'Office chair',
          PRICE: 142.99,
          CUSTOMER: 'Möbel Boerner',
          COUNTRY: 'Germany',
          __row_idx__: '571',
          SALESGROUP: '[PREDICT]'
        },
        {
          PRODUCT: 'Desktop Computer',
          PRICE: 750.5,
          CUSTOMER: 'Global Tech',
          COUNTRY: 'Canada',
          __row_idx__: '42',
          SALESGROUP: 'Enterprise Solutions'
        },
        {
          PRODUCT: 'Macbook',
          PRICE: 750.5,
          CUSTOMER: 'Global Tech',
          COUNTRY: 'Canada',
          __row_idx__: '99',
          SALESGROUP: 'Enterprise Solutions'
        },
        {
          PRODUCT: 'Chromebook',
          PRICE: 750.5,
          CUSTOMER: 'Global Tech',
          COUNTRY: 'US',
          __row_idx__: '689',
          SALESGROUP: 'Enterprise Solutions'
        },
        {
          PRODUCT: 'Smartphone',
          PRICE: 499.99,
          CUSTOMER: 'Mobile World',
          COUNTRY: 'UK',
          __row_idx__: '43',
          SALESGROUP: 'Consumer Electronics'
        },
        {
          PRODUCT: 'Office Chair',
          PRICE: 150.8,
          CUSTOMER: 'Furniture Ltd',
          COUNTRY: 'Germany',
          __row_idx__: '44',
          SALESGROUP: 'Office Furniture'
        },
        {
          PRODUCT: 'Server Rack',
          PRICE: 1200,
          CUSTOMER: 'Data Dynamics',
          COUNTRY: 'Australia',
          __row_idx__: '104',
          SALESGROUP: 'Data Infrastructure'
        },
        {
          PRODUCT: 'Wireless Router',
          PRICE: 89.99,
          CUSTOMER: 'Tech Forward',
          COUNTRY: 'India',
          __row_idx__: '204',
          SALESGROUP: 'Networking Devices'
        }
      ]
    }
  );
}
