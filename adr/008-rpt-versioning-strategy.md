# RPT Package Versioning Strategy

## Status

proposed

## Context

The current `@sap-ai-sdk/rpt` package targets RPT-1.0. RPT-1.5 introduces breaking changes at the spec level:

1. `POST /predict_parquet`: `prediction_config` changes from a structured object to a JSON-serialized string on the wire.
2. `POST /predict_parquet`: `parse_data_types` default flips from `true` to `false`.
3. `ColumnType` enum expands from 3 to 16 values — any exhaustive switch/conditional in consumer code gains unhandled cases.
4. `TargetColumnConfig` and `SchemaFieldConfig` gain `additionalProperties: false` — extra properties previously ignored now cause validation errors.

Additionally, the RPT team has signaled that further breaking changes are expected in future versions (e.g. RPT-1.6 is already in progress). We need to decide how to structure our package(s) going forward.

The existing RPT-1.0 model names (`sap-rpt-1-small`, `sap-rpt-1-large`) are not yet deprecated and have a retirement date of no earlier than 2026-12-31, meaning 1.0 and 1.5 deployments will coexist for at least the remainder of 2026.

## Decision

tbd

## Breaking Changes and SDK Handling

<!-- prettier-ignore -->
| Change | SDK handling | Consumer impact |
| ------ | ------------ | --------------- |
| `predict_parquet`: `prediction_config` changes from object to JSON string | tbd — pending RPT team confirmation | tbd |
| `predict_parquet`: `parse_data_types` default flips `true` → `false` | Follow the spec | Must pass `parse_data_types: true` explicitly to preserve old behavior |
| `ColumnType` expands from 3 to 16 values | Map new types in `types.ts` (integer variants → `number`, `boolean` → `boolean`, `timestamp`/`datetime` → `DateString`) | Exhaustive switches on `ColumnType` gain unhandled cases |
| `TargetColumnConfig` and `SchemaFieldConfig` gain `additionalProperties: false` | No action — enforced by the server | Extra properties now cause validation errors |
| `PredictRequestPayload`: `rows`/`columns` become strictly required via `oneOf` | No action — `PredictionData<T>` already enforces this via `Xor<>` | None |

## New Features in 1.5

<!-- prettier-ignore -->
| Feature | SDK handling | Notes |
| ------- | ------------ | ----- |
| Explainability support (`PredictionConfig.explanations`, `PredictResponsePayload.explanations`) | Expose generated types as-is | Pass `explanations` in `prediction_config`; read from response |
| `PredictionResult.confidence_interval` | Expose generated types as-is | `[number, number] \| null`; regression only |
| `GET /health` endpoint | Expose via generated `RptApi` | Internal client only |
| `TargetColumnConfig.prediction_placeholder` accepts `null` | No action | Additive |
| `Content-Encoding: gzip` formally documented on `/predict` | No action — compression middleware already handles this | Additive |

# Discussion

## Option 1: Single package, update in place

Bump `@sap-ai-sdk/rpt` to support RPT-1.5, issue a major version changeset documenting breaking changes, and drop RPT-1.0-specific behavior.

Pros:

- Single install, single import path — no consumer confusion about which package to use.
- Maintenance overhead stays constant regardless of how many RPT versions the model team ships.
- Follows the precedent set by other packages in this repo (e.g. `@sap-ai-sdk/foundation-models` ships all Azure OpenAI versions under one package).

Cons:

- Consumers pinned to RPT-1.0 deployments must stay on the old package version and cannot take newer SDK updates without also migrating their deployment.

## Option 2: Single package, support both versions

Keep `@sap-ai-sdk/rpt` but export separate client classes (e.g. `RptClient` for 1.0, `Rpt15Client` for 1.5) or use method overloads to support both server versions from the same package.

Pros:

- Single install for consumers who need to support both server versions simultaneously.
- No forced migration — 1.0 users can stay on the same package version.

Cons:

- The generated client and schema types would need to be duplicated or heavily branched inside the package (two specs, two generated clients, two sets of hand-written types).
- Every future RPT version adds another layer; the package grows unbounded in complexity.
- The RPT team expects further breaking changes — this approach does not scale.
- Versioned class names (e.g. `Rpt15Client`) are an awkward API and invite the question of when to remove them.

## Option 3: Separate subpath exports within one package

Keep a single `@sap-ai-sdk/rpt` npm package but expose versioned entry points via the `exports` field in `package.json`. The root import always re-exports the latest version; older versions remain accessible via pinned sub-paths:

```ts
import { RptClient } from '@sap-ai-sdk/rpt'; // always latest (currently 1.5)
import { RptClient } from '@sap-ai-sdk/rpt/1.0'; // pinned to 1.0
import { RptClient } from '@sap-ai-sdk/rpt/1.5'; // pinned to 1.5
```

Each subpath has its own generated client, schema types, and hand-written wrapper — fully isolated internally, but shipped as one versioned npm release.

Pros:

- Single package install and single release pipeline — no package proliferation.
- Perfect isolation between versions — 1.0 and 1.5 types do not bleed into each other.
- Consumers can import both versions simultaneously if they run mixed deployments.
- New RPT versions only require adding a new subpath entry — the pattern scales to any number of future versions without structural changes.

Cons:

- Subpath exports are less discoverable than top-level package names — consumers need to know to look for `@sap-ai-sdk/rpt/1.5`.
- Internal package complexity grows with each version: multiple specs, multiple generated clients, multiple sets of hand-written types all in one package.
- The RPT team expects further breaking changes — each new version still requires duplicating the full client stack inside the package.
- Requires careful `exports` and `typesVersions` configuration to ensure TypeScript resolves subpath types correctly.

# Open Questions / Notes

- **Do 1.5 deployments use new model names or replace existing ones?** The RPT team needs to confirm whether RPT-1.5 is deployed under new model identifiers (e.g. `sap-rpt-1.5-small`) or reuses the existing `sap-rpt-1-small`/`sap-rpt-1-large` names. If the model names are reused, a per-version package strategy (Option 3) breaks down — the same deployment name would need to be handled by two different packages simultaneously.

- **If old deployments are retired or stop working**, there is no reason to keep old version sub-paths in the package. In that case Options 2 and 3 simplify significantly.

- **Is `prediction_config` as a JSON string in `predict_parquet` intentional?** In 1.5 the spec changes `prediction_config` in the parquet multipart form from a structured object to a JSON-encoded string. This may be a mistake in the spec — needs confirmation from the RPT team before deciding how the SDK should handle it. If intentional, the SDK should serialize transparently in `predictParquet()` so consumers are not exposed to the wire format change.

- **Why was supporting `prediction_config` as a string on the `/predict` endpoint suggested in the BLI?** The current decision is to keep the typed object only (the spec does not support a string form here). But the BLI explicitly raises this — needs clarification from the author whether there is a concrete use case that motivated it, or whether it was prompted by the parquet endpoint situation.
