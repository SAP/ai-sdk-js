import type {
  ColumnType as RptColumnType,
  RptModelConfig,
  RowType as RptRowType
} from '@sap-ai-sdk/rpt';

import type {
  ContextSelectionConfig,
  PredictionConfig,
  PredictResponse
} from './client/tabular-orchestration/schema/index.ts';

type TabularInput =
  | {
      /**
       * Query-only rows in row form, together with optional context rows.
       */
      rows: RptRowType<null>[];
      contextRows?: RptRowType<null>[];
      columns?: never;
      contextColumns?: never;
    }
  | {
      /**
       * Query-only rows in columnar form, together with optional context columns.
       */
      columns: RptColumnType<null>;
      contextColumns?: RptColumnType<null>;
      rows?: never;
      contextRows?: never;
    };

/**
 * Registry of model-specific configuration types, keyed by model name.
 *
 * This interface can be extended through declaration merging.
 */
export interface ModelConfigRegistry {
  'sap-rpt-1-small': RptModelConfig;
  'sap-rpt-1-large': RptModelConfig;
  'sap-rpt-1.5': RptModelConfig;
  'sap-rpt-1.5-large': RptModelConfig;
}

/**
 * Model configuration type registered for a model name.
 *
 * Unknown model names accept an open configuration object.
 * @typeParam ModelName - The model name type.
 */
export type ModelConfigFor<ModelName extends string> =
  ModelName extends keyof ModelConfigRegistry
    ? ModelConfigRegistry[ModelName]
    : Record<string, unknown>;

/**
 * Request for a prediction through the Tabular Orchestration service.
 *
 * Known model names select their registered `modelConfig` type. Unknown models
 * accept an open configuration object, or a specific type can be supplied.
 *
 * @typeParam ModelName - The model name type.
 * @typeParam ModelConfig - The model-specific configuration type. Defaults to
 * the configuration registered for `ModelName`.
 */
export type TabularOrchestrationPredictRequest<
  ModelName extends string = string,
  ModelConfig extends object = ModelConfigFor<ModelName>
> = {
  /**
   * Name of the deployed Tabular Foundation Model.
   */
  modelName: ModelName;
  /**
   * Scenario configuration identifier.
   */
  scenarioConfigName: string;
  contextSelectionConfig?: ContextSelectionConfig;
  predictionConfig: PredictionConfig;
  modelConfig?: ModelConfig;
} & TabularInput;

/**
 * Response returned by the Tabular Orchestration prediction endpoint.
 */
export type TabularOrchestrationPredictResponse = PredictResponse;
