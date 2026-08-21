# RPT Package Versioning Strategy

## Status

proposed

## Context

The current `@sap-ai-sdk/rpt` package targets RPT-1.0. RPT-1.5 introduces breaking changes (detailed below).

The existing RPT-1.0 model names (`sap-rpt-1-small`, `sap-rpt-1-large`) are not yet deprecated and have a retirement date of no earlier than 2026-12-31, meaning 1.0 and 1.5 deployments will coexist for at least the remainder of 2026.

We need to decide, how to handle such updates in the future.

### Breaking Changes and SDK Handling

<!-- prettier-ignore -->
| Change | SDK handling | Consumer impact |
| ------ | ------------ | --------------- |
| `predict_parquet`: `parse_data_types` default flips `true` → `false` | Follow the spec | Must pass `parse_data_types: true` explicitly to preserve old behavior |
| `TargetColumnConfig` and `SchemaFieldConfig` gain `additionalProperties: false` | No action — enforced by the server | Extra properties now cause validation errors |
| `PredictRequestPayload`: `rows`/`columns` become strictly required via `oneOf` | No action — `PredictionData<T>` already enforces this via `Xor<>` | None |

### New Features in 1.5

<!-- prettier-ignore -->
| Feature | SDK handling | Notes |
| ------- | ------------ | ----- |
| Explainability support (`PredictionConfig.explanations`, `PredictResponsePayload.explanations`) | Expose generated types as-is | Pass `explanations` in `prediction_config`; read from response |
| `PredictionResult.confidence_interval` | Expose generated types as-is | `[number, number] \| null`; regression only |
| `GET /health` endpoint | Expose via generated `RptApi` | Internal client only |
| `TargetColumnConfig.prediction_placeholder` accepts `null` | No action | Additive |
| `Content-Encoding: gzip` formally documented on `/predict` | No action — compression middleware already handles this | Additive |
| `ColumnType` expands from 3 to 16 values | Map new types in `types.ts` (integer variants → `number`, `boolean` → `boolean`, `timestamp`/`datetime` → `DateString`) | Additive — consumers gain access to extended type vocabulary |

### Open Questions / Notes

- **Why was supporting `prediction_config` as a string on the `/predict` endpoint suggested in the BLI?** The current decision is to keep the typed object only (the spec does not support a string form here). But the BLI explicitly raises this — needs clarification from the author whether there is a concrete use case that motivated it, or whether it was prompted by the parquet endpoint situation.

## Decision

Bump `@sap-ai-sdk/rpt` to support RPT-1.5, issue a major version changeset documenting breaking changes, and drop RPT-1.0-specific behavior.

Pros:

- Single install, single import path — no consumer confusion about which package to use.
- Maintenance overhead stays constant regardless of how many RPT versions the model team ships.
- Follows the precedent set by other packages in this repo (e.g. `@sap-ai-sdk/foundation-models` ships all Azure OpenAI versions under one package).

Cons:

- Consumers pinned to RPT-1.0 deployments must stay on the old package version and cannot take newer SDK updates without also migrating their deployment.

# Appendix

## Considered Alternative: Separate packages per RPT version

Publish a distinct npm package for each RPT version — e.g. `@sap-ai-sdk/rpt-1` for RPT-1.0 and `@sap-ai-sdk/rpt-1.5` for RPT-1.5 — each with its own generated client, schema types, and hand-written wrapper.

Pros:

- Perfect isolation — types and behavior for each server version never bleed into each other.
- Consumers can depend on both packages simultaneously if they run mixed deployments.
- No forced migration: a consumer on RPT-1.0 stays on `@sap-ai-sdk/rpt-1` indefinitely without being affected by 1.5 changes.

Cons:

- Package proliferation — each new RPT version adds a new package to the registry, the repo, and the release pipeline.
- Consumers must know which package name corresponds to their deployment version, adding discovery friction.
- Shared improvements (bug fixes, new SDK features) must be backported to every active package rather than landing once.
- Increases maintenance surface unboundedly as the number of supported RPT versions grows.
