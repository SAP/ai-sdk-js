---
'@sap-ai-sdk/foundation-models': major
'@sap-ai-sdk/orchestration': major
---

[Compatibility Note] Change stream method parameter from `AbortController` to `AbortSignal`.
The `stream()` method now accepts an `AbortSignal` instead of an `AbortController` as the second parameter in both Azure OpenAI and Orchestration clients.
