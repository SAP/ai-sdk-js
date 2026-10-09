import type {
  ModelRpt1,
  ModelRpt15,
  ModelRpt16,
  PredictRequest as GeneratedPredictRequest
} from './client/tabular-orchestration/index.ts';

/**
 * Model-specific configuration types keyed by Tabular Foundation Model name.
 */
export interface ModelConfigRegistry {
  'sap-rpt-1-small': ModelRpt1;
  'sap-rpt-1-large': ModelRpt1;
  'sap-rpt-1.5': ModelRpt15;
  'sap-rpt-1.5-large': ModelRpt15;
  'sap-rpt-1.6': ModelRpt16;
  'sap-rpt-1.6-large': ModelRpt16;
}

/**
 * Model configuration type for a Tabular Foundation Model.
 * @typeParam ModelName - Name of the Tabular Foundation Model.
 */
export type ModelConfigFor<ModelName extends keyof ModelConfigRegistry> =
  ModelConfigRegistry[ModelName];

/**
 * Request for a prediction through the Tabular AI Orchestration service.
 * The model name determines the model-specific configuration type.
 * @typeParam ModelName - Name of the Tabular Foundation Model.
 */
export type TabularOrchestrationPredictRequest<
  ModelName extends keyof ModelConfigRegistry = keyof ModelConfigRegistry
> = GeneratedPredictRequest & {
  modelName: ModelName;
  modelConfig: ModelConfigFor<NoInfer<ModelName>>;
};
