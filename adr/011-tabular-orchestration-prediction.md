# Tabular Orchestration Prediction Client

## Status

proposed

The prediction SDK is generated from one OpenApi specification, but the checked-in contract and the current Tabular Orchestration v2 documentation are not demonstrably the same.
The checked-in specification identifies itself as version `1.6.0` and already uses `/v1/predict`, but it still:

- generates a request builder that calls `/predict` rather than `/v1/predict`;
- exposes only `sap-rpt-*` values through the closed `TFMEnum`;
- includes `contextSelectionConfig.filterConditions`, which is absent from the referenced v2 documentation;
- places heuristic `indexColumn` under `strategyConfig`, while the v2 documentation also describes a top-level location; and
- requires the internal `ai-main-tenant` header.

The exact documentation and specification revisions used for this comparison have not been pinned.
They must be captured before this ADR is accepted.

The Tabular AI service is intentionally designed to be provider-neutral.
The service contract is structured into a universal layer (model selection and `predictionConfig`), and a TFM-specific passthrough (`modelConfig`) for model-unique parameters that the orchestration service forwards without validation.
Context-selection and target-column semantics are intended to hold the same meaning across all TFMs, as much as possible.

### Generated client

A PoC on branch `davidkna-sap/tab-orc-poc` has produced an initial `TabularOrchestrationClient` under `@sap-ai-sdk/tabular-orchestration`.
It wraps the generated `PredictApi.predictV1PredictPost` operation, resolves the deployment URL internally, and injects the required `ai-resource-group` header, so consumers call `client.predict(body)` directly without AI Core boilerplate.

Two contract issues remain from the PoC:
- `TFMEnum` is still a closed string union of `sap-rpt-*` values.
Because the service is designed to accept any registered model name, this should be widened to `string` (with known values as string-literal suggestions if the TypeScript version allows).
- `modelConfig` is `Record<string, any>`, which accurately reflects wire-level openness but provides no IDE support or compile-time safety for vendor-specific fields.
How to type this without coupling the shared request type to any one provider is the main remaining question, addressed in [Question 1: Vendor-Specific Feature Access](#question-1-vendor-specific-feature-access).

## Decision

No decision has been accepted yet.

The working direction is to ship a single neutral client under `@sap-ai-sdk/tabular-orchestration`.
The open question is the design of typed vendor-specific `modelConfig` support, addressed below in [Question 1: Vendor-Specific Feature Access](#question-1-vendor-specific-feature-access).

## Discussion

### Question 1: Vendor-Specific Feature Access

Recommendation: Option C (generic request type with a config registry).
The request type is parameterized on the model name and separately on the config type, with a conditional default that resolves from a registry.
This should also be workable even if the specification is later revised to include a `modelConfig` schema, with some workaround to reconcile.

#### Current Contract Analysis

The service design places model-unique parameters in `modelConfig` by design.
Adding a new TFM requires zero orchestration schema changes; the TFM integration team documents its own `modelConfig` fields separately.
The generated SDK exposes `modelConfig` as `Record<string, any>`, which accurately reflects wire-level openness but gives consumers no IDE support or compile-time safety for vendor-specific fields.

The following example is representative of the current generated client:

```ts
const request: PredictRequest = {
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
  // Untyped — no IDE completion or compile-time checking for RPT-specific fields.
  modelConfig: { temperature: 0.8 }
};
```

The orchestration layer and `predictionConfig` are already the correct shape for a neutral client.
The unsolved problem is: how does a consumer know which `modelConfig` fields a given TFM accepts, and how does the SDK surface that without locking the shared request type to any one provider?

#### Option A: Keep `modelConfig` fully untyped

Expose `modelConfig` as `Record<string, unknown>` in the public client and leave typing entirely to TFM-specific documentation.

```ts
await client.predict({
  modelName: 'rpt-1',
  scenarioConfigName,
  rows,
  predictionConfig: { targetColumns: [{ name: 'salesgroup', task_type: 'classification' }] },
  modelConfig: { temperature: 0.8, numSamples: 20 }  // accepted, but no compile-time check
});
```

This accurately reflects the wire contract and imposes no maintenance burden.
The downside is that `modelConfig` is a documentation cliff: typos are silent, and there is no IDE completion for vendor-specific fields.
But any conditional-type machinery may be disproportionate complexity for a feature that is outside the happy-path of the orchestrated prediction workflow.

#### Option B: Discriminated union on `modelName`

Type the full request as a discriminated union so that a known `modelName` literal carries its `modelConfig` type:

```ts
type PredictRequest =
  | { modelName: 'rpt-1'; predictionConfig: PredictionConfig; modelConfig?: RptModelConfig }
  | { modelName: string;  predictionConfig: PredictionConfig; modelConfig?: Record<string, unknown> };
```

This is useful for **narrowing on read**—when downstream code receives a `PredictRequest` and dispatches on `modelName`, TypeScript narrows `modelConfig` to the registered type:

```ts
function processRequest(req: PredictRequest) {
  if (req.modelName === 'rpt-1') {
    req.modelConfig?.temperature;  // typed as RptModelConfig field ✓
  }
}
```

It does **not** enforce the correct `modelConfig` shape at the call site.
Because the `string` fallback covers every literal—including `'rpt-1'`—TypeScript checks the object literal against all union members and accepts it as long as it matches any one of them.
`Record<string, unknown>` always matches, so a mistyped RPT config passes without error:

```ts
// ✗ Not caught — second union member accepts anything
await client.predict({ modelName: 'rpt-1', modelConfig: { temperaature: 0.8 } });
```

The drawback is that the union grows with each vendor and cannot span package boundaries cleanly.

#### Option C: Generic request type with a config registry

Parameterize the request on the model name and separately on the config type, with a conditional default that resolves from a registry:

```ts
interface ModelConfigRegistry {
  'rpt-1': RptModelConfig;
  // Additional entries added by declaration merging from provider modules
}

// RptModelConfig must be compatible with Record<string, unknown> for the index
// signature to hold — any plain object interface satisfies this.
type DefaultModelConfig<M extends string> = M extends keyof ModelConfigRegistry
  ? ModelConfigRegistry[M]
  : Record<string, unknown>;

type PredictRequest<M extends string = string, C = DefaultModelConfig<M>> = {
  modelName: M;
  predictionConfig: PredictionConfig;
  modelConfig?: C;
  // …
};

// Method signature — both params default, inference handles the common case
async predict<M extends string = string, C = DefaultModelConfig<M>>(
  body: PredictRequest<M, C>
): Promise<PredictResponse>
```

Three call-site behaviors:

```ts
// Literal modelName → M inferred as 'rpt-1' → modelConfig typed as RptModelConfig
// No explicit type params needed
await client.predict({
  modelName: 'rpt-1',
  predictionConfig: { targetColumns: [{ name: 'salesgroup', task_type: 'classification' }] },
  modelConfig: { temperaature: 0.8 }  // ✗ compile error — typo caught
});

// Unknown model → M inferred as 'new-model' → modelConfig is Record<string, unknown>
await client.predict({
  modelName: 'new-model',
  predictionConfig: { targetColumns: [{ name: 'col' }] },
  modelConfig: { anything: true }  // ✓ open bag
});

// Explicit override — user-supplied config shape, bypasses registry
await client.predict<'rpt-1', { temperature: number; myExtra: string }>({
  modelName: 'rpt-1',
  predictionConfig: { targetColumns: [{ name: 'salesgroup', task_type: 'classification' }] },
  modelConfig: { temperature: 0.8, myExtra: 'x' }
});
```

The registry is an interface, so provider modules extend it via declaration merging without touching the core type.
Inference only works when the model-name literal is present at the call site; a `string`-typed variable widens `M` to `string`, degrading to the open bag—the same caveat applies to all literal-based approaches.
The cost is a more complex type signature; in practice consumers do not need to write `PredictRequest<…>` explicitly.

#### Option D: Typed builder functions per vendor

Keep the request type simple (`modelConfig?: Record<string, unknown>`) and ship typed builder functions alongside each TFM integration that construct a well-typed `modelConfig` object:

```ts
import { rptModelConfig } from '@sap-ai-sdk/tabular-orchestration';

await client.predict({
  modelName: 'rpt-1',
  …,
  modelConfig: rptModelConfig({ temperature: 0.8, numSamples: 20 })
  //           ^^ returns Record<string, unknown> but validates inputs at call site
});
```

The request type stays flat and stable; vendor-specific typing lives in the builder, not in the shared request.
This is the lightest integration: the builder validates inputs at call time, but the result is still untyped at the request level—mistakes like passing `rptModelConfig(…)` to a non-RPT model are not caught by the type system.

### Question 2: Level of Convenience

Resolved by the PoC: Option B (thin convenience client).

#### Option A: Generated request builders only

Expose the generated operation and schema types as the public API.
Consumers perform deployment discovery, destination adjustment, and header selection explicitly.

This minimizes maintenance and stays close to the service contract, but requires consumers to implement deployment resolution to some degree, and to inject the `ai-resource-group` header for every request.

#### Option B: Prediction convenience client

The PoC `TabularOrchestrationClient` wraps the generated operation and handles deployment resolution and header injection.
The public surface is `predict(body)` with the same `PredictRequest` type directly; the generated client remains accessible for consumers that need lower-level control.

### Question 3: Package Boundary

Resolved by the PoC: `@sap-ai-sdk/tabular-orchestration`.

The service contract is provider-neutral, so a vendor-neutral package name accurately reflects the API.
Vendor-specific typed `modelConfig` shapes ship from this same package rather than separate provider packages.
If a future TFM requires a structurally different request that the service does not reconcile, a sibling package can be introduced at that point; there is no need to pre-split now.
