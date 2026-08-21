---
"@sap-ai-sdk/rpt": major
---

feat: add RPT-1.5 support

The `@sap-ai-sdk/rpt` package now targets the RPT-1.5 API. New capabilities available:

- **Explainability**: Add an `explanations` field to `prediction_config`; read feature importance scores per query row from the response.
- **Confidence intervals**: Add a `confidence_interval` field to `PredictResponsePayload` predictions for regression tasks.
- **Health endpoint**: Expose `RptApi.health()` via the internal client.
- **Extended column types**: Expand `ColumnType` from 3 to 16 values (`integer`, `int16`, `int32`, `int64`, `uint8`, `decimal`, `double`, `boolean`, `largestring`, `uuid`, `time`, `datetime`, `timestamp`). Map the new numeric variants to `number`; all other new variants (including `datetime` and `timestamp`, which are full ISO datetime strings) map to `string`.
- **New model names**: Add `'sap-rpt-1.5'` and `'sap-rpt-1.5-large'` to `SapRptModel`.
