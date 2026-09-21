# @sap-ai-sdk/rpt

## 2.16.0

### Minor Changes

- ba5b1b4: [feat] Add a `confidence_interval` field to `PredictResponsePayload` predictions for regression tasks.
- ba5b1b4: [feat] Default gzip compression level to 1 for RPT predict requests.
- ba5b1b4: [compat] Deprecate `sap-rpt-1-small` and `sap-rpt-1-large`.
  These model names remain functional until their retirement date (2026-12-31).
- ba5b1b4: [feat] Add an `explanations` field to `prediction_config`; read feature importance scores per query row from the response.
- ba5b1b4: [feat] Expand `ColumnType` from 3 to 16 values (`integer`, `int16`, `int32`, `int64`, `uint8`, `decimal`, `double`, `boolean`, `largestring`, `uuid`, `time`, `datetime`, `timestamp`).
  Map the new numeric variants to `number`; all other new variants (including `datetime` and `timestamp`, which are full ISO strings) map to `string`.
- ba5b1b4: [compat] The server default changed from for `parse_data_types` changed from `true` to `false`.
  Pass `parse_data_types: true` explicitly if you relied on the old default.
- ba5b1b4: [compat] The `RptClient` constructor no longer has a default model name.
  Pass one of the known model names explicitly, e.g. `'sap-rpt-1.5'`.
- ba5b1b4: [compat] Widen `TargetColumnConfig.prediction_placeholder` to accept `null`.
  The type is now `string | number | null` (was `string | number`).
- 21556db: [feat] Add `context_mode` to `PredictionConfig` and `PredictResponseMetadata` (from RPT spec v1.6.0).

### Patch Changes

- Updated dependencies [0da56e2]
- Updated dependencies [3483acb]
- Updated dependencies [94b36e5]
- Updated dependencies [4b2c014]
  - @sap-ai-sdk/core@2.16.0
  - @sap-ai-sdk/ai-api@2.16.0

## 2.15.0

### Patch Changes

- Updated dependencies [a5407c8]
  - @sap-ai-sdk/core@2.15.0
  - @sap-ai-sdk/ai-api@2.15.0

## 2.14.0

### Patch Changes

- Updated dependencies [cca7edd]
- Updated dependencies [cca7edd]
  - @sap-ai-sdk/core@2.14.0
  - @sap-ai-sdk/ai-api@2.14.0

## 2.13.0

### Patch Changes

- Updated dependencies [11baf52]
- Updated dependencies [cb8ffe7]
- Updated dependencies [a8c9b29]
- Updated dependencies [6542a2a]
  - @sap-ai-sdk/core@2.13.0
  - @sap-ai-sdk/ai-api@2.13.0

## 2.12.0

### Patch Changes

- Updated dependencies [0f10482]
- Updated dependencies [e944aa1]
- Updated dependencies [2faf4a8]
  - @sap-ai-sdk/core@2.12.0
  - @sap-ai-sdk/ai-api@2.12.0

## 2.11.0

### Patch Changes

- Updated dependencies [c8c0e41]
- Updated dependencies [75bb9a9]
  - @sap-ai-sdk/core@2.11.0
  - @sap-ai-sdk/ai-api@2.11.0

## 2.10.0

### Patch Changes

- Updated dependencies [8cb466a]
  - @sap-ai-sdk/core@2.10.0
  - @sap-ai-sdk/ai-api@2.10.0

## 2.9.0

### Minor Changes

- 08c6137: [Improvement] Align parquet endpoint types with the RPT API types.

### Patch Changes

- Updated dependencies [cd3d8ed]
  - @sap-ai-sdk/core@2.9.0
  - @sap-ai-sdk/ai-api@2.9.0

## 2.8.0

### Minor Changes

- e0ef84c: [feat] Add generic HTTP request configuration support.
  The `predictWithSchema()` and `predictWithoutSchema()` methods now accept an optional `customRequest` parameter of type `RptRequestOptions`, allowing configuration of custom HTTP request options such as headers, timeout, and middlewares.
- e0ef84c: [feat] Add predict request compression support.
  All requests with a body of 1024 bytes or larger will be automatically compressed with `gzip` by default, unless configured otherwise.
  Compression configuration is available via the `requestCompression` property on the `RptClientConfig` object.

### Patch Changes

- @sap-ai-sdk/ai-api@2.8.0
- @sap-ai-sdk/core@2.8.0

## 2.7.0

### Patch Changes

- 12b4129: [Improvement] Restrict the `task_type` property in the `PredictionConfig` type.
- Updated dependencies [b11b00c]
- Updated dependencies [8616d5e]
- Updated dependencies [56e9c3f]
- Updated dependencies [8616d5e]
- Updated dependencies [b12626b]
- Updated dependencies [8616d5e]
  - @sap-ai-sdk/core@2.7.0
  - @sap-ai-sdk/ai-api@2.7.0

## 2.6.0

### Minor Changes

- 790ad05: [New Functionality] Release Beta version of a client for the SAP-RPT-1 model.

### Patch Changes

- @sap-ai-sdk/ai-api@2.6.0
- @sap-ai-sdk/core@2.6.0
