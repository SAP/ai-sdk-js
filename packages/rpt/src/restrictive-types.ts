import type {
  PredictRequestPayload,
  ColumnType,
  SchemaFieldConfig
} from './client/rpt/index.js';

const data = {
  prediction_config: {
    target_columns: [
      { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
    ]
  },
  index_column: '__row_idx__',
  data_schema: {
    PRODUCT: {
      dtype: 'string'
    },
    PRICE: {
      dtype: 'numeric'
    },
    CUSTOMER: {
      dtype: 'string'
    },
    COUNTRY: {
      dtype: 'string'
    },
    __row_idx__: {
      dtype: 'string'
    },
    SALESGROUP: {
      dtype: 'string'
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
};

const cols = getColNames(data);

type DataSchema<T /* extends PredictRequestPayload*/> = T extends {
  data_schema: any;
}
  ? ['data_schema']
  : never;

type TType<T extends ColumnType> = T extends 'numeric' ? number : string;
type DType<T extends SchemaFieldConfig> = T['dtype'];

type ColNames<T extends PayloadType> = keyof T['data_schema'];

type RowType<T extends PayloadType> = {
  [P in keyof T['data_schema']]: T['data_schema'][P] extends Record<
    'dtype',
    any
  >
    ? TType<T['data_schema'][P]['dtype']>
    : undefined;
};

type PayloadType = Omit<
  PredictRequestPayload,
  'rows' | 'prediction_config' | 'index_column'
>;

function predict<T extends PayloadType>(
  // d: RestrictivePredictRequestPayload<T>,
  d: T & {
    // prediction_config: {
    //   target_columns: (Omit<TargetColumnConfig, 'name'> & {
    //     name: ColNames<T>;
    //   })[];
    // };
    index_column: ColNames<T>;
    rows: RowType<T>[];
  },
  i: { index_column: ColNames<T> },
  // c: { colName: ColNames2<T> },
  r: { rows: RowType<T>[] }
) {}

const prediction = predict(
  {
    data_schema: {
      PRODUCT: {
        dtype: 'string'
      },
      ID: { dtype: 'numeric' }
    },
    index_column: 'ID',
    // prediction_config: { target_columns: [{ name: 'peter' }] },
    rows: [{ ID: 4, PRODUCT: 'sfhdj' }]
  },
  { index_column: 'ID' },
  // { colName: 'PRODUCT' },
  { rows: [{ PRODUCT: 'tre', ID: 43 }] }
);
type RestrictivePredictRequestPayload<T /* extends PredictRequestPayload*/> =
  Omit<T, 'rows'>;
// & {
//   rows: RowType<T>[];
// };

type T_DataSchema = DataSchema<typeof data>;
type T_ColNames = ColNames<typeof data>;
type T_RowType = RowType<typeof data>;
type T_RestrictivePredictRequestPayload = RestrictivePredictRequestPayload<
  typeof data
>;

function getColNames<T extends PredictRequestPayload>(d: T): ColNames<T>[] {
  return [];
}
