---
'@sap-ai-sdk/document-grounding': minor
---

[compat] `GoogleDriveFolder` type was removed and replaced by `GoogleDriveResourceDetail`.
The properties `id`, `driveId`, and `driverType` were replaced by `resourceType` and `resourceId`.
Code referencing `GoogleDriveFolder` or its properties must be updated to use `GoogleDriveResourceDetail` with the new property names.
