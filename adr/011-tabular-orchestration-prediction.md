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
Its default operation name follows the specification's `operationId` (`PredictApi.predictV1PredictPost`). 
It can be replaced with `x-sap-cloud-sdk-operation-name` in the specification, so naming is a specification concern rather than a client-design concern.
The design concern is the RPT-specific shape encoded in the types: a closed `TFMEnum`, `ContextSelectionConfig.filterConditions`, and an untyped `ModelConfig`.
Prediction also runs against a discovered deployment URL rather than the AI Core base destination.
The consumer must therefore resolve the running deployment and override the destination URL, unless they create a custom destination in the destination service.
These are the problems a convenience layer would address and are the reason for Question 2.

The concern is not that only SAP RPT is supported today; a single supported model is expected at this stage.
The concern is that the contract shape is RPT-specific, not just its model list.
This includes the closed `TFMEnum`, the RPT-oriented `modelConfig` fields, and RPT-specific context and explainability semantics.
A different model may not share this shape.
Another tabular model could require a different request and response contract, such as an in-context training-and-test payload instead of RPT's scenario and context-selection model, as well as a different execution model.
The service could reconcile such differences server-side, mapping a shared request to each provider's contract.
However, there is no finalized specification for that reconciliation, and it is not clear that it will be something that the service strives for.
As long as the overall shape, not only the enumerated values, is RPT-first, supporting a structurally different model could require significant changes to the public client design and package boundary.
The model-name extensibility concern shared by generated clients is tracked in [ADR-009](./009-tabular-orchestration-release-strategy.md).

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
  }
};

await PredictApi.predictV1PredictPost(request, {
  'ai-resource-group': resourceGroup
}).execute(destination);
```

The neutral portion is the invocation and the basic data contract: a model identifier, scenario, optional context and query rows, and shared target-column configuration.
The RPT coupling is visible in three places:

- `modelName` is a closed `TFMEnum` containing only `sap-rpt-*` values.
- `modelConfig` forwards arbitrary fields instead of describing a provider-independent capability.
- The client does not represent explainability consistently: the OpenApi description directs model-specific fields to `modelConfig`.
- Context selection and target-column semantics are only agnostic if every supported model gives them the same meaning.
  The current RPT docs document RPT limits, jointly predicted columns, and RPT-specific explainability; Other model providers may not share an equivalent shared contract.

That means, once the `TFMEnum` includes other models, it would make the client appear agnostic without making its types or behavior agnostic.
It would move incompatibilities to runtime validation and to the untyped `modelConfig` object.

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

This is the smallest neutral API, but `providerConfig` remains an escape hatch.
`providerConfig` differs from today's `modelConfig` in intent, not shape.
It is meant to carry provider-scoped settings that may extend beyond the fields `modelConfig` currently forwards, but it remains an untyped bag.
It could eventually have TypeScript convenience types for known providers.
It also assumes providers share the same top-level request.
A provider whose request differs structurally, for example a training-and-test payload rather than scenario and rows, fits this shape only if the service reconciles the difference server-side.
One possible mechanism would be the context registry and a context selector that assembles the training and test data the provider expects.
Without that reconciliation, the provider does not fit inside `providerConfig`; it breaks the neutral shape rather than extending it.
It is appropriate for a transport SDK and for newly introduced providers, not a good developer experience for provider-specific features.

Full harmonization across providers may not be achievable.
The existing Orchestration service already exposes provider-specific configuration that conflicts with a single neutral shape.
An untyped escape hatch is therefore necessary regardless of the option chosen; the choice is how this gap is bridged in the public API.

#### Option B: Neutral core with typed provider profiles

A neutral core can preserve the shared request while provider packages own model names
and optional features:

```ts
const client = new TabularOrchestrationClient({ destination });
});

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

Here the neutral generated client defines the shared operation and wire schema, while the SAP Cloud SDK provides request building, destination execution, and generic http behavior.
`RptProvider` owns RPT model discovery, validation, naming, and conversion of typed RPT options to the wire format.
A future `NotRptProvider` can expose only the capabilities that other models support rather than inheriting RPT fields.

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

`rpt` and `otherModel` can expose unrelated provider-specific inputs and outputs.
The shared interface standardizes only the act of prediction; it does not imply a shared wire request or generated operation.
Authentication, destination handling, request execution, and generic http behavior still come from the SAP Cloud SDK used by each client.
This preserves provider-specific types and allows polymorphic consumers without introducing a neutral transport abstraction.
The interface is useful only if such consumers exist; otherwise it adds generic types without reducing implementation work.

#### Option D: Share nothing

Each provider can ship a separate generated client, public API, and package without a shared orchestration interface, request type, or adapter.
They still reuse the SAP Cloud SDK runtime for destination resolution, request execution, middleware, and error handling.

This is the simplest boundary when provider contracts differ substantially or evolve independently.
It avoids a lowest-common-denominator abstraction, but consumers that support multiple providers must define their own abstraction and provider switching is not uniform.

Even under this boundary, the orchestration value of the service is not lost: for models that share the RPT-style contract a unified client remains possible, and consumers still gain access to prediction inputs through the context-registry service.

### Question 2: Level of Convenience

Recommended Option B: a thin convenience client that mirrors the current RPT client.
It is not a full SDK, but it provides a more convenient interface than the generated request builders alone.

#### Option A: Generated request builders only

Expose the generated operation and schema types as the public API.
Consumers perform deployment discovery, destination adjustment, and header selection explicitly, as in the PoC.

This has the smallest maintenance surface and stays closest to the service contract,
but repeats AI Core integration code in every application and exposes generated names
such as `predictV1PredictPost`.

#### Option B: Prediction convenience client

Add a thin client that mirrors the convenience of the current RPT client.
In general, the API design is similar.

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
