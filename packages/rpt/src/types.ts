/* eslint-disable jsdoc/require-jsdoc */
import type { Xor } from '@sap-cloud-sdk/util';
import type { PredictRequestPayload, ColumnType } from './client/rpt/index.js';

// The conditional type is needed to exclude number and symbol from the indexing type
type ColNames<T extends DataSchema> = keyof T extends string ? keyof T : never;
type TsType<T extends ColumnType> = T extends 'numeric' ? number : string;

type RowType<T extends DataSchema> = {
  [P in keyof T]: T[P] extends Record<'dtype', any>
    ? TsType<T[P]['dtype']>
    : never;
};

type ColType<T extends DataSchema> = {
  [P in keyof RowType<T>]: RowType<T>[P][];
};

interface TargetColumnConfig<T extends DataSchema> {
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
}

interface PredictionConfig<T extends DataSchema> {
  target_columns: TargetColumnConfig<T>[];
}

export type DataSchema = Pick<
  PredictRequestPayload,
  'data_schema'
>['data_schema'];

export type PredictionRequestPayload<T extends DataSchema> = {
  prediction_config: PredictionConfig<T>;
  index_column?: ColNames<T>;

  parse_data_types?: boolean;
} & Xor<
  { rows?: RowType<T>[] },
  {
    columns?: ColType<T>;
  }
>;
