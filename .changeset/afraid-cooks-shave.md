---
'@sap-ai-sdk/orchestration': minor
---

[Compatibility Note] Deprecate `buildAzureContentFilter()` function.
Use `buildAzureContentSafetyFilter()` function instead and use constants `ALLOW_SAFE`, `ALLOW_SAFE_LOW`, `ALLOW_SAFE_LOW_MEDIUM` or `ALLOW_ALL` to configure the severity levels of each Azure filter category.