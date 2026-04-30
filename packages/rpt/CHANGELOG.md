# @sap-ai-sdk/rpt

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
