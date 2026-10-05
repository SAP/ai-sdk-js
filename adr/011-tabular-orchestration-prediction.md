# Tabular Orchestration Prediction Client

## Status

proposed — pending final judgment on the package name and minimal deployment integration

This ADR covers the final Tabular AI Orchestration OpenApi specification, version 1.9.1.
The specification is the implementation baseline for an experimental client: it declares the `/predict` operation, deployment-scoped server URL, required `ai-resource-group` header, row and column input forms, context selection, model-specific RPT configuration, response metadata, and service errors.

The remaining contract risk is acceptable for an experimental release.
In particular, `TFMEnum` is still a closed set of `sap-rpt-*` values, while the model schemas remain forward-compatible through `additionalProperties: true`.
Whether arbitrary registered model names should be accepted can be revisited after service feedback.

Provider harmonization and handwritten model-type machinery are outside the first release.

### Generated client

A PoC on branch `davidkna-sap/tab-orc-poc` produced an initial `TabularOrchestrationClient` under the provisional package name `@sap-ai-sdk/tabular-orchestration`.
It demonstrated the only handwritten behavior needed in the initial release: resolving the deployment URL and injecting the required `ai-resource-group` header.

The final specification is substantially more complete than the one used by the PoC.
In particular, `PredictRequest.modelConfig` is now a union of generated `ModelRpt1`, `ModelRpt1_5`, and `ModelRpt1_6` schemas rather than an untyped record.
The generated prediction operation and schema types are therefore sufficient as the public experimental surface; a separate convenience wrapper around `predict` is not needed.

## Decision

Release an experimental prediction client when generation from the final specification succeeds and the client executes reliably.
Expose the generated prediction operation and types directly, adding only the deployment resolution and required-header handling needed to call the deployment through SAP AI Core.

Do not delay the experimental release for a broader convenience API, provider harmonization, or custom model-config typing.
The final package name remains pending between `@sap-ai-sdk/tabular-orchestration` and `@sap-ai-sdk/tabular-ai-sdk`; choose the name that matches the service's final public name.

## Discussion

### Question 1: Vendor-Specific Feature Access

**Decision for the experimental release: use the generated model configuration types.**

Version 1.9.1 models `PredictRequest.modelConfig` as a union of `ModelRpt1`, `ModelRpt1_5`, and `ModelRpt1_6`.
Those schemas cover the documented RPT data schema, parsing, explanation, and context-mode settings while allowing additional properties for forward compatibility.

This is sufficient for the initial client and avoids a second, SDK-maintained type system.
Do not add a declaration-merging registry, discriminated union, or vendor-specific builder until usage demonstrates a concrete gap in the generated contract.
The closed `TFMEnum` remains an explicit experimental limitation and should be reconsidered if the service confirms that arbitrary registered model names are valid.

### Question 2: Level of Convenience

**Decision: generated API plus required deployment integration only.**

Expose the generated prediction operation rather than adding a handwritten `predict(body)` facade that mirrors it.
The SDK still needs to resolve the deployment URL and provide the required `ai-resource-group` header because those are execution prerequisites, not optional workflow convenience.

Any further convenience methods are follow-up work and should be justified by feedback from the experimental package.

### Question 3: Package Boundary

**Pending final judgment.** The candidates are `@sap-ai-sdk/tabular-orchestration` and `@sap-ai-sdk/tabular-ai-sdk`.
Use the package name that matches the service's final public name; do not let this naming decision delay implementation against the final specification.
