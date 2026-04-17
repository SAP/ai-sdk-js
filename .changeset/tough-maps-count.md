---
'@sap-ai-sdk/document-grounding': minor
---

[compat] `GoogleDriveConfig`: the `folder` property was removed and replaced by a new required `resourceType: 'SHARED_FOLDER' | 'SHARED_DRIVE'` property, plus optional `resourceId` and `includePaths` properties.
Code constructing `GoogleDriveConfig` objects must be updated to use the new shape.
