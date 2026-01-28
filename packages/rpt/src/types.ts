import type { Xor } from '@sap-cloud-sdk/util';
import type { ColumnType, SchemaFieldConfig } from './client/rpt/index.js';

/**
 * Represents a string literal type that includes all column names from the data schema.
 * If no data schema is given, the type is string.
 * @template T - Type of the data schema.
 */
type ColNames<T extends DataSchema> = T extends readonly any[]
  ? T[number]['name']
  : string;

/**
 * Represents a date string in the format YYYY-MM-DD.
 */
export type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

/**
 * Maps the type from the spec ('numeric', 'string', 'date') to a TypeScript type.
 * @template T - Type of the data schema.
 */
type TsType<T extends ColumnType> = T extends 'numeric'
  ? number
  : T extends 'date'
    ? DateString
    : string;

/**
 * Represents the type of the `rows` property.
 * It is an object that maps the known column names to values.
 * If no data schema is given, it maps string to values.
 * @template T - Type of the data schema.
 */
type RowType<T extends DataSchema> = T extends readonly any[]
  ? {
      [N in T[number]['name']]: TsType<
        Extract<T[number], { name: N }>['dtype']
      >;
    }
  : Record<string, string | number>;

/**
 * Represents the type of the `columns` property.
 * It is an object that maps the known column names to a list of values.
 * If no data schema is given, it maps string to a list of values.
 * @template T - Type of the data schema.
 */
type ColType<T extends DataSchema> = {
  [P in keyof RowType<T>]: RowType<T>[P][];
};

//
// This could be simplified, if `TargetColumnConfig` in the spec would set `additionalProperties` to `false`.
// Then it could be replaced with:.
// ```
// type PredictionConfig<T extends DataSchema> = {target_columns: (Omit<TargetColumnConfig, 'name'> & {name: ColNames<T>;})[]}
// ```
//

/**
 * Represents the type of the `prediction_config` property.
 * @template T - Type of the data schema.
 */
interface PredictionConfig<T extends DataSchema> {
  target_columns: {
    /**
     * The name of the target column.
     */
    name: ColNames<T>;
    /**
     * The placeholder value in any column for which to predict a value. The model will predict a value for all table cells containing this value.
     */
    prediction_placeholder: string | number;
    /**
     * The type of prediction task for this column. If not provided, the model will infer the task type from the data.
     */
    task_type?: 'classification' | 'regression' | any;
    /**
     * How many predictions to output per classification column.If not provided, only a single prediction is returned. Only relevant for classification.
     */
    top_k?: number | any;
  }[];
}

/**
 * Representation of a schema defining the data types of each column.
 * This type should never be used directly, it is only used for generic type inference.
 * @internal
 */
export type DataSchema =
  | readonly ({ name: string } & SchemaFieldConfig)[]
  | null;

/**
 * Representation of all data needed for prediction.
 * @template T - Type of the data schema.
 */
export type PredictionData<T extends DataSchema> = {
  prediction_config: PredictionConfig<T>;
  /**
   * The name of the index column. If provided, the service will return this column's value in each prediction object to facilitate aligning the output predictions with the input rows on the client side. If not provided, the column will not be included in the output.
   */
  index_column?: ColNames<T>;
  /**
   * Whether to parse the data types of the columns. If set to True, numeric columns will be parsed to float or integer and dates in ISO format YYYY-MM-DD will be parsed.
   * Default: true.
   */
  parse_data_types?: boolean;
} & Xor<
  {
    /**
     * Table rows, i.e. list of objects where each object is a mapping of column names to values. Either "rows" or "columns" must be provided.
     */
    rows: RowType<T>[];
  },
  {
    /**
     * Alternative to rows: columns of data where each key is a column name and the value is a list of all column values. Either "rows" or "columns" must be provided.
     */
    columns: ColType<T>;
  }
>;
