import { RptApi } from '@sap-ai-sdk/rpt';
import type { PredictResponsePayload } from '@sap-ai-sdk/rpt';

/**
 * Predict the sales group of products.
 * @returns The prediction results.
 */
export async function predict(): Promise<PredictResponsePayload> {
  return (
    RptApi.predict({
      prediction_config: {
        // this is how it is in the type and docs, but doesn't work
        // target_columns: [{ name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }]

        // this works, but breaks the type
        target_columns: [
          { name: 'SALESGROUP', placeholder_value: '[PREDICT]' } as any
        ]
      },
      index_column: '__row_idx__',
      data_schema: {
        PRODUCT: {
          dtype: 'text'
        },
        PRICE: {
          dtype: 'number'
        },
        CUSTOMER: {
          dtype: 'text'
        },
        COUNTRY: {
          dtype: 'text'
        },
        __row_idx__: {
          dtype: 'text'
        },
        SALESGROUP: {
          dtype: 'text'
        }
      },
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
    })
      // TODO: I assume this should be done differently
      .setBasePath('/inference/deployments/d1dad0c7fd1b1ce9')
      .execute()
  );
}
