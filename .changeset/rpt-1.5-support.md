---
"@sap-ai-sdk/rpt": major
---

[feat] **Explainability.** Add an `explanations` field to `prediction_config`; read feature importance scores per query row from the response.

[feat] **Confidence intervals.** Add a `confidence_interval` field to `PredictResponsePayload` predictions for regression tasks.

[feat] **Health endpoint.** Expose `RptApi.health()` via the internal client.

[feat] **Extended column types.** Expand `ColumnType` from 3 to 16 values (`integer`, `int16`, `int32`, `int64`, `uint8`, `decimal`, `double`, `boolean`, `largestring`, `uuid`, `time`, `datetime`, `timestamp`).
Map the new numeric variants to `number`; all other new variants (including `datetime` and `timestamp`, which are full ISO strings) map to `string`.
