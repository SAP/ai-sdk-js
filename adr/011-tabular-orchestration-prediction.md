# Tabular Orchestration Prediction Client

## Status

proposed

## Context

The prediction SDK is generated from one OpenApi specification, but the checked-in contract and the current Tabular Orchestration v2 documentation are not demonstrably the same.
The checked-in specification identifies itself as version `1.6.0` and already uses `/v1/predict`, but it still:

- generates a request builder that calls `/predict` rather than `/v1/predict`;
- exposes only `sap-rpt-*` values through the closed `TFMEnum`;
- includes `contextSelectionConfig.filterConditions`, which is absent from the referenced v2 documentation;
- places heuristic `indexColumn` under `strategyConfig`, while the v2 documentation also describes a top-level location; and
- requires the internal `ai-main-tenant` header.

The exact documentation and specification revisions used for this comparison have not been pinned.
They must be captured before this ADR is accepted.

### Generated client

The generated prediction client is usable but low-level.
Its default operation name follows the specification's `operationId` (`PredictApi.predictV1PredictPost`), but the specification can replace it with `x-sap-cloud-sdk-operation-name`.
The client-design concerns are the closed RPT-specific types (`TFMEnum`, `ContextSelectionConfig.filterConditions`, and untyped `ModelConfig`) and deployment handling.
Prediction runs against a discovered deployment URL rather than the AI Core base destination, so consumers must resolve the deployment and override the destination URL or create a custom destination.
Question 2 addresses this with a convenience layer.

Supporting only SAP RPT at this stage is expected; the concern is that the contract shape, not just its model list, is RPT-specific.
Another model might require a different contract, such as training-and-test payloads or relational tables instead of RPT's scenario, context-selection, and flat-row model.
The service could reconcile these differences server-side, but no finalized specification commits to doing so in a vendor-neutral way.
Until or unless it does, adding a structurally different model could significantly change the public client and package boundary.
The model-name extensibility concern is discussed below in [Question 1: Client Architecture](#question-1-client-architecture).

## Decision

No decision has been accepted yet.

The working direction is conditional: use a neutral generated client with typed provider profiles if the authoritative service contract is provider-neutral; otherwise publish an explicitly RPT-specific client.
Provider-specific clients may share a small public interface, but do not require a shared orchestration transport because the SAP Cloud SDK already supplies the common http and destination infrastructure.

## Discussion

### Question 1: Client Architecture

#### Current Contract Analysis

The current contract is RPT-first, even though its transport shape is presented as a Tabular Foundation Model API.
The following example is representative of the current generated client:

```ts
const request: PredictRequest = {
  // The enum currently contains only SAP-RPT model names.
  modelName: 'sap-rpt-1.5',
  scenarioConfigName: 'product-prediction-scenario-lowercase',
  rows,
  contextSelectionConfig: {
    numRows: 500,
    strategy: 'heuristic',
    strategyConfig: { indexColumn: 'id' }
  },
  predictionConfig: {
    targetColumns: [{ name: 'salesgroup', task_type: 'classification' }]
  },
  // `modelConfig` is an additional optional property on the request.
  // It is an untyped `Record<string, any>` that forwards arbitrary
  // model-specific fields (e.g. RPT explainability overrides) to the TFM.
  // A typed overlay could specialize it per model, e.g. map each `TFMEnum`
  // value to its own config shape so `sap-rpt-1.5` yields RPT options.
  modelConfig: { /* model-specific options */ }
};

await PredictApi.predictV1PredictPost(request, {
  'ai-resource-group': resourceGroup
}).execute(destination);
```

The invocation and basic data contract are neutral: a model identifier, scenario, optional context and query rows, and target-column configuration.
The RPT coupling is visible in the following:

- `modelName` is a closed `TFMEnum` containing only `sap-rpt-*` values.
- `modelConfig` forwards arbitrary fields instead of describing a provider-independent capability.
- The client does not represent explainability consistently: the OpenApi description directs model-specific fields to `modelConfig`.
- Context selection and target-column semantics are neutral only if every model gives them the same meaning; other providers may not share RPT's limits, jointly predicted columns, or explainability model.

Adding models to `TFMEnum` would therefore make the client appear agnostic while moving incompatibilities to runtime validation and the untyped `modelConfig`.
A typed overlay could narrow `modelConfig` per model instead of leaving it fully open: a mapped type keyed by `TFMEnum` would give each model name its own config shape (e.g. `sap-rpt-1.5` → RPT explainability options).
Adding a model then becomes a typed extension rather than another entry in an untyped bag.

> **Open question for the service owners.** Before committing to a neutral client shape, we should ask the Tabular AI service owners:
>
> - whether the service is intended to become provider-neutral, and if so on what timeline;
> - whether context-selection and target-column semantics are expected to keep the same meaning for other vendors.
>
> The available evidence suggests the contracts already diverge somewhat: TabPFN needs a test/train x/y split whereas RPT follows a more freeform shape`.
> A neutral client that hides this difference would push it into runtime validation rather than types.

#### Option A: Generic generated client only

If the service specification becomes genuinely provider-neutral, the generated surface
could model only fields shared by all providers:

```ts
type CommonPredictionInput = {
  scenarioConfigName: string;
  rows: Row[];
  targets: TargetColumn[];
  context?: { rows?: Row[]; selection?: ContextSelection };
};

type TabularPredictionRequest = CommonPredictionInput & {
  model: { provider: string; name: string; version?: string };
  providerConfig?: Record<string, unknown>;
};

const client = new TabularOrchestrationClient({ destination });
await client.predict({
  model: { name: 'sap-rpt-1.5' },
  scenarioConfigName: 'product-prediction-scenario-lowercase',
  rows,
  targets: [{ name: 'salesgroup', task: 'classification' }]
});
```

This is the smallest neutral API, but `providerConfig` remains an untyped escape hatch for provider-scoped settings.
It assumes providers share the same top-level request; a structurally different request fits only if the service reconciles it, potentially through context-registry selection.
Without that reconciliation, the provider breaks the neutral shape rather than extending it.
This suits a transport SDK and new providers, but not typed provider-specific features.

Full harmonization may not be achievable: the existing Orchestration service already exposes provider-specific configuration.
An untyped escape hatch is therefore necessary; the choice is how the public API bridges it.

#### Option B: Neutral core with typed provider profiles

A neutral core can preserve the shared request while provider packages own model names
and optional features:

```ts
const client = new TabularOrchestrationClient({ destination });

const rpt = new RptProvider(client);
await rpt.predict({
  model: 'sap-rpt-1.5',
  scenarioConfigName,
  rows,
  targets: [{ name: 'salesgroup', task: 'classification' }],
  explanations: {
    topColumnScores: 3,
    topRelevantContextRows: 2
  }
});
```

The neutral generated client defines the shared operation and wire schema, while `RptProvider` owns RPT discovery, validation, naming, and conversion of typed options.
A future provider can expose only its supported capabilities.

#### Option C: Provider-specific clients sharing a minimal interface

Each provider can have its own generated or handwritten client and request types while implementing a small interface for consumers that need to select a provider at runtime:

```ts
interface TabularPredictionClient<Input, Output> {
  predict(input: Input): Promise<Output>;
}

const rpt = new RptOrchestrationClient({ destination });
await rpt.predict({
  model: 'sap-rpt-1.5',
  scenarioConfigName,
  rows,
  targets: [{ name: 'salesgroup', task: 'classification' }],
  explanations: { topColumnScores: 3 }
});

const otherModel = new OtherModelOrchestrationClient({ destination });
await otherModel.predict({
  model: 'other',
  scenarioConfigName,
  rows,
  targets: [{ name: 'salesgroup', task: 'classification' }]
});
```

The clients can expose unrelated provider-specific inputs and outputs.
The interface standardizes only prediction, while authentication, destinations, and request execution remain with the SAP Cloud SDK.
This supports polymorphic consumers without implying a shared wire contract, but adds little value if no such consumers exist.

#### Option D: Share nothing

Each future provider (if any) can ship a separate client, API, and package while reusing the SAP Cloud SDK runtime.

This is the simplest boundary for substantially different or independently evolving contracts, but multi-provider consumers must define their own abstraction.
This option will avoid issues if the service does end up reconciling different provider contracts in a shared specification.

Models that share the RPT-style contract can still use a unified client, and consumers still access prediction inputs through the context-registry service.

### Question 2: Level of Convenience

Recommended Option B: a thin convenience client that mirrors the current RPT client without becoming a full SDK.

#### Option A: Generated request builders only

Expose the generated operation and schema types as the public API.
Consumers perform deployment discovery, destination adjustment, and header selection explicitly, as in the PoC.

This minimizes maintenance and stays close to the service contract, but repeats AI Core integration code and exposes names such as `predictV1PredictPost`.

#### Option B: Prediction convenience client

Add a thin client with an API similar to the current RPT client.

### Question 3: Package Boundary

The package name must follow the architecture and contract decision rather than imply provider neutrality in advance.

#### Option A: Release under a vendor-specific package

```text
@sap-ai-sdk/rpt-orchestration
```

**Pros:**

- Accurately reflects the RPT coupling; a future client for a different model can live in a sibling package without a breaking rename.
- Easier to deprecate if a major breaking change is required in the future.

**Cons:**

- Less discoverable; the vendor name becomes part of the public API surface.
- Requires separate provider packages if several providers are added.

#### Option B: Release provider entry points from a vendor-neutral package

Use one package with provider-specific classes or subpath exports:

```text
@sap-ai-sdk/tabular-orchestration
  -> export class RptOrchestrationClient
```

or:

```text
@sap-ai-sdk/tabular-orchestration/rpt
```

**Pros:** Keeps a neutral package boundary while making RPT specificity visible at the import or type level.

**Cons:** Couples the neutral package release cycle to provider-specific APIs and can accumulate provider terminology in one package.

#### Option C: Single vendor-neutral package and client

```text
@sap-ai-sdk/tabular-orchestration
```

This option assumes the authoritative specification becomes genuinely provider-neutral before release.
If provider-specific behavior remains, the contingency is to introduce a typed provider entry point, deprecate the misleading neutral client, and preserve compatibility through an alias where possible.

**Pros:**

- Simplest public surface.
- No provider-specific terminology if the service contract is actually uniform.

**Cons:**

- Conceals current RPT coupling.
- May require a breaking rename if provider capabilities diverge.
