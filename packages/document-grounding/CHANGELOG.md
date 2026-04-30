# @sap-ai-sdk/document-grounding

## 2.10.0

### Minor Changes

- 029f091: [Compatibility Note] `DocumentKeyValueListPair`, `RetrievalDocumentKeyValueListPair`, `VectorDocumentKeyValueListPair`: the `matchMode` property type was narrowed from an open union (`'ANY' | 'ALL' | any`) to the strict `FilterMatchModeEnum` (`'ANY' | 'ALL'`).
- 029f091: [Compatibility Note] `CollectionPendingResponse`: fields `Location` and `status` were removed.
  A new `monitorURL` property was added instead.
- 029f091: [feat] Update document grounding specification.
- 94546e6: [compat] `GoogleDrivePipelineCreateRequest`: the `configuration` property is now required (was optional).
  Code constructing this request without `configuration` must be updated to provide it.
- 94546e6: [compat] `GoogleDriveFolderDetail` type was removed.
  Code referencing `GoogleDriveFolderDetail` must be updated to use `GoogleDriveResourceDetail` instead.
- 029f091: [Compatibility Note] `DataRepositoryType`, `RetrievalSearchSelectOptionEnum`, `VectorSearchSelectOptionEnum`: previously open (`| any`) unions are now strictly typed.
  Only the specified string literals are accepted.
- 029f091: [Compatibility Note] `S3PipelineMinimalResponse`, `SFTPPipelineMinimalResponse`: the `configuration` property is now optional.
- 94546e6: [compat] `GoogleDriveFolder` type was removed and replaced by `GoogleDriveResourceDetail`.
  The properties `id`, `driveId`, and `driverType` were replaced by `resourceType` and `resourceId`.
  Code referencing `GoogleDriveFolder` or its properties must be updated to use `GoogleDriveResourceDetail` with the new property names.
- 029f091: [Compatibility Note] `TextOnlyBaseChunk`: new required field `id: string` added and `metadata` is now optional.
- 94546e6: [compat] `GoogleDriveConfig`: the `folder` property was removed and replaced by a new required `resourceType: 'SHARED_FOLDER' | 'SHARED_DRIVE'` property, plus optional `resourceId` and `includePaths` properties.
  Code constructing `GoogleDriveConfig` objects must be updated to use the new shape.
- 029f091: [Compatibility Note] `BaseDocument` / `DocumentInput`: `chunks` type changed from `TextOnlyBaseChunk[]` to `TextOnlyBaseChunkCreate[]`.
  The `metadata` property is now optional.

### Patch Changes

- Updated dependencies [8cb466a]
  - @sap-ai-sdk/core@2.10.0

## 2.9.0

### Patch Changes

- Updated dependencies [cd3d8ed]
  - @sap-ai-sdk/core@2.9.0

## 2.8.0

### Patch Changes

- @sap-ai-sdk/core@2.8.0

## 2.7.0

### Patch Changes

- Updated dependencies [b11b00c]
- Updated dependencies [56e9c3f]
- Updated dependencies [b12626b]
  - @sap-ai-sdk/core@2.7.0

## 2.6.0

### Patch Changes

- @sap-ai-sdk/core@2.6.0

## 2.5.0

### Patch Changes

- @sap-ai-sdk/core@2.5.0

## 2.4.0

### Patch Changes

- Updated dependencies [2e1d2c2]
  - @sap-ai-sdk/core@2.4.0

## 2.3.0

### Patch Changes

- @sap-ai-sdk/core@2.3.0

## 2.2.0

### Minor Changes

- e2c34f3: [feat] Update document-grounding specification
- e2c34f3: [Compatibility Note] `MSSharePointConfigurationGetResponse` now requires the `sharePoint` property
- e2c34f3: [Compatibility Note] `CommonConfiguration` was replaced with backend-specific types: `SFTPConfiguration` and `S3Configuration`
- e2c34f3: [Compatibility Note] Some types have been renamed to include endpoint-specific prefixes.
  Some instances of the prior names may still exist:
  - `SearchResults` was renamed to `VectorSearchResults` / `RetrievalSearchResults`
  - `Chunk` was renamed to `VectorChunk` / `RetrievalChunk`
  - `SearchFilter` was renamed to `VectorSearchFilter`
  - `KeyValueListPair` was renamed to `VectorKeyValueListPair` / `RetrievalKeyValueListPair`
  - `DocumentKeyValueListPair` was renamed to `VectorDocumentKeyValueListPair` / `RetrievalDocumentKeyValueListPair`
  - `SearchConfiguration` was renamed to `VectorSearchConfiguration` / `RetrievalSearchConfiguration`
  - `SearchSelectOptionEnum` was renamed to `VectorSearchSelectOptionEnum` / `RetrievalSearchSelectOptionEnum`
  - `PerFilterSearchResult` was renamed to `RetrievalPerFilterSearchResult`
  - `PerFilterSearchError` was renamed to `RetrievalPerFilterSearchError`
  - `DataRepositorySearchResult` was renamed to `RetrievalDataRepositorySearchResult`
  - `SearchInput` was renamed to `RetrievalSearchInput`

### Patch Changes

- Updated dependencies [6100bca]
- Updated dependencies [5225275]
- Updated dependencies [347eac1]
  - @sap-ai-sdk/core@2.2.0

## 2.1.0

### Patch Changes

- Updated dependencies [0cf7d80]
  - @sap-ai-sdk/core@2.1.0

## 2.0.0

### Patch Changes

- Updated dependencies [500c0dd]
- Updated dependencies [9e1c43a]
  - @sap-ai-sdk/core@2.0.0

## 1.17.0

### Patch Changes

- @sap-ai-sdk/core@1.17.0

## 1.16.0

### Minor Changes

- efffc16: [feat] Support the new pipeline trigger API and the enhanced pipeline status API.
- efffc16: [compat] Refactor `Pipelines` to `GetPipelines`, `Pipeline` to `GetPipeline`, `PipelinePostRequest` to `CreatePipeline`, `PipelineStatus` to `GetPipelineStatus`, and `RetievalSearchResults` to `RetrievalSearchResults`.

### Patch Changes

- @sap-ai-sdk/core@1.16.0

## 1.15.0

### Patch Changes

- Updated dependencies [5307dd0]
  - @sap-ai-sdk/core@1.15.0

## 1.14.0

### Patch Changes

- fa1e3fe: [New Functionality] Support document grounding with SharePoint and S3 data repositories.
  - @sap-ai-sdk/core@1.14.0

## 1.13.0

### Patch Changes

- Updated dependencies [a6ba3af]
  - @sap-ai-sdk/core@1.13.0

## 1.12.0

### Patch Changes

- @sap-ai-sdk/core@1.12.0

## 1.11.0

### Patch Changes

- Updated dependencies [627a152]
  - @sap-ai-sdk/core@1.11.0

## 1.10.0

### Patch Changes

- Updated dependencies [6f28f47]
  - @sap-ai-sdk/core@1.10.0

## 1.9.0

### Patch Changes

- Updated dependencies [bfed500]
  - @sap-ai-sdk/core@1.9.0

## 1.8.0

### Patch Changes

- @sap-ai-sdk/core@1.8.0

## 1.7.0

### Patch Changes

- @sap-ai-sdk/core@1.7.0

## 1.6.0

### Patch Changes

- @sap-ai-sdk/core@1.6.0

## 1.5.0

### Minor Changes

- 4425bfd: [New Functionality] Add a new package `@sap-ai-sdk/document-grounding` for consuming vector, pipeline and retrieval APIs from document grounding service.

### Patch Changes

- Updated dependencies [b4a5506]
  - @sap-ai-sdk/core@1.5.0
